// ========================================
// ギルドUI管理
// ========================================

/**
 * ギルドUIを管理するクラス
 */
class GuildUI {
    constructor() {
        this.currentView = 'list'; // list, detail, create, edit
        this.selectedCharacterId = null;
        this.characters = [];
    }
    
    /**
     * UI初期化
     */
    async init() {
        console.log('ギルドUI初期化中...');
        await guildDB.init();
        await this.loadCharacters();
        this.render();
    }
    
    /**
     * データベースからキャラクターを読み込み
     */
    async loadCharacters() {
        this.characters = await guildDB.getAllCharacters();
        console.log(`${this.characters.length}体のキャラクターを読み込み`);
    }
    
    /**
     * メイン画面をレンダリング
     */
    render() {
        const pageBody = document.querySelector('#page-guild .page-body');
        
        if (!pageBody) {
            console.error('ギルドページボディが見つかりません');
            return;
        }
        
        pageBody.innerHTML = '';
        
        switch (this.currentView) {
            case 'list':
                this.renderList(pageBody);
                break;
            case 'detail':
                this.renderDetail(pageBody);
                break;
            case 'create':
                this.renderCreate(pageBody);
                break;
            case 'edit':
                this.renderEdit(pageBody);
                break;
            default:
                this.renderList(pageBody);
        }
    }
    
