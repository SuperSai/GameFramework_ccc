import ViewCtrl from "../../framework/ui/ViewCtrl";
import UIMgr from "../../framework/ui/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginUI_Ctrl extends ViewCtrl {
    onLoad() {
        super.onLoad();
    }

    start() {
        UIMgr.Ins.addBtnListen(this.view["btn_login"], this, this.onEnterHall);
    }

    private onEnterHall(): void {
        UIMgr.Ins.removeUIToShowUI("LoginUI", "HallUI");
    }
}
