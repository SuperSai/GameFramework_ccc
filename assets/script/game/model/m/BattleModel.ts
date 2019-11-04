export default class BattleModel {
    /** 各类章节的突袭进度 */
    public raidSchedule: Map<number, number>;
    /** 突袭的怪物们 */
    public raidMonsters: cc.Node[] = [];

    constructor() {
        this.initRaidSchedule();
    }

    /** 初始化突袭进度 */
    private initRaidSchedule(): void {
        this.raidSchedule = new Map<number, number>();
        for (let i = 1; i <= 5; i++) {
            this.raidSchedule.set(i, 1);
        }
    }
}
