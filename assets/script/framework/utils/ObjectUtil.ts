
export default class ObjectUtil {

    /**
     * 拷贝数据
     * @param target 需要拷贝
     * @param source 被拷贝
     */
    public static assign(target: any, source: any, useTargetKeys?: boolean): any {
        let keyValue: any = "";
        if (target && source) {
            if (useTargetKeys) {
                for (const key in target) {
                    target[key] = source[key];
                    if (keyValue == "") keyValue = key;
                }
            } else {
                for (const key in source) {
                    target[key] = source[key];
                    if (keyValue == "") keyValue = key;
                }
            }
        }
        return keyValue;
    }
}
