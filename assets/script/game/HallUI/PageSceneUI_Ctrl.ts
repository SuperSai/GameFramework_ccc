import ViewCtrl from "../../framework/ui/ViewCtrl";
import ResLoader from "../../framework/loader/ResLoader";
import { SHEET_NAME } from "../../framework/db/ExcelAnalysis";
import Log from "../../framework/utils/Log";
import DataCenter from "../model/DataCenter";

const { ccclass, property } = cc._decorator;
/**
 * 每章的场景类
 * @author weiqiang.huang - David
 */
@ccclass
export default class PageSceneUI_Ctrl extends ViewCtrl {
    /** 章节 */
    private _page: number = -1;
    /** 场景列表数据 */
    private _sceneList: any[];
    private _sceneLen: number = 6;

    onLoad() {
        super.onLoad();
        this._sceneList = DataCenter.excelJson.getDataByCondition(SHEET_NAME.SCENES, item => {
            return item.page == 1;
        });
    }

    start() {
        this.createScenes();
    }

    /** 创建各类场景 */
    private async createScenes() {
        if (this._sceneList && this._sceneList.length > 0) {
            this._sceneLen = this._sceneList.length;
            this._page = this._sceneList[0].page;
            let pageSceneData = null;
            if (DataCenter.hallM.pageMap.has(this._page)) {
                pageSceneData = DataCenter.hallM.pageMap.get(this._page);
            }
            for (let i = 0; i < this._sceneLen; i++) {
                const sceneData: any = this._sceneList[i];
                let scene: cc.Node = (await ResLoader.loadResByPromise("prefabs/viewPrefabs/scene/" + sceneData.sceneName, cc.Prefab)) as cc.Node;
                if (scene) {
                    if (pageSceneData && pageSceneData.hasOwnProperty(i)) {
                        pageSceneData[i].unlock = true;
                        pageSceneData[i].sceneNode = scene;
                    }
                    scene.addComponent("Scene_Ctrl");
                    let script = scene.getComponent("Scene_Ctrl");
                    script.data = { sceneIndex: i, sceneExcel: sceneData };
                    this.view["sceneList_view_scneneContent"].addChild(scene);
                }
            }
            this.jumpScene(this._sceneLen);
        } else {
            Log.traceError("无法获取到场景表中的数据...");
        }
    }

    /** 根据下标跳转到指定位置的场景 */
    public jumpScene(index: number): void {
        if (this.view["sceneList"]) {
            //(总场景数 - 跳转场景下标) / 系数
            //滚动的从顶部 1 到 底部 0 的之间来控制 ， 0.1就是多久滚动到指定的百分比位置上
            const value: number = (this._sceneLen - index) / (this._sceneLen - 1);
            this.view["sceneList"].getComponent(cc.ScrollView).scrollToPercentVertical(value, 0.1);
        }
    }
}
