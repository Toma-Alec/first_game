// ========================================
// キャラクターモデル（新しい計算ロジック）
// ========================================

/**
 * キャラクタークラス
 * 新しい戦力計算ロジック：
 * 1. 基礎値計算（種族→レベル→個性→職業→装備）
 * 2. 戦力値計算（基礎値から各戦力値を算出）
 * 3. 装備の戦力補正を加算
 * 4. スキル効果を適用
 */
class Character {
    constructor(data = {}) {
        // ========== 基本情報 ==========
        this.id = data.id || this.generateId();
        this.name = data.name || '名前未設定';
        this.gender = data.gender || 'male';
        this.race = data.race || 'human';
        this.personality = data.personality || 'balanced';
        this.job = data.job || 'warrior';
        this.level = data.level || 1;
        
        // ========== 基礎値（1-20） ==========
        this.baseStats = {
            vitality: data.baseStats?.vitality || 10,
            strength: data.baseStats?.strength || 10,
            endurance: data.baseStats?.endurance || 10,
            spirit: data.baseStats?.spirit || 10,
            wisdom: data.baseStats?.wisdom || 10,
            luck: data.baseStats?.luck || 10
        };
        
        // ========== 装備・戦術・位置情報 ==========
        this.equipmentManager = new EquipmentManager(data.maxEquipment || 6);
        if (data.equipment) {
            for (const equipId of data.equipment) {
                this.equipmentManager.addEquipment(equipId);
            }
        }
        
        this.tacticId = data.tacticId || 'balanced';
        this.position = data.position || 'front';
        
        // ========== スキルシステム ==========
        this.skillManager = new SkillManager();
        if (data.skills) {
            for (const skillId of data.skills) {
                this.skillManager.addSkill(skillId);
            }
        }
        
        // ========== 計算済み値 ==========
        this.calculatedBaseStats = this.calculateFinalBaseStats();
        this.battleStats = this.calculateBattleStats();
        
        // ========== メタ情報 ==========
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
     * ========== ステップ1: 基礎値計算 ==========
     * 種族 → レベル → 個性 → 職業 → 装備
     */
    calculateFinalBaseStats() {
        let stats = { ...this.baseStats };
        
        // ステップ1: 種族の加減算
        const raceModifiers = RACE_BASE_STAT_MODIFIERS[this.race] || RACE_BASE_STAT_MODIFIERS.human;
        for (const [key, value] of Object.entries(raceModifiers)) {
            stats[key] = Math.max(1, Math.min(20, stats[key] + value));
        }
        
        // ステップ2: レベルによる成長（種族ごとの成長曲線）
        const growthCurve = RACE_GROWTH_CURVES[this.race];
        if (growthCurve) {
            const levelBonus = this.level - 1; // レベル1は成長なし
            for (const [key, growthRate] of Object.entries(growthCurve.growthPerLevel)) {
                const growth = Math.floor(growthRate * levelBonus);
                stats[key] = Math.max(1, Math.min(20, stats[key] + growth));
            }
        }
        
        // ステップ3: 個性の加減算
        const personalityModifiers = PERSONALITY_BASE_STAT_MODIFIERS[this.personality] || {};
        for (const [key, value] of Object.entries(personalityModifiers)) {
            stats[key] = Math.max(1, Math.min(20, stats[key] + value));
        }
        
        // ステップ4: 職業の加減算
        const jobModifiers = JOB_BASE_STAT_MODIFIERS[this.job] || {};
        for (const [key, value] of Object.entries(jobModifiers)) {
            stats[key] = Math.max(1, Math.min(20, stats[key] + value));
        }
        
        // ステップ5: 装備の基礎値補正を加算
        const equipmentMods = this.equipmentManager.getTotalBaseStatMods();
        for (const [key, value] of Object.entries(equipmentMods)) {
            stats[key] = Math.max(1, Math.min(20, stats[key] + value));
        }
        
        return stats;
    }
    
    /**
     * ========== ステップ2: 戦力値計算 ==========
     * 計算済み基礎値から各戦力値を算出
     */
    calculateBattleStats() {
        const stats = this.calculatedBaseStats;
        
        // 基礎値から戦力値を計算
        const battleStats = {
            hp: Math.round(stats.vitality * 8 + 30),
            attack: Math.round(stats.strength * 4 + 15),
            hitRate: Math.round(Math.min(99, stats.endurance * 3 + 25)),
            criticalRate: Math.round(Math.min(40, stats.luck * 2.5 + 5)),
            pierceRate: Math.round(Math.min(50, stats.strength * 2 + 5)),
            defense: Math.round(stats.vitality * 3 + 10),
            avoidRate: Math.round(Math.min(99, stats.endurance * 2.5 + 15)),
            magicAttack: Math.round(stats.spirit * 4 + 15),
            magicDefense: Math.round(stats.wisdom * 3 + 10),
            magicAvoid: Math.round(Math.min(99, stats.wisdom * 2 + 20)),
            magicRecovery: Math.round(stats.spirit * 3 + 8),
            breathPower: Math.round(stats.spirit * 3.5 + 12),
            breathDefense: Math.round(stats.wisdom * 2 + 8),
            breathAvoid: Math.round(Math.min(99, (stats.wisdom + stats.endurance) / 2 * 2 + 10))
        };
        
        // ========== ステップ3: 装備の戦力補正を加算 ==========
        const equipmentBattleStatMods = this.equipmentManager.getTotalBattleStatMods();
        for (const [key, value] of Object.entries(equipmentBattleStatMods)) {
            if (battleStats[key] !== undefined) {
                battleStats[key] += value;
            }
        }
        
        // ========== ステップ4: スキル効果を適用 ==========
        const skills = this.skillManager.getAllSkills();
        for (const skill of skills) {
            const modifiedStats = this.applySkillEffect(skill, battleStats);
            Object.assign(battleStats, modifiedStats);
        }
        
        return battleStats;
    }
    
    /**
     * スキル効果を戦力値に適用
     */
    applySkillEffect(skill, battleStats) {
        const effect = skill.effect;
        const modified = { ...battleStats };
        
        switch (skill.id) {
            case 'doubleAttack':
                // 二重攻撃：攻撃力が120%になる
                modified.attack = Math.round(modified.attack * 1.2);
                break;
            case 'defensiveField':
                // 防御結界：防御力が110%になる
                modified.defense = Math.round(modified.defense * 1.1);
                break;
            case 'magicAmplify':
                // 魔力強化：魔法攻撃が120%になる
                modified.magicAttack = Math.round(modified.magicAttack * 1.2);
                break;
            case 'breathAmplify':
                // ブレス強化：ブレス威力が125%になる
                modified.breathPower = Math.round(modified.breathPower * 1.25);
                break;
            // counter, zombie, acceleration はバトル中に処理されるため、ここでは適用しない
        }
        
        return modified;
    }
    
    /**
     * キャラクターを更新
     */
    update(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.gender !== undefined) this.gender = data.gender;
        if (data.race !== undefined) this.race = data.race;
        if (data.personality !== undefined) this.personality = data.personality;
        if (data.job !== undefined) this.job = data.job;
        if (data.level !== undefined) this.level = data.level;
        
        if (data.baseStats) {
            this.baseStats = { ...this.baseStats, ...data.baseStats };
        }
        
        if (data.tacticId !== undefined) this.tacticId = data.tacticId;
        if (data.position !== undefined) this.position = data.position;
        
        // 戦力値を再計算
        this.calculatedBaseStats = this.calculateFinalBaseStats();
        this.battleStats = this.calculateBattleStats();
        this.updatedAt = new Date().toISOString();
    }
    
