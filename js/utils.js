// ========================================
// ユーティリティ関数
// ========================================

// 簡単なセーブ機能
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    console.log('データを保存しました: ' + key);
};

// セーブされたデータを読み込み
const loadData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

// データを削除
const deleteData = (key) => {
    localStorage.removeItem(key);
    console.log('データを削除しました: ' + key);
};

// ゲーム情報を初期化
const initializeGame = () => {
    const gameState = loadData('guildGameState');
    
    if (!gameState) {
        // 初めてプレイの場合
        const newGameState = {
            playerName: 'プレイヤー',
            level: 1,
            experience: 0,
            gold: 1000,
            inventory: []
        };
        saveData('guildGameState', newGameState);
        console.log('ゲームを初期化しました');
        return newGameState;
    }
    
    return gameState;
};

// ゲームの状態を更新
const updateGameState = (updates) => {
    const currentState = loadData('guildGameState');
    const newState = { ...currentState, ...updates };
    saveData('guildGameState', newState);
    return newState;
};