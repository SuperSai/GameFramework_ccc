import ViewCtrl from "../../framework/ui/ViewCtrl";
import { BONE_TYPE, ACTION_NAME } from "../../const/Enums";
import Paths from "../../configs/Paths";
import F from "../../framework/loader/F";
import Log from "../../framework/utils/Log";
import BattleMgr from "../BattleUI/BattleMgr";

const { ccclass, property } = cc._decorator;

/**
 * 场景数据管理类
 */
@ccclass
export default class Scene_Ctrl extends ViewCtrl {
    /** 数据 */
    public data: { sceneIndex: number; sceneExcel: any };

    onLoad() {
        super.onLoad();
    }

    start() {
        if (this.data.sceneIndex == 0) {
            this.view["bg_left"].zIndex = 1;
            this.view["door_left"].zIndex = 1;
            this.view["img_1"].zIndex = 1;
        } else {
            this.view["functionItem"].zIndex = 1;
        }
        this.addEvents();
    }

    private addEvents(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onAttckMonster, this);
    }

    private removeEvents(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onAttckMonster, this);
    }

    private onAttckMonster(evt): void {
        let pos = this.node.convertToNodeSpaceAR(evt.getLocation());
        BattleMgr.Ins.attackMonsterByClick(this.data.sceneExcel.page, this.data.sceneIndex, 0, pos, this.node);
    }

    public openDoor(): void {
        if (this.data.sceneExcel.page == 1 && this.data.sceneIndex == 0) {
            let ani: cc.Animation = this.node.getComponent(cc.Animation);
            ani.play();
        }
    }

    onDestroy() {
        this.removeEvents();
    }
}