    /**
     * 装備を追加
     */
    addEquipment(equipmentId) {
        const result = this.equipmentManager.addEquipment(equipmentId);
        if (result) {
            // 装備が変わったので戦力値を再計算
            this.calculatedBaseStats = this.calculateFinalBaseStats();
            this.battleStats = this.calculateBattleStats();
        }
        return result;
    }
    
    /**
     * 装備を削除
     */
    removeEquipment(index) {
        const result = this.equipmentManager.removeEquipment(index);
        if (result) {
            // 装備が変わったので戦力値を再計算
            this.calculatedBaseStats = this.calculateFinalBaseStats();
            this.battleStats = this.calculateBattleStats();
        }
        return result;
    }
    
    /**
     * スキルを追加
     */
    addSkill(skillId) {
        const skill = this.skillManager.addSkill(skillId);
        if (skill) {
            // スキルが追加されたので戦力値を再計算
            this.battleStats = this.calculateBattleStats();
        }
        return skill;
    }
    
    /**
     * キャラクターをJSONに変換（保存用）
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            gender: this.gender,
            race: this.race,
            personality: this.personality,
            job: this.job,
            level: this.level,
            baseStats: this.baseStats,
            calculatedBaseStats: this.calculatedBaseStats,
            battleStats: this.battleStats,
            equipment: this.equipmentManager.equipment.map(e => e.id),
            maxEquipment: this.equipmentManager.maxEquipment,
            skills: this.skillManager.skills.map(s => s.id),
            tacticId: this.tacticId,
            position: this.position,
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
            level: this.level,
            position: this.position,
            hp: this.battleStats.hp,
            attack: this.battleStats.attack,
            defense: this.battleStats.defense,
            equipment: this.equipmentManager.getEquipmentCount(),
            skills: this.skillManager.skills.length
        };
    }
    
    /**
     * キャラクターの詳細情報を取得（UI表示用）
     */
    getDetailInfo() {
        const tactics = GUILD_CONSTANTS.TACTICS.find(t => t.id === this.tacticId);
        
        return {
            // 基本情報
            name: this.name,
            gender: this.gender,
            race: this.race,
            personality: this.personality,
            job: this.job,
            level: this.level,
            position: this.position,
            
            // 基礎値
            baseStats: this.baseStats,
            calculatedBaseStats: this.calculatedBaseStats,
            
            // 戦力値
            battleStats: this.battleStats,
            
            // 装備・スキル・戦術
            equipment: this.equipmentManager.getAllEquipment(),
            equipmentCount: this.equipmentManager.getEquipmentCount(),
            maxEquipment: this.equipmentManager.maxEquipment,
            skills: this.skillManager.getAllSkills(),
            tactics: tactics || {}
        };
    }
}
