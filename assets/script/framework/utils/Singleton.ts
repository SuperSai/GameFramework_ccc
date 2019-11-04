const { ccclass, property } = cc._decorator;

/**
 * 单例工厂
 */
@ccclass
export default class Singleton {
    private static instances: Map<{ new() }, Object> = new Map<{ new() }, Object>();

    public static Ins<T>(c: { new(): T }): T {
        if (!Singleton.instances.has(c)) {
            let obj = new c();
            Singleton.instances.set(c, obj);
        }
        return <T>Singleton.instances.get(c);
    }
}
