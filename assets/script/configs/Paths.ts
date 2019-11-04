export default class Paths {
    /** 获取龙骨动画文件夹地址 */
    public static getRoleBoneUrl(boneFileName: string): string {
        return `bone/entitys/${boneFileName}`;
    }

    /** 获取龙骨的地址 */
    public static getBoneUrl(boneFileName: string): string {
        return `bone/${boneFileName}`;
    }
}
