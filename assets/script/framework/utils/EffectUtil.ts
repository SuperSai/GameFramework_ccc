import F from "../loader/F";
import { BONE_TYPE } from "../../const/Enums";
import Paths from "../../configs/Paths";
import Bone_Ctrl from "../ani/Bone_Ctrl";

export default class EffectUtil {
    /** 显示伤害特效 */
    public static showDamageEffect(targetObj: cc.Node): void {
        F.createBone(BONE_TYPE.EFFECT, Paths.getBoneUrl("hit_01"), "hit_01", "hit_01", 1).then((assets: cc.Node) => {
            if (targetObj && targetObj.parent) {
                targetObj.parent.addChild(assets);
                let pos = targetObj.getPosition();
                assets.x = pos.x;
                assets.y = pos.y + 50;
            } else {
                let ctrl: Bone_Ctrl = assets.getComponent("Bone_Ctrl");
                ctrl.resetBone();
            }
        });
    }
}
