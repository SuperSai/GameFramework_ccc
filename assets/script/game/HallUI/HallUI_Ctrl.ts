import ViewCtrl from "../../framework/ui/ViewCtrl";
import UIMgr from "../../framework/ui/UIMgr";
import Log from "../../framework/utils/Log";
import F from "../../framework/loader/F";
import { BONE_TYPE, ACTION_NAME } from "../../const/Enums";
import DataCenter from "../model/DataCenter";
import BattleMgr from "../BattleUI/BattleMgr";
import Paths from "../../configs/Paths";

const { ccclass, property } = cc._decorator;

/**
 * 大厅
 * @author weiqiang.huang - David
 */
@ccclass
export default class HallUI_Ctrl extends ViewCtrl {
    onLoad() {
        super.onLoad();
        this.view["container_pageSceneUI"].addComponent("PageSceneUI_Ctrl");
    }

    start() {
        this.addEvents();
    }

    private addEvents(): void {
        UIMgr.Ins.addBtnListen(this.view["btnMonster"], this, this.onBrushMonster);
    }

    private removeEvents(): void {
        UIMgr.Ins.removeBtnListener(this.view["btnMonster"], this, this.onBrushMonster);
    }

    private onBrushMonster(): void {
        BattleMgr.Ins.startRaid(1, 0);
       
    }

    onDestroy() {
        this.removeEvents();
    }
}
