// ========================================
// 種族の成長曲線データ
// ========================================

const RACE_GROWTH_CURVES = {
    human: {
        name: '人間',
        // レベルごとの基礎値加算（1-20までの基本値に対して加算）
        growthPerLevel: {
            vitality: 0.5,
            strength: 0.5,
            endurance: 0.5,
            spirit: 0.5,
            wisdom: 0.5,
            luck: 0.5
        }
    },
    elf: {
        name: 'エルフ',
        growthPerLevel: {
            vitality: 0.3,
            strength: 0.4,
            endurance: 0.6,
            spirit: 0.6,
            wisdom: 0.6,
            luck: 0.4
        }
    },
    dwarf: {
        name: 'ドワーフ',
        growthPerLevel: {
            vitality: 0.7,
            strength: 0.6,
            endurance: 0.3,
            spirit: 0.3,
            wisdom: 0.5,
            luck: 0.4
        }
    },
    demon: {
        name: '悪魔',
        growthPerLevel: {
            vitality: 0.4,
            strength: 0.5,
            endurance: 0.5,
            spirit: 0.7,
            wisdom: 0.6,
            luck: 0.7
        }
    },
    beast: {
        name: '獣人',
        growthPerLevel: {
            vitality: 0.6,
            strength: 0.7,
            endurance: 0.6,
            spirit: 0.3,
            wisdom: 0.3,
            luck: 0.5
        }
    }
};

// 種族ごとの基礎値加減算（キャラクター作成時）
const RACE_BASE_STAT_MODIFIERS = {
    human: { vitality: 0, strength: 0, endurance: 0, spirit: 0, wisdom: 0, luck: 0 },
    elf: { vitality: -1, strength: -1, endurance: +1, spirit: +1, wisdom: +1, luck: 0 },
    dwarf: { vitality: +2, strength: +1, endurance: -1, spirit: -1, wisdom: 0, luck: -1 },
    demon: { vitality: 0, strength: +1, endurance: 0, spirit: +2, wisdom: +1, luck: +1 },
    beast: { vitality: +1, strength: +2, endurance: +1, spirit: -1, wisdom: -1, luck: 0 }
};

// 個性ごとの基礎値加減算
const PERSONALITY_BASE_STAT_MODIFIERS = {
    brave: { vitality: 0, strength: +2, endurance: 0, spirit: 0, wisdom: 0, luck: 0 },
    cautious: { vitality: +1, strength: 0, endurance: 0, spirit: 0, wisdom: +1, luck: 0 },
    quick: { vitality: 0, strength: 0, endurance: +2, spirit: 0, wisdom: 0, luck: 0 },
    wise: { vitality: 0, strength: 0, endurance: 0, spirit: 0, wisdom: +2, luck: 0 },
    lucky: { vitality: 0, strength: 0, endurance: 0, spirit: 0, wisdom: 0, luck: +2 },
    tough: { vitality: +2, strength: 0, endurance: 0, spirit: 0, wisdom: 0, luck: 0 },
    gentle: { vitality: 0, strength: 0, endurance: 0, spirit: +2, wisdom: 0, luck: 0 },
    balanced: { vitality: 0, strength: 0, endurance: 0, spirit: 0, wisdom: 0, luck: 0 }
};

// 職業ごとの基礎値加減算
const JOB_BASE_STAT_MODIFIERS = {
    warrior: { vitality: 0, strength: +3, endurance: 0, spirit: -1, wisdom: -1, luck: 0 },
    knight: { vitality: +2, strength: +1, endurance: 0, spirit: +1, wisdom: 0, luck: 0 },
    archer: { vitality: 0, strength: 0, endurance: +2, spirit: 0, wisdom: 0, luck: +1 },
    mage: { vitality: -1, strength: -2, endurance: 0, spirit: +3, wisdom: +2, luck: 0 },
    priest: { vitality: 0, strength: -1, endurance: 0, spirit: +2, wisdom: +3, luck: 0 },
    breather: { vitality: 0, strength: 0, endurance: 0, spirit: +2, wisdom: 0, luck: 0 }
};
