import PoolUtil from "../utils/PoolUtil";
import Log from "../utils/Log";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bone_Ctrl extends cc.Component {
    private _type: string;
    private _poolName: string;
    private _playTimes: number;
    private _armatureDisplay: dragonBones.ArmatureDisplay;
    private _armature: any;
    private _isOnLoad: boolean = false;

    onLoad() {
        this._armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this._armature = this._armatureDisplay.armature();
        this.addEvents();
        this._isOnLoad = true;
    }

    start() {
        this.playByFadeIn();
    }

    private addEvents(): void {
        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onBoneComplete, this);
    }

    private removeEvents(): void {
        this._armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onBoneComplete, this);
    }

    public updateBoneData(type: string, poolName: string, playTimes: number): void {
        this._type = type;
        this._poolName = poolName;
        this._playTimes = playTimes;
    }

    public setBonePos(pos: cc.Vec2): void {
        this.node.setPosition(pos);
    }

    private playByFadeIn(): void {
        this._armature.animation.fadeIn(this._poolName, 0.2, 0);
        this._armature.animation.play(this._poolName, this._playTimes);
    }

    /** 龙骨动画播放完毕 */
    private onBoneComplete(): void {
        this.resetBone();
    }

    public resetBone(): void {
        this.removeEvents();
        PoolUtil.put(this._type, this._poolName, this.node);
        this.node.removeFromParent();
        this._isOnLoad = false;
    }

    onDestroy() {
        this.resetBone();
    }

    onEnable() {
        if (!this._isOnLoad) {
            this.onLoad();
            this.start();
        }
    }
}
