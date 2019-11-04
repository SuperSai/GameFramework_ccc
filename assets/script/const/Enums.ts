/** 龙骨类型 */
export enum BONE_TYPE {
    HERO = "hero",
    MONSTER = "monster",
    EFFECT = "effect",
    BULLET = "bullet",
    CLICK_BULLET = "clickBullet"
}

export enum ACTION_NAME {
    ATTACK = "attack",
    MOVE = "move",
    WAIT = "wait"
}

export enum ROLE_STATE {
    STAND,
    ATTACK,
    MOVE,
    DIE,
    POWER
}
