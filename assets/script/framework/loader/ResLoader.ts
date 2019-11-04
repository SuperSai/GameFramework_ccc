import Log from "../utils/Log";
import PoolUtil from "../utils/PoolUtil";
import { BONE_TYPE } from "../../const/Enums";

const { ccclass, property } = cc._decorator;
/**
 * 加载资源
 * @author weiqiang.huang - David
 */
@ccclass
export default class ResLoader extends cc.Component {
    /**
     * 加载resources目录下的单个动态资源
     * @param url 路径
     * @param type 加载类型
     */
    public static loadResByPromise(url: string, type: typeof cc.Asset) {
        return new Promise((resolve, rejects) => {
            cc.loader.loadRes(url, type, (error: Error, resourece: any) => {
                if (error) return rejects(null);
                if (resourece instanceof cc.Prefab) {
                    resolve(cc.instantiate(resourece));
                } else {
                    resolve(resourece);
                }
            });
        });
    }

    /**
     * 加载resources目录下的单个动态资源
     * @param url 路径
     * @param type 加载类型
     * @param completeCallback 加载完成回调
     */
    public static loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): any {
        cc.loader.loadRes(url, type, (error: Error, resourece: any) => {
            if (resourece instanceof cc.Prefab) {
                completeCallback && completeCallback(error, cc.instantiate(resourece));
            } else {
                completeCallback && completeCallback(error, resourece);
            }
        });
    }

    /**
     * 加载龙骨动画
     * @param isNew 是否创建一个新的龙骨动画
     * @param path 存放龙骨资源的文件夹路径
     * @param armatureName 龙骨名字
     * @param aniName 播放动作名字
     * @param playTimes 播放次数 -1是根据龙骨文件   0无限循环   大于0就是播放次数
     * @param boneDisplay   isNew如果是ture的话，就会直接更新龙骨，不会新建新的
     */
    public static loadDragonRes(path: string, armatureName: string, aniName: string, playTimes: number, isNew: boolean = false, boneDisplay: dragonBones.ArmatureDisplay = null) {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, (err, assets) => {
                if (err) {
                    Log.traceError("龙骨加载失败 - path:", path);
                    return;
                }
                if (assets.length <= 0) return;
                let armatureDisplay = boneDisplay;
                if (isNew || boneDisplay == null) {
                    let bone = new cc.Node();
                    bone.setPosition(cc.v2(0, 0));
                    armatureDisplay = bone.addComponent(dragonBones.ArmatureDisplay);
                }
                assets.forEach(asset => {
                    if (asset instanceof dragonBones.DragonBonesAsset) {
                        armatureDisplay.dragonAsset = asset;
                    }
                    if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
                        armatureDisplay.dragonAtlasAsset = asset;
                    }
                });
                armatureDisplay.armatureName = armatureName;
                armatureDisplay.playAnimation(aniName, playTimes);
                resolve(armatureDisplay);
            });
        });
    }
}
