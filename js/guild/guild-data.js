// ========================================
// ギルドデータ管理（IndexedDB）
// ========================================

/**
 * IndexedDBを使用したギルドデータ管理
 * キャラクターの永続化と効率的な読み書き
 */
class GuildDatabase {
    constructor() {
        this.dbName = 'GuildGameDB';
        this.storeName = 'characters';
        this.db = null;
        this.initialized = false;
    }
    
    /**
     * データベースを初期化
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => {
                console.error('IndexedDB初期化エラー');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                console.log('✓ IndexedDB初期化完了');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // キャラクターストアを作成
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('name', 'name', { unique: false });
                    store.createIndex('job', 'job', { unique: false });
                    store.createIndex('race', 'race', { unique: false });
                    console.log('✓ キャラクターストアを作成');
                }
            };
        });
    }
    
    /**
     * キャラクターを保存（新規作成または更新）
     */
    async saveCharacter(character) {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(character.toJSON());
            
            request.onsuccess = () => {
                console.log(`✓ キャラクター保存: ${character.name}`);
                resolve(character);
            };
            
            request.onerror = () => {
                console.error('キャラクター保存エラー');
                reject(request.error);
            };
        });
    }
    
    /**
     * IDでキャラクターを取得
     */
    async getCharacter(characterId) {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(characterId);
            
            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    resolve(Character.fromJSON(data));
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * すべてのキャラクターを取得
     */
    async getAllCharacters() {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            
            request.onsuccess = () => {
                const characters = request.result.map(data => Character.fromJSON(data));
                console.log(`✓ ${characters.length}体のキャラクターを読み込み`);
                resolve(characters);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * 職業でキャラクターを検索
     */
    async getCharactersByJob(job) {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('job');
            const request = index.getAll(job);
            
            request.onsuccess = () => {
                const characters = request.result.map(data => Character.fromJSON(data));
                resolve(characters);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * 種族でキャラクターを検索
     */
    async getCharactersByRace(race) {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('race');
            const request = index.getAll(race);
            
            request.onsuccess = () => {
                const characters = request.result.map(data => Character.fromJSON(data));
                resolve(characters);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * キャラクターを削除
     */
    async deleteCharacter(characterId) {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(characterId);
            
            request.onsuccess = () => {
                console.log(`✓ キャラクター削除: ${characterId}`);
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * すべてのキャラクターを削除
     */
    async deleteAllCharacters() {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            
            request.onsuccess = () => {
                console.log('✓ すべてのキャラクターを削除');
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * キャラクター数を取得
     */
    async getCharacterCount() {
        if (!this.initialized) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.count();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// グローバルインスタンス
const guildDB = new GuildDatabase();
