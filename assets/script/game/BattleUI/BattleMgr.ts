import DataCenter from "../model/DataCenter";
import { SHEET_NAME } from "../../framework/db/ExcelAnalysis";
import Log from "../../framework/utils/Log";
import MathUtil from "../../framework/utils/MathUtil";
import Scene_Ctrl from "../HallUI/Scene_Ctrl";
import F from "../../framework/loader/F";
import { BONE_TYPE, ACTION_NAME, ROLE_STATE } from "../../const/Enums";
import Paths from "../../configs/Paths";
import Role_Ctrl from "./role/Role_Ctrl";
import Bullet_Ctrl from "./bullet/Bullet_Ctrl";

/**
 * 战斗类
 * @author weiqiang.huang - David
 */
export default class BattleMgr {
    /** 开始突袭 */
    public startRaid(page: number, index: number = 1): void {
        let stage = DataCenter.excelJson.getData(SHEET_NAME.STAGE, page);
        if (stage) {
            if (DataCenter.battleM.raidSchedule.has(page)) {
                //当前突袭的关卡等级
                let raidLevel: number = DataCenter.battleM.raidSchedule.get(page);
                //突袭怪物的数据列表
                let raidMonsterDataList: { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any }[] = this.getRaidMonsterData(stage, raidLevel);
                this.startBrushMonster(page, index, stage.time, raidMonsterDataList);
            }
        } else {
            Log.traceError("无法找到突袭的章节 - page:", page);
        }
    }

    /** 开始刷怪 */
    private startBrushMonster(page: number, index: number, time: number, monsterDataList: { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any }[]): void {
        let sceneData = DataCenter.hallM.getSceneByPage(page, index);
        let sceneCtrl: Scene_Ctrl = sceneData.sceneNode.getComponent("Scene_Ctrl");
        let movePath = sceneCtrl.data.sceneExcel.movePath.split("#");
        let bornPos: string[] = movePath[0].split("|");
        let listIndex: number = 0;
        let timeCallback = () => {
            let baseData = monsterDataList[listIndex];
            F.createBone(BONE_TYPE.MONSTER, Paths.getRoleBoneUrl(baseData.monsterExcel.boneFile), baseData.monsterExcel.boneFile, ACTION_NAME.MOVE, 0, Number(baseData.monsterExcel.zoomOut)).then((rolePrefab: cc.Node) => {
                sceneData.sceneNode.addChild(rolePrefab);
                rolePrefab.setPosition(Number(bornPos[0]), Number(bornPos[1]));
                let ctrl: Role_Ctrl = rolePrefab.getComponent("Role_Ctrl");
                ctrl.baseData = baseData;
                this.updateMonsterData(sceneData, page, index, ctrl);
                DataCenter.battleM.raidMonsters.push(rolePrefab);
                Log.trace(`第${listIndex}怪：`, rolePrefab);
            });
            listIndex++;
        };

        sceneCtrl.schedule(timeCallback, time / 1000, monsterDataList.length - 1);
        if (page == 1 && index == 0) {
            sceneCtrl.schedule(
                () => {
                    sceneCtrl.openDoor();
                },
                3,
                0
            );
        }
    }

    /** 获取怪物的行走路径 */
    private getMonsterMovePath(movePath: string[]): cc.Vec2[] {
        let path: cc.Vec2[] = [];
        for (let i = 0; i < movePath.length; i++) {
            const element = MathUtil.splitToNumber(movePath[i], "|");
            path.push(element);
        }
        return path;
    }

    /** 获取突袭的怪物数据 */
    private getRaidMonsterData(stage: any, raidLevel: number): { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any }[] {
        let dataList: { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any }[] = [];
        let count: number = stage.maxCount;
        //每10关出一个boss
        if (raidLevel % 10 == 0) {
            let bossList = stage.bossList.split("#");
            let bossId: number = Number(bossList[MathUtil.rangeInt(0, bossList.length, false)]);
            let boss = this.getMonsterData(bossId, raidLevel, stage.difficulty);
            if (boss) dataList.push(boss);
            count -= 1;
        }
        //每5关出一个精英
        if (raidLevel % 5 == 0) {
            let eliteList = stage.eliteList.split("#");
            let eliteId: number = Number(eliteList[MathUtil.rangeInt(0, eliteList.length, false)]);
            let elite = this.getMonsterData(eliteId, raidLevel, stage.difficulty);
            if (elite) dataList.push(elite);
            count -= 1;
        }
        let monsterList = stage.monsterList.split("#");
        for (let i = 0; i < count; i++) {
            const monsterId: number = Number(monsterList[MathUtil.rangeInt(0, monsterList.length, false)]);
            let monster = this.getMonsterData(monsterId, raidLevel, stage.difficulty);
            if (monster) dataList.push(monster);
        }
        //倒序一下把小怪放到列表最前面
        dataList.reverse();
        return dataList;
    }

