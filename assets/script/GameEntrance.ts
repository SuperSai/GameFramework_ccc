import UIMgr from "./framework/ui/UIMgr";
import DataCenter from "./game/model/DataCenter";

const { ccclass, property } = cc._decorator;

/**
 * 游戏入口
 * @author weiqiang.huang - David
 */
@ccclass
export default class GameEntrance extends cc.Component {
    onLoad() {
        this.initData();
    }

    private initData() {
        DataCenter.initModule();
        DataCenter.excelJson.setup(() => {
            this.enterLoginScene();
        });
    }

    enterLoginScene(): void {
        UIMgr.Ins.showUI("LoginUI");
    }
}
