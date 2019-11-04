import ViewCtrl from "../../../framework/ui/ViewCtrl";
import { BONE_TYPE, ROLE_STATE } from "../../../const/Enums";
import BattleMgr from "../BattleMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Role_Ctrl extends ViewCtrl {
    /** 基础数据 */
    public baseData: { type: string; blood: number; damage: number; movePath: cc.Vec2[]; monsterExcel: any };
    /** 是否无敌状态中 */
    public isInvincible: boolean = true;
    /** 怪物当前存在的章节 */
    public page: number = 0;
    /** 怪物存在的场景的下标 */
    public sceneIndex: number = 0;
    /** 是否可以移动 */
    private _isMove: boolean = false;
    private _moveIndex: number = 0;
    /** 状态 */
    private _state: number = 0;

    onLoad() { }

    start() {
        this._moveIndex = 0;
        this._isMove = this.baseData.type == BONE_TYPE.MONSTER;
        this._state = this._isMove ? ROLE_STATE.MOVE : ROLE_STATE.STAND;
    }

    /** 更新血量 */
    public updateBlood(blood: number, isCrit: boolean = false): void {
        
    }

    update(dt) {
        if (this._isMove) {
            var dirX: number;
            if (Math.abs(Number(this.baseData.movePath[this._moveIndex].x) - this.node.x) > this.baseData.monsterExcel.speed * dt) {
                dirX = Number(this.baseData.movePath[this._moveIndex].x) - this.node.x > 0 ? 1 : -1;
                this.node.x += this.baseData.monsterExcel.speed * dirX * dt;
                //取消无敌状态
                if (this.isInvincible) this.isInvincible = false;
            } else {
                this.node.x = Number(this.baseData.movePath[this._moveIndex].x);
                dirX = 0;
                this._moveIndex++;
                if (this._moveIndex >= this.baseData.movePath.length) {
                    this._isMove = false;
                    BattleMgr.Ins.moveNextScene(this.page, this.sceneIndex, this);
                    return;
                }
            }

            var dirY: number;
            if (Math.abs(Number(this.baseData.movePath[this._moveIndex].y) - this.node.y) > this.baseData.monsterExcel.speed * dt) {
                dirY = Number(this.baseData.movePath[this._moveIndex].y) - this.node.y > 0 ? 1 : -1;
                this.node.y += this.baseData.monsterExcel.speed * dirY * dt;
            } else {
                this.node.y = Number(this.baseData.movePath[this._moveIndex].y);
                dirY = 0;
            }
        }
    }

    /** 获取当前的状态 */
    get state(): number {
        return this._state;
    }
}
