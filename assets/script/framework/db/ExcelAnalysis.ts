import ResLoader from "../loader/ResLoader";

/**
 * 表解析类
 */
export default class ExcelAnalysis {
    /** 所有json的数据 */
    private _allJson: any = null;

    public async setup(callbakc: Function) {
        this._allJson = await ResLoader.loadResByPromise("json/allJson", cc.JsonAsset);
        if (this._allJson) {
            this._allJson = this._allJson.json;
            console.log("表数据:", this._allJson);
            callbakc && callbakc();
        }
    }

    /** 获取表中的单条数据 */
    public getData(sheetName: string, key: number): any {
        if (this._allJson.hasOwnProperty(sheetName)) {
            let data: any = this._allJson[sheetName];
            if (data.hasOwnProperty(key)) {
                return data[key];
            }
        }
        return null;
    }

    /** 获取表中的所有数据 */
    public getAllData(sheetName: string): any {
        if (this._allJson.hasOwnProperty(sheetName)) {
            return this._allJson[sheetName];
        }
        return null;
    }

    /** 获取指定条件的数据列表 */
    public getDataByCondition(sheetName: string, value: (value: any) => boolean): any[] {
        if (this._allJson.hasOwnProperty(sheetName)) {
            let data: any = this._allJson[sheetName];
            let list = [];
            for (const key in data) {
                const info = data[key];
                if (value(info)) list[list.length] = info;
            }
            return list;
        }
        return [];
    }
}

export enum SHEET_NAME {
    SCENES = "scenes",
    MONSTER = "monster",
    STAGE = "stage"
}
