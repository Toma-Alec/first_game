// ========================================
// 装備アイテムシステム
// ========================================

/**
 * 装備アイテムマスターデータ
 */
const EQUIPMENT_MASTER_DATA = {
    // ====== 武器 ======
    iron_sword: {
        id: 'iron_sword',
        name: '鉄の剣',
        description: '基本的な剣',
        type: 'weapon',
        baseStatMods: { strength: 2 },
        battleStatMods: { attack: 10 },
        skills: []
    },
    
    steel_sword: {
        id: 'steel_sword',
        name: '鋼の剣',
        description: '質の高い剣',
        type: 'weapon',
        baseStatMods: { strength: 4 },
        battleStatMods: { attack: 20, pierceRate: 5 },
        skills: []
    },
    
    dragon_slayer: {
        id: 'dragon_slayer',
        name: 'ドラゴンスレイヤー',
        description: 'ドラゴン狩りの武器',
        type: 'weapon',
        baseStatMods: { strength: 6 },
        battleStatMods: { attack: 35, criticalRate: 10 },
        skills: ['doubleAttack']
    },
    
    magic_staff: {
        id: 'magic_staff',
        name: '魔法の杖',
        description: '魔法を強化する杖',
        type: 'weapon',
        baseStatMods: { spirit: 4 },
        battleStatMods: { magicAttack: 25 },
        skills: ['magicAmplify']
    },
    
    // ====== 防具 ======
    iron_armor: {
        id: 'iron_armor',
        name: '鉄の鎧',
        description: '基本的な防具',
        type: 'armor',
        baseStatMods: { vitality: 2 },
        battleStatMods: { defense: 15 },
        skills: []
    },
    
    mithril_armor: {
        id: 'mithril_armor',
        name: 'ミスリル鎧',
        description: '高級な防具',
        type: 'armor',
        baseStatMods: { vitality: 4 },
        battleStatMods: { defense: 30, avoidRate: 5 },
        skills: ['defensiveField']
    },
    
    dragon_scale: {
        id: 'dragon_scale',
        name: 'ドラゴンスケイル',
        description: 'ドラゴンの鱗でできた防具',
        type: 'armor',
        baseStatMods: { vitality: 6 },
        battleStatMods: { defense: 45, breathDefense: 20 },
        skills: []
    },
    
    // ====== アクセサリー ======
    ring_of_strength: {
        id: 'ring_of_strength',
        name: '力の指輪',
        description: '力を高める指輪',
        type: 'accessory',
        baseStatMods: { strength: 3 },
        battleStatMods: { attack: 15 },
        skills: []
    },
    
    ring_of_wisdom: {
        id: 'ring_of_wisdom',
        name: '知恵の指輪',
        description: '知恵を高める指輪',
        type: 'accessory',
        baseStatMods: { wisdom: 3 },
        battleStatMods: { magicDefense: 15 },
        skills: []
    },
    
    ring_of_haste: {
        id: 'ring_of_haste',
        name: '加速の指輪',
        description: '敏捷性を高める指輪',
        type: 'accessory',
        baseStatMods: { endurance: 3 },
        battleStatMods: { avoidRate: 10 },
        skills: ['acceleration']
    },
    
    // ====== 特殊装備 ======
    zombie_amulet: {
        id: 'zombie_amulet',
        name: 'ゾンビのお守り',
        description: '不死の力を与えるお守り',
        type: 'accessory',
        baseStatMods: {},
        battleStatMods: {},
        skills: ['zombie']
    },
    
    counter_bracelet: {
        id: 'counter_bracelet',
        name: '反撃のブレスレット',
        description: '反撃の力を与えるブレスレット',
        type: 'accessory',
        baseStatMods: { wisdom: 2 },
        battleStatMods: {},
        skills: ['counter']
    },
    
    breath_crown: {
        id: 'breath_crown',
        name: 'ブレス王冠',
        description: 'ブレス攻撃を強化する王冠',
        type: 'headgear',
        baseStatMods: { spirit: 3 },
        battleStatMods: { breathPower: 20 },
        skills: ['breathAmplify']
    }
};

/**
 * 装備アイテムクラス
 */
