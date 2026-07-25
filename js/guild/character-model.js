// ========================================
// キャラクターモデル
// ========================================

/**
 * キャラクタークラス
 * キャラクターの定義と計算ロジックを管理
 */
class Character {
    constructor(data = {}) {
        // ========== 属性 ==========
        this.id = data.id || this.generateId();
        this.name = data.name || '名前未設定';
        this.gender = data.gender || 'male';
        this.race = data.race || 'human';
        this.personality = data.personality || 'balanced';
        this.job = data.job || 'warrior';
        
        // ========== 基礎値（1-20） ==========
        this.baseStats = {
            vitality: data.baseStats?.vitality || 10,
            strength: data.baseStats?.strength || 10,
            endurance: data.baseStats?.endurance || 10,
            spirit: data.baseStats?.spirit || 10,
            wisdom: data.baseStats?.wisdom || 10,
            luck: data.baseStats?.luck || 10
        };
        
        // ========== 戦力値（計算値） ==========
        this.battleStats = this.calculateBattleStats();
        
        // ========== その他 ==========
        this.equipment = data.equipment || [];
        this.tactics = {
            physicalRate: data.tactics?.physicalRate || 0.4,
            magicRate: data.tactics?.magicRate || 0.3,
            breathRate: data.tactics?.breathRate || 0.3,
            attackRate: data.tactics?.attackRate || 0.6,
            defenseRate: data.tactics?.defenseRate || 0.3,
            supportRate: data.tactics?.supportRate || 0.1
        };
        this.position = data.position || 'front';
        
        // ========== メタ情報 ==========
        this.level = data.level || 1;
        this.experience = data.experience || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
    
    /**
     * ユニークIDを生成
     */
    generateId() {
        return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 基礎値から戦力値を計算
     * 種族・個性・職業・装備による補正を適用
     */
    calculateBattleStats() {
        // ステップ1：基礎値に種族補正を適用
        const raceModifier = RACE_STAT_MODIFIERS[this.race] || RACE_STAT_MODIFIERS.human;
        const raceAdjustedStats = {};
        
        for (const [key, value] of Object.entries(this.baseStats)) {
            raceAdjustedStats[key] = Math.round(value * (raceModifier[key] || 1.0));
        }
        
        // ステップ2：個性による補正を適用
        const personalityModifier = PERSONALITY_STAT_MODIFIERS[this.personality] || {};
        const personalityAdjustedStats = { ...raceAdjustedStats };
        
        for (const [key, modifier] of Object.entries(personalityModifier)) {
            if (personalityAdjustedStats[key]) {
                personalityAdjustedStats[key] = Math.round(personalityAdjustedStats[key] * modifier);
            }
        }
        
        // ステップ3：職業の基本ボーナスを追加
        const job = GUILD_CONSTANTS.JOBS.find(j => j.id === this.job);
        const jobBonus = job?.baseStats || {};
        
        const finalStats = { ...personalityAdjustedStats };
        for (const [key, value] of Object.entries(jobBonus)) {
            finalStats[key] = (finalStats[key] || 0) + Math.round(value * 0.5); // 職業ボーナスは50%適用
        }
        
        // ステップ4：装備による補正（簡易版：装備数に応じた補正）
        const equipmentBonus = this.equipment.length * 2; // 装備1つごとに2%ボーナス
        const equipmentModifier = 1 + (equipmentBonus / 100);
        
        // ステップ5：戦力値を計算
        const battleStats = {
            hp: Math.round((finalStats.vitality * 5 + 50) * equipmentModifier),
            attack: Math.round((finalStats.strength * 3 + 20) * equipmentModifier),
            hitRate: Math.round(Math.min(99, (finalStats.endurance * 3 + 30))),
            criticalRate: Math.round(Math.min(40, (finalStats.luck * 2 + 10))),
            pierceRate: Math.round(Math.min(50, (finalStats.strength * 1.5 + 5))),
            defense: Math.round((finalStats.vitality * 2 + 15) * equipmentModifier),
            avoidRate: Math.round(Math.min(99, (finalStats.endurance * 2 + 20))),
            magicAttack: Math.round((finalStats.spirit * 3 + 20) * equipmentModifier),
            magicDefense: Math.round((finalStats.wisdom * 2 + 15) * equipmentModifier),
            magicAvoid: Math.round(Math.min(99, (finalStats.wisdom + 10))),
            magicRecovery: Math.round(finalStats.spirit * 2 + 10),
            breathPower: Math.round((finalStats.spirit * 2.5 + 15) * equipmentModifier),
            breathDefense: Math.round((finalStats.wisdom * 1.5 + 10) * equipmentModifier),
            breathAvoid: Math.round(Math.min(99, (finalStats.wisdom + finalStats.endurance) / 2 + 5))
        };
        
        return battleStats;
    }
    
    /**
     * キャラクターデータを更新
     */
    update(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.gender !== undefined) this.gender = data.gender;
        if (data.race !== undefined) this.race = data.race;
        if (data.personality !== undefined) this.personality = data.personality;
        if (data.job !== undefined) this.job = data.job;
        
        if (data.baseStats) {
            this.baseStats = { ...this.baseStats, ...data.baseStats };
        }
        
        if (data.equipment !== undefined) this.equipment = data.equipment;
        
        if (data.tactics) {
            this.tactics = { ...this.tactics, ...data.tactics };
        }
        
        if (data.position !== undefined) this.position = data.position;
        
        // 戦力値を再計算
        this.battleStats = this.calculateBattleStats();
        this.updatedAt = new Date().toISOString();
    }
    
    /**
     * キャラクターをJSONに変換
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            gender: this.gender,
            race: this.race,
            personality: this.personality,
            job: this.job,
            baseStats: this.baseStats,
            battleStats: this.battleStats,
            equipment: this.equipment,
            tactics: this.tactics,
            position: this.position,
            level: this.level,
            experience: this.experience,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
    /**
     * JSONからキャラクターを生成
     */
    static fromJSON(data) {
        return new Character(data);
    }
    
    /**
     * キャラクターの概要を表示（デバッグ用）
     */
    getSummary() {
        return {
            name: this.name,
            race: this.race,
            job: this.job,
            position: this.position,
            hp: this.battleStats.hp,
            attack: this.battleStats.attack,
            defense: this.battleStats.defense
        };
    }
}
