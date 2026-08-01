// ========================================
// ギルドデータベース（IndexedDB）
// ========================================

/**
 * ギルドデータベース管理クラス
 * IndexedDBを使用してキャラクターデータを永続化
 */
class GuildDatabase {
    constructor() {
        this.dbName = 'GuildDB';
        this.version = 1;
        this.db = null;
    }
    
    /**
     * データベースを初期化
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                console.error('データベースのオープンに失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ ギルドデータベース初期化完了');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // キャラクターストア
                if (!db.objectStoreNames.contains('characters')) {
                    const characterStore = db.createObjectStore('characters', { keyPath: 'id' });
                    characterStore.createIndex('name', 'name', { unique: false });
                    characterStore.createIndex('job', 'job', { unique: false });
                    console.log('キャラクターストア作成完了');
                }
            };
        });
    }
    
    /**
     * キャラクターを保存
     */
    async saveCharacter(character) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readwrite');
            const store = transaction.objectStore('characters');
            const request = store.put(character.toJSON());
            
            request.onerror = () => {
                console.error('キャラクター保存失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log(`✅ キャラクター「${character.name}」を保存しました`);
                resolve(character);
            };
        });
    }
    
    /**
     * すべてのキャラクターを取得
     */
    async getAllCharacters() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readonly');
            const store = transaction.objectStore('characters');
            const request = store.getAll();
            
            request.onerror = () => {
                console.error('キャラクター取得失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                const charactersData = request.result;
                const characters = charactersData.map(data => Character.fromJSON(data));
                resolve(characters);
            };
        });
    }
    
    /**
     * キャラクターを取得（IDで検索）
     */
    async getCharacterById(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readonly');
            const store = transaction.objectStore('characters');
            const request = store.get(id);
            
            request.onerror = () => {
                console.error('キャラクター取得失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                const data = request.result;
                resolve(data ? Character.fromJSON(data) : null);
            };
        });
    }
    
    /**
     * キャラクターを削除
     */
    async deleteCharacter(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readwrite');
            const store = transaction.objectStore('characters');
            const request = store.delete(id);
            
            request.onerror = () => {
                console.error('キャラクター削除失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log(`✅ キャラクター（ID: ${id}）を削除しました`);
                resolve();
            };
        });
    }
    
    /**
     * すべてのキャラクターを削除
     */
    async deleteAllCharacters() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readwrite');
            const store = transaction.objectStore('characters');
            const request = store.clear();
            
            request.onerror = () => {
                console.error('全キャラクター削除失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log('✅ すべてのキャラクターを削除しました');
                resolve();
            };
        });
    }
    
    /**
     * キャラクター数を取得
     */
    async getCharacterCount() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['characters'], 'readonly');
            const store = transaction.objectStore('characters');
            const request = store.count();
            
            request.onerror = () => {
                console.error('キャラクター数取得失敗');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
}

// グローバルインスタンス
const guildDB = new GuildDatabase();