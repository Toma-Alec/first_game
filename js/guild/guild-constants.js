// ========================================
// ギルド定数・マスターデータ
// ========================================

const GUILD_CONSTANTS = {
    // キャラクター上限
    MAX_CHARACTERS: 250,
    
    // 種族
    RACES: [
        { id: 'human', name: '人間', description: 'バランスの取れた種族' },
        { id: 'elf', name: 'エルフ', description: '敏捷性と魔法に優れた種族' },
        { id: 'dwarf', name: 'ドワーフ', description: '体力と防御力に優れた種族' },
        { id: 'demon', name: '悪魔', description: '魔法とブレスに優れた種族' },
        { id: 'beast', name: '獣人', description: '力と敏捷性に優れた種族' }
    ],
    
    // 職業
    JOBS: [
        { id: 'warrior', name: '戦士', description: '前衛で敵を倒す', baseStats: { strength: 15, vitality: 12, endurance: 5, spirit: 3, wisdom: 3, luck: 2 } },
        { id: 'knight', name: '騎士', description: '前衛で敵を守る', baseStats: { strength: 12, vitality: 14, endurance: 4, spirit: 5, wisdom: 4, luck: 3 } },
        { id: 'archer', name: '弓手', description: '中衛で遠距離攻撃', baseStats: { strength: 10, vitality: 8, endurance: 12, spirit: 3, wisdom: 3, luck: 6 } },
        { id: 'mage', name: '魔法使い', description: '後衛で魔法攻撃', baseStats: { strength: 3, vitality: 5, endurance: 8, spirit: 15, wisdom: 12, luck: 4 } },
        { id: 'priest', name: '祭司', description: '後衛で回復・補助', baseStats: { strength: 4, vitality: 6, endurance: 8, spirit: 13, wisdom: 14, luck: 5 } },
        { id: 'breather', name: 'ブレス使い', description: '中衛でブレス攻撃', baseStats: { strength: 9, vitality: 10, endurance: 8, spirit: 12, wisdom: 8, luck: 5 } }
    ],
    
    // 性別
    GENDERS: [
        { id: 'male', name: '男性' },
        { id: 'female', name: '女性' },
        { id: 'neutral', name: 'その他' }
    ],
    
    // 個性（キャラクター特性）
    PERSONALITIES: [
        { id: 'brave', name: '勇敢', description: '攻撃力+5%' },
        { id: 'cautious', name: '慎重', description: '防御力+5%' },
        { id: 'quick', name: '素早い', description: '敏捷+5%' },
        { id: 'wise', name: '賢い', description: '知恵+5%' },
        { id: 'lucky', name: '幸運', description: '運+5%' },
        { id: 'tough', name: '丈夫', description: '体力+5%' },
        { id: 'gentle', name: '穏やか', description: '精神+5%' },
        { id: 'balanced', name: 'バランス型', description: '全ステータス+2%' }
    ],
    
    // 配置
    POSITIONS: [
        { id: 'front', name: '前衛', description: '敵との最前線に配置' },
        { id: 'middle', name: '中衛', description: '中央に配置' },
        { id: 'rear', name: '後衛', description: '後方で支援' }
    ],
    
    // 装備パーツ（例）
    EQUIPMENT_PARTS: [
        { id: 'weapon', name: '武器' },
        { id: 'armor', name: '防具' },
        { id: 'helmet', name: 'ヘルメット' },
        { id: 'gloves', name: '手甲' },
        { id: 'shoes', name: '靴' },
        { id: 'accessory', name: 'アクセサリー' }
    ],
    
    // 基礎ステータスの最大値
    BASE_STAT_MAX: 20,
    BASE_STAT_MIN: 1
};

// 基礎ステータスの計算結果テーブル（種族による補正）
const RACE_STAT_MODIFIERS = {
    human: { vitality: 1.0, strength: 1.0, endurance: 1.0, spirit: 1.0, wisdom: 1.0, luck: 1.0 },
    elf: { vitality: 0.9, strength: 0.95, endurance: 1.1, spirit: 1.05, wisdom: 1.05, luck: 0.95 },
    dwarf: { vitality: 1.15, strength: 1.05, endurance: 0.9, spirit: 0.9, wisdom: 1.0, luck: 0.95 },
    demon: { vitality: 0.95, strength: 1.05, endurance: 1.0, spirit: 1.1, wisdom: 1.05, luck: 1.1 },
    beast: { vitality: 1.05, strength: 1.1, endurance: 1.05, spirit: 0.9, wisdom: 0.9, luck: 1.0 }
};

// 個性による補正
const PERSONALITY_STAT_MODIFIERS = {
    brave: { strength: 1.05 },
    cautious: { defense: 1.05 },
    quick: { endurance: 1.05 },
    wise: { wisdom: 1.05 },
    lucky: { luck: 1.05 },
    tough: { vitality: 1.05 },
    gentle: { spirit: 1.05 },
    balanced: { vitality: 1.02, strength: 1.02, endurance: 1.02, spirit: 1.02, wisdom: 1.02, luck: 1.02 }
};
