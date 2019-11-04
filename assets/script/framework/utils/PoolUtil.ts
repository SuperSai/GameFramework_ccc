import { setInterval } from "timers";
import Log from "./Log";

/**
 * 对象池
 * @author weiqiang.huang - David
 */
class PoolUtil {
    private _poolList: any = {};

    constructor() {
        //每6分钟检查一次对象池，看看那些已经6分钟没有被引用过了就移除
        setInterval(() => {
            for (const type in this._poolList) {
                for (const poolName in this._poolList[type]) {
                    let list = this._poolList[type][poolName];
                    for (let i = 0; i < list.length; i++) {
                        let item = list.pop();
                        let time = new Date().getMinutes();
                        if (time - item.time >= 6) {
                            item.destroy();
                            item = null;
                        } else {
                            list.push(item);
                        }
                    }
                }
            }
        }, 6e4);
    }

    /**
     * 存入对象池
     * @param type 类型
     * @param poolName 名字
     * @param obj 对象
     */
    public put(type: string, poolName: string, obj: any): void {
        if (type == "" || poolName == "" || obj == null) return;
        if (this._poolList.hasOwnProperty(type)) {
            if (this._poolList[type].hasOwnProperty(poolName)) {
                let list = this._poolList[type][poolName];
                list.push({ obj: obj, time: new Date().getMinutes() });
            }
        } else {
            this._poolList[type] = {}; //{ poolName: [{ obj: obj, time: new Date().getMinutes() }] };
            this._poolList[type][poolName] = [{ obj: obj, time: new Date().getMinutes() }];
        }
    }

    /** 获取对象池对象 */
    public get(type: string, poolName: string): any {
        if (this._poolList.hasOwnProperty(type)) {
            if (this._poolList[type].hasOwnProperty(poolName)) {
                let list = this._poolList[type][poolName];
                if (!list || list.length <= 0) return null;
                return list[0].obj;
            }
        }
        return null;
    }

    /**
     * 清理某种类别的对象池数据
     * @param type
     * @param poolName
     */
    public clearPool(type: string, poolName: string): void {
        if (this._poolList.hasOwnProperty(type)) {
            if (this._poolList[type].hasOwnProperty(poolName)) {
                let list = this._poolList[type][poolName];
                if (!list || list.length <= 0) return;
                for (let i = 0; i < list.length; i++) {
                    list.pop();
                }
                list = null;
                delete this._poolList[type][poolName];
            }
        }
    }

    /** 清理整个对象池数据 */
    public clearAllPool(): void {
        delete this._poolList;
        this._poolList = {};
    }
}

export default new PoolUtil();