    /** 组装怪物数据 */
    private getMonsterData(monsterId: number, raidLevel: number, difficulty: number): { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any } {
        let vo = DataCenter.excelJson.getData(SHEET_NAME.MONSTER, monsterId);
        if (vo) {
            let data = {
                type: BONE_TYPE.MONSTER,
                blood: vo.maxBlood * (1 + raidLevel + difficulty),
                damage: vo.damage * (1 + raidLevel + difficulty),
                movePath: [],
                monsterExcel: vo
            };
            return data;
        } else {
            Log.traceError("无法找到monster表中的数据   id:", monsterId);
        }
        return null;
    }

    /** 移动下一个场景 */
    public moveNextScene(page: number, index: number, ctrl: Role_Ctrl): void {
        //已经达到最高的场景了，玩家失败
        let newSceneIndex: number = index + 1;
        if (newSceneIndex > DataCenter.hallM.maxSceneCount) {
            return;
        }
        let sceneData = DataCenter.hallM.getSceneByPage(page, newSceneIndex);
        //当前章节的下一个场景还没有解锁
        if (!sceneData.unlock || newSceneIndex > DataCenter.hallM.maxSceneCount) {
            return;
        }
        this.updateMonsterData(sceneData, page, newSceneIndex, ctrl);
        ctrl.node.parent = sceneData.sceneNode;
        ctrl.start();
    }

    /** 更新怪物的数据 */
    private updateMonsterData(sceneData: { unlock: boolean; sceneNode: cc.Node }, page: number, sceneIndex: number, ctrl: Role_Ctrl): void {
        let sceneCtrl: Scene_Ctrl = sceneData.sceneNode.getComponent("Scene_Ctrl");
        let movePath = sceneCtrl.data.sceneExcel.movePath.split("#");
        let bornPos: string[] = movePath[0].split("|");
        ctrl.node.setPosition(Number(bornPos[0]), Number(bornPos[1]));
        ctrl.baseData.movePath = this.getMonsterMovePath(movePath);
        ctrl.page = page;
        ctrl.sceneIndex = sceneIndex;
        ctrl.isInvincible = true;
    }

    /** 点击场景/怪物扣血 */
    private _isClickScene: boolean = true;
    public attackMonsterByClick(page: number, sceneIndex: number, index: number = 0, startPos: cc.Vec2 = null, scene: cc.Node = null): void {
        if (DataCenter.battleM.raidMonsters.length) {
            if (startPos && scene && this._isClickScene) {
                this._isClickScene = false;
                //这里是点击场景后出现的怪物伤害
                for (let i = 0, len = DataCenter.battleM.raidMonsters.length; i < len; i++) {
                    const monster = DataCenter.battleM.raidMonsters[i];
                    let ctrl: Role_Ctrl = monster.getComponent("Role_Ctrl");
                    if (ctrl.page == page && ctrl.sceneIndex == sceneIndex && monster.x > -(scene.width >> 1)) {
                        Log.trace("monster index:", i);
                        //飞出子弹让怪物扣血
                        F.createBone(BONE_TYPE.BULLET, Paths.getBoneUrl("ui_fly_01"), "ui_fly_01", "ui_fly_01", -1).then((bullet: cc.Node) => {
                            scene.addChild(bullet);
                            let ctrl: Bullet_Ctrl = bullet.getComponent("Bullet_Ctrl");
                            ctrl.updateBulletData(startPos, monster);
                            this._isClickScene = true;
                        });
                        return;
                    }
                }
                this._isClickScene = true;
            } else {
                //这里是直接点击怪物出现的伤害
                let monster = DataCenter.battleM.raidMonsters[index];
                if (monster) {
                    let ctrl: Role_Ctrl = monster.getComponent("Role_Ctrl");
                    if (ctrl.state == ROLE_STATE.DIE) return;
                    //怪物直接扣血
                    ctrl.updateBlood(0);
                }
            }
        }
    }

    private static _ins: BattleMgr;
    public static get Ins(): BattleMgr {
        if (BattleMgr._ins == null) {
            BattleMgr._ins = new BattleMgr();
        }
        return BattleMgr._ins;
    }
}
