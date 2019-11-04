import { BONE_TYPE } from "../../const/Enums";
import PoolUtil from "../utils/PoolUtil";
import ResLoader from "./ResLoader";
import Bone_Ctrl from "../ani/Bone_Ctrl";
import Log from "../utils/Log";
import Bullet_Ctrl from "../../game/BattleUI/bullet/Bullet_Ctrl";

/**
 * 工厂类
 * @author weiqiang.huang - David
 */
export default class F {
    /**
     * 创建龙骨动画
     * @param type 类型
     * @param path 路径
     * @param armatureName 龙骨名字
     * @param aniName 初始动作名字
     * @param playTimes 播放次数 -1是根据龙骨文件   0无限循环   大于0就是播放次数
     * @param zoom  缩放
     * @param isNew 是否创建新的
     * @param boneDisplay   如果不是创建新的这里传入旧的龙骨组件
     */
    public static createBone(type: string, path: string, armatureName: string, aniName: string, playTimes: number, zoom: number = 1, isNew: boolean = true, boneDisplay: dragonBones.ArmatureDisplay = null) {
        return new Promise((resolve, reject) => {
            let poolObj = PoolUtil.get(type, armatureName);
            if (poolObj) {
                poolObj.parent = null;
                resolve(poolObj);
            } else {
                switch (type) {
                    case BONE_TYPE.HERO:
                    case BONE_TYPE.MONSTER:
                        ResLoader.loadResByPromise("prefabs/role/role", cc.Prefab).then((rolePrefab: cc.Node) => {
                            ResLoader.loadDragonRes(path, armatureName, aniName, playTimes, isNew, boneDisplay).then((armatureDisplay: dragonBones.ArmatureDisplay) => {
                                let dir: number = type == BONE_TYPE.HERO ? 1 : -1;
                                armatureDisplay.node.addComponent("RoleBone_Ctrl");
                                rolePrefab.addChild(armatureDisplay.node);
                                rolePrefab.setScale(zoom * dir, zoom);
                                rolePrefab.addComponent("Role_Ctrl");
                                resolve(rolePrefab);
                            });
                        });
                        break;
                    case BONE_TYPE.EFFECT:
                        ResLoader.loadDragonRes(path, armatureName, aniName, playTimes, isNew, boneDisplay).then((armatureDisplay: dragonBones.ArmatureDisplay) => {
                            armatureDisplay.node.addComponent("Bone_Ctrl");
                            let ctrl: Bone_Ctrl = armatureDisplay.getComponent("Bone_Ctrl");
                            ctrl.updateBoneData(type, armatureName, playTimes);
                            resolve(armatureDisplay.node);
                        });
                        break;
                    case BONE_TYPE.BULLET:
                        ResLoader.loadResByPromise("prefabs/bullet/bullet", cc.Prefab).then((bullet: cc.Node) => {
                            ResLoader.loadDragonRes(path, armatureName, aniName, playTimes, isNew, boneDisplay).then((armatureDisplay: dragonBones.ArmatureDisplay) => {
                                bullet.addChild(armatureDisplay.node);
                                bullet.addComponent("Bullet_Ctrl");
                                let ctrl: Bullet_Ctrl = bullet.getComponent("Bullet_Ctrl");
                                ctrl.poolName = armatureName;
                                resolve(bullet);
                            });
                        });
                        break;
                }
            }
        });
    }

    /** 创建预设 */
    public static createPrefab(type: string, path: string) {
        return new Promise((resolve, reject) => {
            let prefab = PoolUtil.get(type, path);
            if (prefab) {
                resolve(prefab);
            } else {
                ResLoader.loadRes(path, cc.Prefab, (err, asset) => {
                    if (err) {
                        Log.traceError(`创建 prefab 失败 type:${type} - path:${path}!!!`);
                        return;
                    }
                    resolve(asset);
                });
            }
        });
    }
}
