import ExcelAnalysis from "../../framework/db/ExcelAnalysis";
import Singleton from "../../framework/utils/Singleton";
import BattleModel from "./m/BattleModel";
import HallModel from "./m/HallModel";

/**
 * 游戏数据中心
 */
class DataCenter {
    /** 游戏表数据 */
    public excelJson: ExcelAnalysis;
    /** 战斗数据 */
    public battleM: BattleModel;
    /** 大厅数据 */
    public hallM: HallModel;

    /** 初始化 */
    initModule(): void {
        this.excelJson = this.setSingleton(ExcelAnalysis);
        this.battleM = this.setSingleton(BattleModel);
        this.hallM = this.setSingleton(HallModel);
    }

    private setSingleton<T>(c: { new (): T }): T {
        let obj = Singleton.Ins(c);
        return obj;
    }
}

export default new DataCenter();
