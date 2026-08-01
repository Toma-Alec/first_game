// ========================================
// スキルシステム
// ========================================

/**
 * スキルマスターデータ
 */
const SKILL_MASTER_DATA = {
    // 反撃スキル
    counter: {
        id: 'counter',
        name: '反撃',
        description: '攻撃を受けると50%の確率で割り込み再攻撃する',
        type: 'passive',
        trigger: 'onDamage',
        effect: {
            triggerRate: 0.5,
            actionType: 'counterAttack'
        }
    },
    
    // ゾンビスキル
    zombie: {
        id: 'zombie',
        name: 'ゾンビ',
        description: 'HPが0になったら50%の確率で復活し、全ての戦力値が15%減る',
        type: 'passive',
        trigger: 'onDeath',
        effect: {
            resurrectRate: 0.5,
            hpRestorePercent: 0.5,
            statReduction: 0.85 // 戦力値が85%になる（15%減）
        }
    },
    
    // 加速スキル
    acceleration: {
        id: 'acceleration',
        name: '加速',
        description: 'ターン終了時に敏捷+1（最大20まで）',
        type: 'passive',
        trigger: 'onTurnEnd',
        effect: {
            statIncrease: { endurance: 1 },
            maxStat: 20
        }
    },
    
    // 二重攻撃
    doubleAttack: {
        id: 'doubleAttack',
        name: '二重攻撃',
        description: '攻撃時に30%の確率で追加攻撃する',
        type: 'passive',
        trigger: 'onAttack',
        effect: {
            extraAttackRate: 0.3,
            damageMultiplier: 0.8
        }
    },
    
    // 防御結界
    defensiveField: {
        id: 'defensiveField',
        name: '防御結界',
        description: 'ダメージを受けたとき、10%のダメージを反射する',
        type: 'passive',
        trigger: 'onDamage',
        effect: {
            reflectDamageRate: 0.1
        }
    },
    
    // 魔法亜種
    magicAmplify: {
        id: 'magicAmplify',
        name: '魔力強化',
        description: '魔法攻撃の威力が20%上昇する',
        type: 'passive',
        trigger: 'onMagicAttack',
        effect: {
            magicAttackBoost: 1.2
        }
    },
    
    // ブレス威力上昇
    breathAmplify: {
        id: 'breathAmplify',
        name: 'ブレス強化',
        description: 'ブレス攻撃の威力が25%上昇する',
        type: 'passive',
        trigger: 'onBreathAttack',
        effect: {
            breathPowerBoost: 1.25
        }
    }
};

/**
 * スキルシステムクラス
 */
class Skill {
    constructor(skillId) {
        const skillData = SKILL_MASTER_DATA[skillId];
        if (!skillData) {
            console.error(`スキル ${skillId} が見つかりません`);
            return null;
        }
        
        this.id = skillData.id;
        this.name = skillData.name;
        this.description = skillData.description;
        this.type = skillData.type;
        this.trigger = skillData.trigger;
        this.effect = skillData.effect;
    }
    
    /**
     * スキルを適用（戦力値計算）
     */
    applySkillEffect(baseStats, battleStats) {
        switch (this.id) {
            case 'counter':
            case 'zombie':
            case 'acceleration':
            case 'doubleAttack':
            case 'defensiveField':
            case 'magicAmplify':
            case 'breathAmplify':
                // これらのスキルは動的に適用される
                return { baseStats, battleStats };
            default:
                return { baseStats, battleStats };
        }
    }
    
    /**
     * スキルの説明を取得
     */
    getDescription() {
        return `【${this.name}】${this.description}`;
    }
}

/**
 * スキルマネージャー
 */
class SkillManager {
    constructor() {
        this.skills = [];
    }
    
    /**
     * スキルを追加
     */
    addSkill(skillId) {
        const skill = new Skill(skillId);
        if (skill && skill.id) {
            this.skills.push(skill);
            return skill;
        }
        return null;
    }
    
    /**
     * スキルを削除
     */
    removeSkill(skillId) {
        this.skills = this.skills.filter(s => s.id !== skillId);
    }
    
    /**
     * スキルを取得
     */
    getSkill(skillId) {
        return this.skills.find(s => s.id === skillId);
    }
    
    /**
     * 特定のトリガーに対応するスキルを取得
     */
    getSkillsByTrigger(trigger) {
        return this.skills.filter(s => s.trigger === trigger);
    }
    
    /**
     * すべてのスキルを取得
     */
    getAllSkills() {
        return this.skills;
    }
}
