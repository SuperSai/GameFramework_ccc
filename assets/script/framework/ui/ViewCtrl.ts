const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewCtrl extends cc.Component {
    protected view: any;

    onLoad() {
        this.view = {};
        this.loadAllNode(this.node, "");
    }

    /** 存储view下的每一个node节点 */
    private loadAllNode(root: cc.Node, path: string): void {
        for (let i = 0; i < root.childrenCount; i++) {
            this.view[path + root.children[i].name] = root.children[i];
            this.loadAllNode(root.children[i], path + root.children[i].name + "_");
        }
    }
}