    /**
     * キャラクター一覧を表示
     */
    renderList(container) {
        const html = `
            <div class="guild-list-view">
                <div class="guild-header">
                    <h3>ギルドメンバー（${this.characters.length}/${GUILD_CONSTANTS.MAX_CHARACTERS}）</h3>
                    <button class="btn-primary" onclick="guildUI.switchView('create')">
                        + 新しいメンバーを雇用
                    </button>
                </div>
                
                <div class="guild-stats">
                    <div class="stat-card">
                        <span class="stat-label">総戦力</span>
                        <span class="stat-value">${this.calculateTotalPower()}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">平均HP</span>
                        <span class="stat-value">${this.calculateAverageHP()}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">前衛</span>
                        <span class="stat-value">${this.characters.filter(c => c.position === 'front').length}</span>
                    </div>
                </div>
                
                <div class="character-list">
                    ${this.characters.length === 0 ? 
                        '<p class="empty-message">メンバーがいません。新しいメンバーを雇用しましょう！</p>' :
                        this.characters.map(char => this.renderCharacterCard(char)).join('')
                    }
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * キャラクターカードを表示
     */
    renderCharacterCard(character) {
        return `
            <div class="character-card" data-id="${character.id}">
                <div class="card-header">
                    <h4>${character.name}</h4>
                    <span class="job-badge">${this.getJobName(character.job)}</span>
                </div>
                <div class="card-info">
                    <p><span class="label">種族:</span> ${this.getRaceName(character.race)}</p>
                    <p><span class="label">配置:</span> ${this.getPositionName(character.position)}</p>
                </div>
                <div class="card-stats">
                    <div class="stat"><span class="stat-name">HP</span><span class="stat-num">${character.battleStats.hp}</span></div>
                    <div class="stat"><span class="stat-name">攻撃</span><span class="stat-num">${character.battleStats.attack}</span></div>
                    <div class="stat"><span class="stat-name">防御</span><span class="stat-num">${character.battleStats.defense}</span></div>
                </div>
                <div class="card-actions">
                    <button class="btn-sm" onclick="guildUI.switchView('detail', '${character.id}')">詳細</button>
                    <button class="btn-sm" onclick="guildUI.switchView('edit', '${character.id}')">編集</button>
                    <button class="btn-sm btn-danger" onclick="guildUI.deleteCharacter('${character.id}')">解雇</button>
                </div>
            </div>
        `;
    }
    
    /**
     * キャラクター詳細を表示
     */
    renderDetail(container) {
        const character = this.characters.find(c => c.id === this.selectedCharacterId);
        
        if (!character) {
            container.innerHTML = '<p>キャラクターが見つかりません</p>';
            return;
        }
        
        const html = `
            <div class="guild-detail-view">
                <button class="btn-secondary" onclick="guildUI.switchView('list')">← 一覧に戻る</button>
                
                <div class="detail-header">
                    <h3>${character.name}</h3>
                </div>
                
                <div class="detail-content">
                    <div class="detail-section">
                        <h4>基本情報</h4>
                        <table class="detail-table">
                            <tr><td>性別</td><td>${this.getGenderName(character.gender)}</td></tr>
                            <tr><td>種族</td><td>${this.getRaceName(character.race)}</td></tr>
                            <tr><td>職業</td><td>${this.getJobName(character.job)}</td></tr>
                            <tr><td>個性</td><td>${this.getPersonalityName(character.personality)}</td></tr>
                            <tr><td>配置</td><td>${this.getPositionName(character.position)}</td></tr>
                        </table>
                    </div>
                    
                    <div class="detail-section">
                        <h4>基礎値</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">体力</span>
                                <span class="stat-bar" style="width: ${character.baseStats.vitality * 5}%">${character.baseStats.vitality}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">力</span>
                                <span class="stat-bar" style="width: ${character.baseStats.strength * 5}%">${character.baseStats.strength}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">敏捷</span>
                                <span class="stat-bar" style="width: ${character.baseStats.endurance * 5}%">${character.baseStats.endurance}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">精神</span>
                                <span class="stat-bar" style="width: ${character.baseStats.spirit * 5}%">${character.baseStats.spirit}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">知恵</span>
                                <span class="stat-bar" style="width: ${character.baseStats.wisdom * 5}%">${character.baseStats.wisdom}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">運</span>
                                <span class="stat-bar" style="width: ${character.baseStats.luck * 5}%">${character.baseStats.luck}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>戦力値</h4>
                        <div class="stats-grid">
                            <div class="stat-item"><span class="stat-label">HP</span><span class="stat-num">${character.battleStats.hp}</span></div>
                            <div class="stat-item"><span class="stat-label">攻撃力</span><span class="stat-num">${character.battleStats.attack}</span></div>
                            <div class="stat-item"><span class="stat-label">命中率</span><span class="stat-num">${character.battleStats.hitRate}%</span></div>
                            <div class="stat-item"><span class="stat-label">必殺率</span><span class="stat-num">${character.battleStats.criticalRate}%</span></div>
                            <div class="stat-item"><span class="stat-label">防御力</span><span class="stat-num">${character.battleStats.defense}</span></div>
                            <div class="stat-item"><span class="stat-label">回避率</span><span class="stat-num">${character.battleStats.avoidRate}%</span></div>
                            <div class="stat-item"><span class="stat-label">魔法攻撃</span><span class="stat-num">${character.battleStats.magicAttack}</span></div>
                            <div class="stat-item"><span class="stat-label">魔法防御</span><span class="stat-num">${character.battleStats.magicDefense}</span></div>
                            <div class="stat-item"><span class="stat-label">ブレス威力</span><span class="stat-num">${character.battleStats.breathPower}</span></div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>装備</h4>
                        <p>装備数: ${character.equipment.length}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>戦術</h4>
                        <table class="detail-table">
                            <tr><td>物理選択率</td><td>${(character.tactics.physicalRate * 100).toFixed(1)}%</td></tr>
                            <tr><td>魔法選択率</td><td>${(character.tactics.magicRate * 100).toFixed(1)}%</td></tr>
                            <tr><td>ブレス選択率</td><td>${(character.tactics.breathRate * 100).toFixed(1)}%</td></tr>
                            <tr><td>攻撃率</td><td>${(character.tactics.attackRate * 100).toFixed(1)}%</td></tr>
                            <tr><td>防御率</td><td>${(character.tactics.defenseRate * 100).toFixed(1)}%</td></tr>
                            <tr><td>補助率</td><td>${(character.tactics.supportRate * 100).toFixed(1)}%</td></tr>
                        </table>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn-primary" onclick="guildUI.switchView('edit', '${character.id}')">編集</button>
                    <button class="btn-secondary" onclick="guildUI.switchView('list')">戻る</button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * キャラクター作成フォームを表示
     */
    renderCreate(container) {
        const html = `
            <div class="guild-create-view">
                <button class="btn-secondary" onclick="guildUI.switchView('list')">← キャンセル</button>
                
                <h3>新しいメンバーを雇用</h3>
                
                <form id="character-create-form" class="character-form">
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" id="form-name" placeholder="キャラクター名を入力" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>性別</label>
                            <select id="form-gender" required>
                                ${GUILD_CONSTANTS.GENDERS.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>種族</label>
                            <select id="form-race" required>
                                ${GUILD_CONSTANTS.RACES.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>職業</label>
                            <select id="form-job" required>
                                ${GUILD_CONSTANTS.JOBS.map(j => `<option value="${j.id}">${j.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>個性</label>
                            <select id="form-personality" required>
                                ${GUILD_CONSTANTS.PERSONALITIES.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>配置</label>
                        <div class="radio-group">
                            ${GUILD_CONSTANTS.POSITIONS.map(pos => `
                                <label class="radio-label">
                                    <input type="radio" name="position" value="${pos.id}" ${pos.id === 'front' ? 'checked' : ''}>
                                    ${pos.name}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="base-stats-section">
                        <h4>基礎値を設定（1-20）</h4>
                        <div class="stats-input-grid">
                            <div class="stat-input">
                                <label>体力</label>
                                <input type="number" id="stat-vitality" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>力</label>
                                <input type="number" id="stat-strength" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>敏捷</label>
                                <input type="number" id="stat-endurance" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>精神</label>
                                <input type="number" id="stat-spirit" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>知恵</label>
                                <input type="number" id="stat-wisdom" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>運</label>
                                <input type="number" id="stat-luck" min="1" max="20" value="10">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-primary" onclick="guildUI.saveCharacter()">雇用</button>
                        <button type="button" class="btn-secondary" onclick="guildUI.switchView('list')">キャンセル</button>
                    </div>
                </form>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * キャラクター編集フォームを表示
     */
    renderEdit(container) {
        const character = this.characters.find(c => c.id === this.selectedCharacterId);
        
        if (!character) {
            container.innerHTML = '<p>キャラクターが見つかりません</p>';
            return;
        }
        
        const html = `
            <div class="guild-edit-view">
                <button class="btn-secondary" onclick="guildUI.switchView('detail', '${character.id}')">← キャンセル</button>
                
                <h3>${character.name}を編集</h3>
                
                <form id="character-edit-form" class="character-form">
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" id="form-name" value="${character.name}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>職業</label>
                            <select id="form-job" required>
                                ${GUILD_CONSTANTS.JOBS.map(j => `<option value="${j.id}" ${j.id === character.job ? 'selected' : ''}>${j.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>配置</label>
                            <select id="form-position" required>
                                ${GUILD_CONSTANTS.POSITIONS.map(pos => `<option value="${pos.id}" ${pos.id === character.position ? 'selected' : ''}>${pos.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="base-stats-section">
                        <h4>基礎値を編集（1-20）</h4>
                        <div class="stats-input-grid">
                            <div class="stat-input">
                                <label>体力</label>
                                <input type="number" id="stat-vitality" min="1" max="20" value="${character.baseStats.vitality}">
                            </div>
                            <div class="stat-input">
                                <label>力</label>
                                <input type="number" id="stat-strength" min="1" max="20" value="${character.baseStats.strength}">
                            </div>
                            <div class="stat-input">
                                <label>敏捷</label>
                                <input type="number" id="stat-endurance" min="1" max="20" value="${character.baseStats.endurance}">
                            </div>
                            <div class="stat-input">
                                <label>精神</label>
                                <input type="number" id="stat-spirit" min="1" max="20" value="${character.baseStats.spirit}">
                            </div>
                            <div class="stat-input">
                                <label>知恵</label>
                                <input type="number" id="stat-wisdom" min="1" max="20" value="${character.baseStats.wisdom}">
                            </div>
                            <div class="stat-input">
                                <label>運</label>
                                <input type="number" id="stat-luck" min="1" max="20" value="${character.baseStats.luck}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tactics-section">
                        <h4>戦術を設定</h4>
                        <div class="tactics-input">
                            <label>物理選択率: <span id="physical-rate-display">${(character.tactics.physicalRate * 100).toFixed(1)}%</span></label>
                            <input type="range" id="physical-rate" min="0" max="100" value="${character.tactics.physicalRate * 100}" oninput="document.getElementById('physical-rate-display').textContent = this.value + '%'">
                        </div>
                        <div class="tactics-input">
                            <label>魔法選択率: <span id="magic-rate-display">${(character.tactics.magicRate * 100).toFixed(1)}%</span></label>
                            <input type="range" id="magic-rate" min="0" max="100" value="${character.tactics.magicRate * 100}" oninput="document.getElementById('magic-rate-display').textContent = this.value + '%'">
                        </div>
                        <div class="tactics-input">
                            <label>ブレス選択率: <span id="breath-rate-display">${(character.tactics.breathRate * 100).toFixed(1)}%</span></label>
                            <input type="range" id="breath-rate" min="0" max="100" value="${character.tactics.breathRate * 100}" oninput="document.getElementById('breath-rate-display').textContent = this.value + '%'">
                        </div>
                        <div class="tactics-input">
                            <label>攻撃率: <span id="attack-rate-display">${(character.tactics.attackRate * 100).toFixed(1)}%</span></label>
                            <input type="range" id="attack-rate" min="0" max="100" value="${character.tactics.attackRate * 100}" oninput="document.getElementById('attack-rate-display').textContent = this.value + '%'">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-primary" onclick="guildUI.updateCharacter()">保存</button>
                        <button type="button" class="btn-secondary" onclick="guildUI.switchView('detail', '${character.id}')">キャンセル</button>
                    </div>
                </form>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * ビューを切り替え
     */
    switchView(viewName, characterId = null) {
        this.currentView = viewName;
        this.selectedCharacterId = characterId;
        this.render();
    }
    
    /**
     * キャラクターを保存（新規作成）
     */
    async saveCharacter() {
        const name = document.getElementById('form-name').value;
        const gender = document.getElementById('form-gender').value;
        const race = document.getElementById('form-race').value;
        const job = document.getElementById('form-job').value;
        const personality = document.getElementById('form-personality').value;
        const position = document.querySelector('input[name="position"]:checked').value;
        
        const baseStats = {
            vitality: parseInt(document.getElementById('stat-vitality').value),
            strength: parseInt(document.getElementById('stat-strength').value),
            endurance: parseInt(document.getElementById('stat-endurance').value),
            spirit: parseInt(document.getElementById('stat-spirit').value),
            wisdom: parseInt(document.getElementById('stat-wisdom').value),
            luck: parseInt(document.getElementById('stat-luck').value)
        };
        
        if (this.characters.length >= GUILD_CONSTANTS.MAX_CHARACTERS) {
            alert(`ギルドメンバーの上限（${GUILD_CONSTANTS.MAX_CHARACTERS}）に達しています`);
            return;
        }
        
        const character = new Character({
            name,
            gender,
            race,
            job,
            personality,
            position,
            baseStats
        });
        
        await guildDB.saveCharacter(character);
        await this.loadCharacters();
        this.switchView('list');
    }
    
    /**
     * キャラクターを更新
     */
    async updateCharacter() {
        const character = this.characters.find(c => c.id === this.selectedCharacterId);
        
        if (!character) return;
        
        const name = document.getElementById('form-name').value;
        const job = document.getElementById('form-job').value;
        const position = document.getElementById('form-position').value;
        
        const baseStats = {
            vitality: parseInt(document.getElementById('stat-vitality').value),
            strength: parseInt(document.getElementById('stat-strength').value),
            endurance: parseInt(document.getElementById('stat-endurance').value),
            spirit: parseInt(document.getElementById('stat-spirit').value),
            wisdom: parseInt(document.getElementById('stat-wisdom').value),
            luck: parseInt(document.getElementById('stat-luck').value)
        };
        
        const tactics = {
            physicalRate: parseInt(document.getElementById('physical-rate').value) / 100,
            magicRate: parseInt(document.getElementById('magic-rate').value) / 100,
            breathRate: parseInt(document.getElementById('breath-rate').value) / 100,
            attackRate: parseInt(document.getElementById('attack-rate').value) / 100,
            defenseRate: 0.3,
            supportRate: 0.1
        };
        
        character.update({
            name,
            job,
            position,
            baseStats,
            tactics
        });
        
        await guildDB.saveCharacter(character);
        await this.loadCharacters();
        this.switchView('detail', character.id);
    }
    
    /**
     * キャラクターを削除
     */
    async deleteCharacter(characterId) {
        if (confirm('このメンバーを解雇しますか？')) {
            await guildDB.deleteCharacter(characterId);
            await this.loadCharacters();
            this.switchView('list');
        }
    }
    
    /**
     * ヘルパー関数
     */
    getJobName(jobId) {
        const job = GUILD_CONSTANTS.JOBS.find(j => j.id === jobId);
        return job ? job.name : jobId;
    }
    
    getRaceName(raceId) {
        const race = GUILD_CONSTANTS.RACES.find(r => r.id === raceId);
        return race ? race.name : raceId;
    }
    
    getGenderName(genderId) {
        const gender = GUILD_CONSTANTS.GENDERS.find(g => g.id === genderId);
        return gender ? gender.name : genderId;
    }
    
    getPersonalityName(personalityId) {
        const personality = GUILD_CONSTANTS.PERSONALITIES.find(p => p.id === personalityId);
        return personality ? personality.name : personalityId;
    }
    
    getPositionName(positionId) {
        const position = GUILD_CONSTANTS.POSITIONS.find(p => p.id === positionId);
        return position ? position.name : positionId;
    }
    
    calculateTotalPower() {
        return this.characters.reduce((sum, char) => sum + char.battleStats.hp + char.battleStats.attack + char.battleStats.defense, 0);
    }
    
    calculateAverageHP() {
        if (this.characters.length === 0) return 0;
        const totalHP = this.characters.reduce((sum, char) => sum + char.battleStats.hp, 0);
        return Math.round(totalHP / this.characters.length);
    }
}

// グローバルインスタンス
const guildUI = new GuildUI();
