export default class MathUtil {
    /** 生成随机浮点数，随机数范围包含min值，但不包含max值 */
    public static range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /** 生成随机整数，随机整数范围包含min值和max值 */
    public static rangeInt(min: number, max: number, isHaveMax: boolean = true): number {
        let value: number = isHaveMax ? 1 : 0;
        return Math.floor(Math.random() * (max - min + value) + min);
    }

    public static splitToNumber(value, sprelator: string = "|"): cc.Vec2 {
        if (value == "0") return cc.v2(0, 0);
        let sArray: string[] = value.split(sprelator);
        return cc.v2(Number(sArray[0]), Number(sArray[1]));
    }

    /** 获取角度 */
    public static getAngle(startPos: cc.Vec2, endPos: cc.Vec2): number {
        let x = endPos.x - startPos.x;
        let y = endPos.y - startPos.y;
        let hypotenuse = Math.sqrt(x * x + y * y);

        //斜边长度
        let cos = x / hypotenuse;
        let radian = Math.acos(cos);
        //求出弧度
        let angle = 180 / (Math.PI / radian);
        //用弧度算出角度
        if (y < 0) {
            angle = 0 - angle;
        } else {
            angle = 180;
        }
        return 90 - angle;
    }
}
