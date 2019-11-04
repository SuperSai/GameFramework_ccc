import ResLoader from "../loader/ResLoader";
import ViewZorder from "../../const/ViewZorder";

const { ccclass, property } = cc._decorator;

/**
 * UI管理器
 * @author weiqiang.huang - David
 */
@ccclass
export default class UIMgr extends cc.Component {
    private _uiList: Map<string, cc.Node> = new Map<string, cc.Node>();

    /** 打开UI界面 */
    public async showUI(uiName: string, zOrder: number = ViewZorder.UI) {
        //判断界面是否已经创建出来了
        if (this._uiList.has(uiName)) {
            let node = this._uiList.get(uiName);
            node.active = true;
            return;
        }
        let fileName: string = uiName;
        fileName = fileName.toLocaleLowerCase().substring(0, fileName.length - 2);
        let ui: cc.Node = (await ResLoader.loadResByPromise("prefabs/viewPrefabs/" + fileName + "/" + uiName, cc.Prefab)) as cc.Node;
        if (ui) {
            let uiRoot = cc.director.getScene();
            if (!uiRoot) {
                console.error(`当前场景${cc.director.getScene().name}Canvas!!!`);
                return;
            }
            ui.parent = uiRoot;
            ui.zIndex = zOrder;
            ui.addComponent(uiName + "_Ctrl");
            this._uiList.set(uiName, ui);
        }
    }

    /** 关闭UI界面并且再打开一个UI界面 */
    public removeUIToShowUI(removeUIName: string, openUIName: string, zOrder: number = ViewZorder.UI): void {
        if (removeUIName != "") this.removeUI(removeUIName);
        if (openUIName != "") this.showUI(openUIName, zOrder);
    }

    /** 隐藏UI界面 */
    public hideUI(uiName: string): void {
        if (this._uiList.has(uiName)) {
            let ui = this._uiList.get(uiName);
            ui.active = false;
        }
    }

    /** 移除UI界面 */
    public removeUI(uiName: string): void {
        if (this._uiList.has(uiName)) {
            let ui = this._uiList.get(uiName);
            if (cc.isValid(ui)) {
                ui.destroy();
            }
            this._uiList.delete(uiName);
        }
    }

    /** UI界面是否显示中 */
    public isShowing(uiName): boolean {
        if (this._uiList.has(uiName)) {
            let ui = this._uiList.get(uiName);
            return ui.active;
        }
        return false;
    }

    /****************************** 添加各类组件 start *****************************/

    /**
     * 添加按钮事件
     * @param node 添加按钮事件的对象
     * @param caller 作用对象
     * @param func 返回函数
     */
    public addBtnListen(node: cc.Node, caller: any, func: Function): void {
        let btn = node.getComponent(cc.Button);
        if (!btn) return;
        node.on("click", func, caller);
    }
    /**
     * 移除按钮事件
     * @param node 添加按钮事件的对象
     * @param caller 作用对象
     * @param func 返回函数
     */
    public removeBtnListener(node: cc.Node, caller: any, func: Function): void {
        let btn = node.getComponent(cc.Button);
        if (!btn) return;
        node.off("click", func, caller);
    }

    /****************************** 添加各类组件 end *****************************/

    private static _ins: UIMgr = null;
    public static get Ins(): UIMgr {
        if (UIMgr._ins == null) {
            UIMgr._ins = new UIMgr();
        }
        return UIMgr._ins;
    }
}