class Equipment {
    constructor(equipmentId) {
        const equipData = EQUIPMENT_MASTER_DATA[equipmentId];
        if (!equipData) {
            console.error(`装備 ${equipmentId} が見つかりません`);
            return null;
        }
        
        this.id = equipData.id;
        this.name = equipData.name;
        this.description = equipData.description;
        this.type = equipData.type;
        this.baseStatMods = equipData.baseStatMods;
        this.battleStatMods = equipData.battleStatMods;
        this.skills = equipData.skills;
    }
    
    /**
     * 装備の説明を取得
     */
    getFullDescription() {
        let desc = `【${this.name}】${this.description}\n`;
        
        if (Object.keys(this.baseStatMods).length > 0) {
            desc += `基礎値: `;
            for (const [stat, value] of Object.entries(this.baseStatMods)) {
                desc += `${stat} ${value > 0 ? '+' : ''}${value} `;
            }
            desc += '\n';
        }
        
        if (Object.keys(this.battleStatMods).length > 0) {
            desc += `戦力値: `;
            for (const [stat, value] of Object.entries(this.battleStatMods)) {
                desc += `${stat} ${value > 0 ? '+' : ''}${value} `;
            }
            desc += '\n';
        }
        
        if (this.skills.length > 0) {
            desc += `スキル: ${this.skills.join(', ')}`;
        }
        
        return desc;
    }
}

/**
 * 装備管理システム
 */
class EquipmentManager {
    constructor(maxEquipment = 6) {
        this.maxEquipment = maxEquipment;
        this.equipment = [];
    }
    
    /**
     * 装備を追加
     */
    addEquipment(equipmentId) {
        if (this.equipment.length >= this.maxEquipment) {
            console.warn(`装備数が上限に達しています (${this.maxEquipment})`);
            return false;
        }
        
        const equip = new Equipment(equipmentId);
        if (equip && equip.id) {
            this.equipment.push(equip);
            return true;
        }
        return false;
    }
    
    /**
     * 装備を削除（インデックスで指定）
     */
    removeEquipment(index) {
        if (index >= 0 && index < this.equipment.length) {
            this.equipment.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * 装備を取得（インデックスで指定）
     */
    getEquipment(index) {
        return this.equipment[index] || null;
    }
    
    /**
     * すべての装備を取得
     */
    getAllEquipment() {
        return this.equipment;
    }
    
    /**
     * 装備の総基礎値補正を計算
     */
    getTotalBaseStatMods() {
        const totalMods = {
            vitality: 0,
            strength: 0,
            endurance: 0,
            spirit: 0,
            wisdom: 0,
            luck: 0
        };
        
        for (const equip of this.equipment) {
            for (const [stat, value] of Object.entries(equip.baseStatMods)) {
                if (totalMods[stat] !== undefined) {
                    totalMods[stat] += value;
                }
            }
        }
        
        return totalMods;
    }
    
    /**
     * 装備の総戦力値補正を計算
     */
    getTotalBattleStatMods() {
        const totalMods = {
            hp: 0,
            attack: 0,
            hitRate: 0,
            criticalRate: 0,
            pierceRate: 0,
            defense: 0,
            avoidRate: 0,
            magicAttack: 0,
            magicDefense: 0,
            magicAvoid: 0,
            magicRecovery: 0,
            breathPower: 0,
            breathDefense: 0,
            breathAvoid: 0
        };
        
        for (const equip of this.equipment) {
            for (const [stat, value] of Object.entries(equip.battleStatMods)) {
                if (totalMods[stat] !== undefined) {
                    totalMods[stat] += value;
                }
            }
        }
        
        return totalMods;
    }
    
    /**
     * 装備から得られるすべてのスキルを取得
     */
    getAllEquipmentSkills() {
        const skills = [];
        for (const equip of this.equipment) {
            skills.push(...equip.skills);
        }
        return [...new Set(skills)]; // 重複を削除
    }
    
    /**
     * 装備数
     */
    getEquipmentCount() {
        return this.equipment.length;
    }
    
    /**
     * 装備数の空き
     */
    getAvailableSlots() {
        return this.maxEquipment - this.equipment.length;
    }
}
