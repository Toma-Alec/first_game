// ========================================
// ギルド画面UI管理（改良版）
// ========================================

/**
 * ギルドUIを管理するクラス
 * 5つのメニュー：編成・雇用・転職・装備・解雇
 */
class GuildUI {
    constructor() {
        this.currentGuildView = 'composition'; // composition, recruit, job_change, equipment, dismiss
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
    }
    
    /**
     * データベースからキャラクターを読み込み
     */
    async loadCharacters() {
        this.characters = await guildDB.getAllCharacters();
        console.log(`${this.characters.length}体のキャラクターを読み込み`);
    }
    
    /**
     * ギルドビューを切り替え
     */
    switchGuildView(viewName) {
        this.currentGuildView = viewName;
        this.render();
    }
    
    /**
     * メイン画面をレンダリング
     */
    render() {
        const container = document.querySelector('#guild-content');
        
        if (!container) {
            console.error('ギルドコンテンツが見つかりません');
            return;
        }
        
        container.innerHTML = '';
        
        switch (this.currentGuildView) {
            case 'composition':
                this.renderComposition(container);
                break;
            case 'recruit':
                this.renderRecruit(container);
                break;
            case 'job_change':
                this.renderJobChange(container);
                break;
            case 'equipment':
                this.renderEquipment(container);
                break;
            case 'dismiss':
                this.renderDismiss(container);
                break;
            default:
                this.renderComposition(container);
        }
    }
    
