export default class HallModel {
    /** 各类章节数据 */
    public pageMap: Map<number, any>;
    /** 场景是从0开始算的，所有有6个场景 */
    public maxSceneCount: number = 5;

    /**
     *
     */
    constructor() {
        this.initPageData();
    }

    private initPageData(): void {
        this.pageMap = new Map<number, any>();
        for (let i = 1; i <= 5; i++) {
            let data = {};
            for (let k = 0; k < 6; k++) {
                data[k] = { unlock: false, sceneNode: null };
            }
            this.pageMap.set(i, data);
        }
    }

    /** 获取对应章节中的某一个场景实例对象 */
    public getSceneByPage(page: number, index: number): { unlock: boolean; sceneNode: cc.Node } {
        if (this.pageMap.has(page)) {
            let pageData = this.pageMap.get(page);
            if (pageData && pageData.hasOwnProperty(index)) {
                return pageData[index];
            }
        }
        return null;
    }
}
