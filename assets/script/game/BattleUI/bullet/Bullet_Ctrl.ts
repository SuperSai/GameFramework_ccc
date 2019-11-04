import ViewCtrl from "../../../framework/ui/ViewCtrl";
import PoolUtil from "../../../framework/utils/PoolUtil";
import MathUtil from "../../../framework/utils/MathUtil";
import { BONE_TYPE } from "../../../const/Enums";
import F from "../../../framework/loader/F";
import Paths from "../../../configs/Paths";
import Log from "../../../framework/utils/Log";
import Bone_Ctrl from "../../../framework/ani/Bone_Ctrl";
import EffectUtil from "../../../framework/utils/EffectUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet_Ctrl extends ViewCtrl {
    /** 发射点 */
    private _launchPos: cc.Vec2;
    /** 目标对象 */
    private _targetObj: cc.Node;
    private _isMove: boolean = false;
    public poolName: string;

    onLoad() {}

    start() {}

    public updateBulletData(launchPos: cc.Vec2, targetObj: cc.Node): void {
        this._launchPos = launchPos;
        this._targetObj = targetObj;
        this.node.setPosition(this._launchPos);
        this.node.zIndex = 2;
        this._isMove = true;
    }

    update(dt) {
        if (this._isMove && this._targetObj) {
            let targetPos = this._targetObj.getPosition();
            let targetW = 70;
            let targetH = 100;
            targetPos.x -= targetW >> 1;
            targetPos.y += targetH >> 1;

            let rect: cc.Rect = new cc.Rect(targetPos.x, targetPos.y, targetW, targetH);
            if (rect.contains(this.node.getPosition())) {
                PoolUtil.put(BONE_TYPE.BULLET, this.poolName, this.node);
                this._isMove = false;
                this.node.removeFromParent();
                EffectUtil.showDamageEffect(this._targetObj);
                return;
            }

            let move = 1000 * dt;
            this.node.angle = -MathUtil.getAngle(this.node.getPosition(), this._targetObj.getPosition());
            var dirX: number;
            if (Math.abs(targetPos.x - this.node.x) > move) {
                dirX = targetPos.x - this.node.x > 0 ? 1 : -1;
                this.node.x += move * dirX;
            } else {
                this.node.x = targetPos.x;
                dirX = 0;
            }

            var dirY: number;
            if (Math.abs(targetPos.y - this.node.y) > move) {
                dirY = targetPos.y - this.node.y > 0 ? 1 : -1;
                this.node.y += move * dirY;
            } else {
                this.node.y = targetPos.y;
                dirY = 0;
            }
        }
    }
}