    /**
     * 編成画面
     */
    renderComposition(container) {
        const frontMembers = this.characters.filter(c => c.position === 'front');
        const middleMembers = this.characters.filter(c => c.position === 'middle');
        const rearMembers = this.characters.filter(c => c.position === 'rear');
        
        const html = `
            <div class="composition-view">
                <h3>編成</h3>
                <p>ギルドメンバーの配置を編成します（${this.characters.length}/${GUILD_CONSTANTS.MAX_CHARACTERS}）</p>
                
                <div class="formation-display">
                    <div class="position-group">
                        <h4>前衛 (${frontMembers.length}人)</h4>
                        <div class="character-list">
                            ${frontMembers.length === 0 ? '<p class="empty">配置されたメンバーがいません</p>' :
                            frontMembers.map(c => `
                                <div class="char-item">
                                    <strong>${c.name}</strong>
                                    <p>${this.getRaceName(c.race)} - ${this.getJobName(c.job)}</p>
                                    <p>Lv${c.level} | HP: ${c.battleStats.hp} | 攻撃: ${c.battleStats.attack}</p>
                                    <button class="btn-sm" onclick="guildUI.changePosition('${c.id}')">変更</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="position-group">
                        <h4>中衛 (${middleMembers.length}人)</h4>
                        <div class="character-list">
                            ${middleMembers.length === 0 ? '<p class="empty">配置されたメンバーがいません</p>' :
                            middleMembers.map(c => `
                                <div class="char-item">
                                    <strong>${c.name}</strong>
                                    <p>${this.getRaceName(c.race)} - ${this.getJobName(c.job)}</p>
                                    <p>Lv${c.level} | HP: ${c.battleStats.hp} | 攻撃: ${c.battleStats.attack}</p>
                                    <button class="btn-sm" onclick="guildUI.changePosition('${c.id}')">変更</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="position-group">
                        <h4>後衛 (${rearMembers.length}人)</h4>
                        <div class="character-list">
                            ${rearMembers.length === 0 ? '<p class="empty">配置されたメンバーがいません</p>' :
                            rearMembers.map(c => `
                                <div class="char-item">
                                    <strong>${c.name}</strong>
                                    <p>${this.getRaceName(c.race)} - ${this.getJobName(c.job)}</p>
                                    <p>Lv${c.level} | HP: ${c.battleStats.hp} | 攻撃: ${c.battleStats.attack}</p>
                                    <button class="btn-sm" onclick="guildUI.changePosition('${c.id}')">変更</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 雇用画面
     */
    renderRecruit(container) {
        const html = `
            <div class="recruit-view">
                <h3>新しいメンバーを雇用</h3>
                <form id="recruit-form" class="recruit-form">
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" id="recruit-name" placeholder="キャラクター名" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>性別</label>
                            <select id="recruit-gender" required>
                                ${GUILD_CONSTANTS.GENDERS.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>種族</label>
                            <select id="recruit-race" required>
                                ${GUILD_CONSTANTS.RACES.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>職業</label>
                            <select id="recruit-job" required>
                                ${GUILD_CONSTANTS.JOBS.map(j => `<option value="${j.id}">${j.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>個性</label>
                            <select id="recruit-personality" required>
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
                                <input type="number" id="recruit-vitality" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>力</label>
                                <input type="number" id="recruit-strength" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>敏捷</label>
                                <input type="number" id="recruit-endurance" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>精神</label>
                                <input type="number" id="recruit-spirit" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>知恵</label>
                                <input type="number" id="recruit-wisdom" min="1" max="20" value="10">
                            </div>
                            <div class="stat-input">
                                <label>運</label>
                                <input type="number" id="recruit-luck" min="1" max="20" value="10">
                            </div>
                        </div>
                    </div>
                    
                    <button type="button" class="btn-primary" onclick="guildUI.recruitCharacter()">雇用</button>
                </form>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 転職画面
     */
    renderJobChange(container) {
        const html = `
            <div class="job-change-view">
                <h3>転職</h3>
                <p>メンバーの職業を変更します</p>
                
                <div class="character-list">
                    ${this.characters.length === 0 ? '<p class="empty">メンバーがいません</p>' :
                    this.characters.map(c => `
                        <div class="char-item">
                            <h4>${c.name}</h4>
                            <p>現在の職業: ${this.getJobName(c.job)}</p>
                            <div class="job-selection">
                                <select id="job-select-${c.id}" onchange="guildUI.changeJob('${c.id}', this.value)">
                                    <option value="">職業を選択...</option>
                                    ${GUILD_CONSTANTS.JOBS.map(j => `
                                        <option value="${j.id}" ${j.id === c.job ? 'selected' : ''}>${j.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 装備画面
     */
    renderEquipment(container) {
        const html = `
            <div class="equipment-view">
                <h3>装備</h3>
                <p>メンバーに装備を与えます</p>
                
                <div class="character-list">
                    ${this.characters.length === 0 ? '<p class="empty">メンバーがいません</p>' :
                    this.characters.map(c => `
                        <div class="char-item">
                            <h4>${c.name}</h4>
                            <p>装備: ${c.equipmentManager.getEquipmentCount()}/${c.equipmentManager.maxEquipment}</p>
                            <div class="equipment-section">
                                ${c.equipmentManager.getAllEquipment().map((equip, idx) => `
                                    <div class="equipment-item">
                                        <span>${equip.name}</span>
                                        <button class="btn-sm btn-danger" onclick="guildUI.removeEquipment('${c.id}', ${idx})">削除</button>
                                    </div>
                                `).join('')}
                                ${c.equipmentManager.getAvailableSlots() > 0 ? `
                                    <div class="add-equipment">
                                        <select id="equip-select-${c.id}" onchange="guildUI.addEquipment('${c.id}', this.value); this.value = ''">
                                            <option value="">装備を追加...</option>
                                            ${Object.keys(EQUIPMENT_MASTER_DATA).map(equipId => `
                                                <option value="${equipId}">${EQUIPMENT_MASTER_DATA[equipId].name}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                ` : '<p class="full">装備がいっぱいです</p>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 解雇画面
     */
    renderDismiss(container) {
        const html = `
            <div class="dismiss-view">
                <h3>解雇</h3>
                <p>ギルドメンバーを解雇します</p>
                
                <div class="character-list">
                    ${this.characters.length === 0 ? '<p class="empty">メンバーがいません</p>' :
                    this.characters.map(c => `
                        <div class="char-item">
                            <h4>${c.name}</h4>
                            <p>職業: ${this.getJobName(c.job)} | Lv${c.level} | HP: ${c.battleStats.hp}</p>
                            <button class="btn-danger" onclick="guildUI.dismissCharacter('${c.id}')">解雇</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * キャラクターの職業を変更
     */
    async changeJob(characterId, newJobId) {
        if (!newJobId) return;
        
        const character = this.characters.find(c => c.id === characterId);
        if (character) {
            character.update({ job: newJobId });
            await guildDB.saveCharacter(character);
            alert(`${character.name}は${this.getJobName(newJobId)}に転職しました！`);
            this.render();
        }
    }
    
    /**
     * キャラクターの配置を変更
     */
    async changePosition(characterId) {
        const char = this.characters.find(c => c.id === characterId);
        const newPos = prompt(`${char.name}の配置を選択（前衛/中衛/後衛）:`, char.position);
        if (newPos && ['front', 'middle', 'rear'].includes(newPos)) {
            char.update({ position: newPos });
            await guildDB.saveCharacter(char);
            this.render();
        }
    }
    
    /**
     * 装備を追加
     */
    async addEquipment(characterId, equipmentId) {
        if (!equipmentId) return;
        
        const character = this.characters.find(c => c.id === characterId);
        if (character && character.addEquipment(equipmentId)) {
            await guildDB.saveCharacter(character);
            this.render();
        } else {
            alert('装備の追加に失敗しました');
        }
    }
    
    /**
     * 装備を削除
     */
    async removeEquipment(characterId, equipmentIndex) {
        const character = this.characters.find(c => c.id === characterId);
        if (character && character.removeEquipment(equipmentIndex)) {
            await guildDB.saveCharacter(character);
            this.render();
        }
    }
    
    /**
     * 新しいキャラクターを雇用
     */
    async recruitCharacter() {
        const name = document.getElementById('recruit-name').value;
        const gender = document.getElementById('recruit-gender').value;
        const race = document.getElementById('recruit-race').value;
        const job = document.getElementById('recruit-job').value;
        const personality = document.getElementById('recruit-personality').value;
        const position = document.querySelector('input[name="position"]:checked').value;
        
        const baseStats = {
            vitality: parseInt(document.getElementById('recruit-vitality').value),
            strength: parseInt(document.getElementById('recruit-strength').value),
            endurance: parseInt(document.getElementById('recruit-endurance').value),
            spirit: parseInt(document.getElementById('recruit-spirit').value),
            wisdom: parseInt(document.getElementById('recruit-wisdom').value),
            luck: parseInt(document.getElementById('recruit-luck').value)
        };
        
        if (this.characters.length >= GUILD_CONSTANTS.MAX_CHARACTERS) {
            alert(`ギルドメンバーの上限（${GUILD_CONSTANTS.MAX_CHARACTERS}）に達しています`);
            return;
        }
        
        const character = new Character({
            name, gender, race, job, personality, position, baseStats
        });
        
        await guildDB.saveCharacter(character);
        await this.loadCharacters();
        alert(`${name}を雇用しました！`);
        this.render();
    }
    
    /**
     * キャラクターを解雇
     */
    async dismissCharacter(characterId) {
        const char = this.characters.find(c => c.id === characterId);
        if (char && confirm(`${char.name}を解雇しますか？`)) {
            await guildDB.deleteCharacter(characterId);
            await this.loadCharacters();
            this.render();
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
}

// グローバルインスタンス
const guildUI = new GuildUI();
