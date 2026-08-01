// ========================================
// マスターデータ管理UI
// ========================================

/**
 * マスターデータ管理クラス
 * 種族・職業・個性・戦術・スキル・装備の編集機能
 */
class MasterDataManager {
    constructor() {
        this.currentView = 'races';
    }
    
    /**
     * ビューを切り替え
     */
    switchView(viewName) {
        this.currentView = viewName;
        this.render();
    }
    
    /**
     * メイン画面をレンダリング
     */
    render() {
        const container = document.querySelector('#master-data-content');
        
        if (!container) {
            console.error('マスターデータコンテンツが見つかりません');
            return;
        }
        
        container.innerHTML = '';
        
        switch (this.currentView) {
            case 'races':
                this.renderRaces(container);
                break;
            case 'jobs':
                this.renderJobs(container);
                break;
            case 'personalities':
                this.renderPersonalities(container);
                break;
            case 'tactics':
                this.renderTactics(container);
                break;
            case 'skills':
                this.renderSkills(container);
                break;
            case 'equipment':
                this.renderEquipment(container);
                break;
            default:
                this.renderRaces(container);
        }
    }
    
    /**
     * 種族マスターデータを表示
     */
    renderRaces(container) {
        const html = `
            <div class="master-data-view">
                <h3>種族マスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>種族ID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>基礎値補正</th>
                                <th>成長曲線</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${GUILD_CONSTANTS.RACES.map((race, idx) => `
                                <tr>
                                    <td>${race.id}</td>
                                    <td>
                                        <input type="text" class="race-name" data-idx="${idx}" value="${race.name}" onchange="masterDataManager.updateRaceName(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <input type="text" class="race-desc" data-idx="${idx}" value="${race.description}" onchange="masterDataManager.updateRaceDesc(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editRaceStats('${race.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editRaceGrowth('${race.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="alert('種族ID: ${race.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 職業マスターデータを表示
     */
    renderJobs(container) {
        const html = `
            <div class="master-data-view">
                <h3>職業マスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>職業ID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>基礎値補正</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${GUILD_CONSTANTS.JOBS.map((job, idx) => `
                                <tr>
                                    <td>${job.id}</td>
                                    <td>
                                        <input type="text" class="job-name" data-idx="${idx}" value="${job.name}" onchange="masterDataManager.updateJobName(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <input type="text" class="job-desc" data-idx="${idx}" value="${job.description}" onchange="masterDataManager.updateJobDesc(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editJobStats('${job.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="alert('職業ID: ${job.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 個性マスターデータを表示
     */
    renderPersonalities(container) {
        const html = `
            <div class="master-data-view">
                <h3>個性マスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>個性ID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>基礎値補正</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${GUILD_CONSTANTS.PERSONALITIES.map((personality, idx) => `
                                <tr>
                                    <td>${personality.id}</td>
                                    <td>
                                        <input type="text" class="pers-name" data-idx="${idx}" value="${personality.name}" onchange="masterDataManager.updatePersonalityName(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <input type="text" class="pers-desc" data-idx="${idx}" value="${personality.description}" onchange="masterDataManager.updatePersonalityDesc(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editPersonalityStats('${personality.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="alert('個性ID: ${personality.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 戦術マスターデータを表示
     */
    renderTactics(container) {
        const html = `
            <div class="master-data-view">
                <h3>戦術マスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>戦術ID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>行動設定</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${GUILD_CONSTANTS.TACTICS.map((tactic, idx) => `
                                <tr>
                                    <td>${tactic.id}</td>
                                    <td>
                                        <input type="text" class="tactic-name" data-idx="${idx}" value="${tactic.name}" onchange="masterDataManager.updateTacticName(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <input type="text" class="tactic-desc" data-idx="${idx}" value="${tactic.description}" onchange="masterDataManager.updateTacticDesc(${idx}, this.value)">
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editTacticRates('${tactic.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="masterDataManager.showTacticDetail('${tactic.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * スキルマスターデータを表示
     */
    renderSkills(container) {
        const html = `
            <div class="master-data-view">
                <h3>スキルマスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>スキルID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>トリガー</th>
                                <th>効果</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(SKILL_MASTER_DATA).map((skill, idx) => `
                                <tr>
                                    <td>${skill.id}</td>
                                    <td>
                                        <input type="text" class="skill-name" data-idx="${idx}" value="${skill.name}" onchange="masterDataManager.updateSkillName('${skill.id}', this.value)">
                                    </td>
                                    <td>
                                        <textarea class="skill-desc" data-idx="${idx}" onchange="masterDataManager.updateSkillDesc('${skill.id}', this.value)">${skill.description}</textarea>
                                    </td>
                                    <td>${skill.trigger}</td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editSkillEffect('${skill.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="masterDataManager.showSkillDetail('${skill.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 装備マスターデータを表示
     */
    renderEquipment(container) {
        const html = `
            <div class="master-data-view">
                <h3>装備マスターデータ</h3>
                <div class="master-data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>装備ID</th>
                                <th>名前</th>
                                <th>説明</th>
                                <th>タイプ</th>
                                <th>基礎値補正</th>
                                <th>戦力補正</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(EQUIPMENT_MASTER_DATA).map((equip, idx) => `
                                <tr>
                                    <td>${equip.id}</td>
                                    <td>
                                        <input type="text" class="equip-name" data-idx="${idx}" value="${equip.name}" onchange="masterDataManager.updateEquipmentName('${equip.id}', this.value)">
                                    </td>
                                    <td>
                                        <input type="text" class="equip-desc" data-idx="${idx}" value="${equip.description}" onchange="masterDataManager.updateEquipmentDesc('${equip.id}', this.value)">
                                    </td>
                                    <td>${equip.type}</td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editEquipmentBaseStats('${equip.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm" onclick="masterDataManager.editEquipmentBattleStats('${equip.id}')">編集</button>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-info" onclick="masterDataManager.showEquipmentDetail('${equip.id}')">詳細</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }
    
    /**
     * 更新関数群
     */
    updateRaceName(idx, value) {
        GUILD_CONSTANTS.RACES[idx].name = value;
        console.log(`種族[${idx}]名を更新: ${value}`);
    }
    
    updateRaceDesc(idx, value) {
        GUILD_CONSTANTS.RACES[idx].description = value;
        console.log(`種族[${idx}]説明を更新: ${value}`);
    }
    
    updateJobName(idx, value) {
        GUILD_CONSTANTS.JOBS[idx].name = value;
        console.log(`職業[${idx}]名を更新: ${value}`);
    }
    
    updateJobDesc(idx, value) {
        GUILD_CONSTANTS.JOBS[idx].description = value;
        console.log(`職業[${idx}]説明を更新: ${value}`);
    }
    
    updatePersonalityName(idx, value) {
        GUILD_CONSTANTS.PERSONALITIES[idx].name = value;
        console.log(`個性[${idx}]名を更新: ${value}`);
    }
    
    updatePersonalityDesc(idx, value) {
        GUILD_CONSTANTS.PERSONALITIES[idx].description = value;
        console.log(`個性[${idx}]説明を更新: ${value}`);
    }
    
    updateTacticName(idx, value) {
        GUILD_CONSTANTS.TACTICS[idx].name = value;
        console.log(`戦術[${idx}]名を更新: ${value}`);
    }
    
    updateTacticDesc(idx, value) {
        GUILD_CONSTANTS.TACTICS[idx].description = value;
        console.log(`戦術[${idx}]説明を更新: ${value}`);
    }
    
    updateSkillName(skillId, value) {
        if (SKILL_MASTER_DATA[skillId]) {
            SKILL_MASTER_DATA[skillId].name = value;
            console.log(`スキル[${skillId}]名を更新: ${value}`);
        }
    }
    
    updateSkillDesc(skillId, value) {
        if (SKILL_MASTER_DATA[skillId]) {
            SKILL_MASTER_DATA[skillId].description = value;
            console.log(`スキル[${skillId}]説明を更新: ${value}`);
        }
    }
    
    updateEquipmentName(equipId, value) {
        if (EQUIPMENT_MASTER_DATA[equipId]) {
            EQUIPMENT_MASTER_DATA[equipId].name = value;
            console.log(`装備[${equipId}]名を更新: ${value}`);
        }
    }
    
    updateEquipmentDesc(equipId, value) {
        if (EQUIPMENT_MASTER_DATA[equipId]) {
            EQUIPMENT_MASTER_DATA[equipId].description = value;
            console.log(`装備[${equipId}]説明を更新: ${value}`);
        }
    }
    
    /**
     * 詳細編集用のダイアログ表示（実装例）
     */
    editRaceStats(raceId) {
        const mods = RACE_BASE_STAT_MODIFIERS[raceId];
        alert(`種族「${raceId}」の基礎値補正:\n${JSON.stringify(mods, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editRaceGrowth(raceId) {
        const growth = RACE_GROWTH_CURVES[raceId];
        alert(`種族「${raceId}」の成長曲線:\n${JSON.stringify(growth.growthPerLevel, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editJobStats(jobId) {
        const mods = JOB_BASE_STAT_MODIFIERS[jobId];
        alert(`職業「${jobId}」の基礎値補正:\n${JSON.stringify(mods, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editPersonalityStats(personalityId) {
        const mods = PERSONALITY_BASE_STAT_MODIFIERS[personalityId];
        alert(`個性「${personalityId}」の基礎値補正:\n${JSON.stringify(mods, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editTacticRates(tacticId) {
        const tactic = GUILD_CONSTANTS.TACTICS.find(t => t.id === tacticId);
        alert(`戦術「${tacticId}」の行動設定:\n${JSON.stringify({
            physicalRate: tactic.physicalRate,
            magicRate: tactic.magicRate,
            breathRate: tactic.breathRate,
            attackRate: tactic.attackRate,
            defenseRate: tactic.defenseRate,
            supportRate: tactic.supportRate
        }, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editSkillEffect(skillId) {
        const skill = SKILL_MASTER_DATA[skillId];
        alert(`スキル「${skillId}」の効果:\n${JSON.stringify(skill.effect, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editEquipmentBaseStats(equipId) {
        const equip = EQUIPMENT_MASTER_DATA[equipId];
        alert(`装備「${equipId}」の基礎値補正:\n${JSON.stringify(equip.baseStatMods, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    editEquipmentBattleStats(equipId) {
        const equip = EQUIPMENT_MASTER_DATA[equipId];
        alert(`装備「${equipId}」の戦力値補正:\n${JSON.stringify(equip.battleStatMods, null, 2)}\n\n（詳細編集機能は後の実装）`);
    }
    
    /**
     * 詳細情報表示
     */
    showTacticDetail(tacticId) {
        const tactic = GUILD_CONSTANTS.TACTICS.find(t => t.id === tacticId);
        alert(`【${tactic.name}】\n${tactic.description}\n\n物理: ${(tactic.physicalRate * 100).toFixed(1)}%\n魔法: ${(tactic.magicRate * 100).toFixed(1)}%\nブレス: ${(tactic.breathRate * 100).toFixed(1)}%`);
    }
    
    showSkillDetail(skillId) {
        const skill = SKILL_MASTER_DATA[skillId];
        alert(`【${skill.name}】\n${skill.description}\n\nトリガー: ${skill.trigger}\nタイプ: ${skill.type}`);
    }
    
    showEquipmentDetail(equipId) {
        const equip = EQUIPMENT_MASTER_DATA[equipId];
        const desc = equip.getFullDescription ? equip.getFullDescription() : `【${equip.name}】${equip.description}`;
        alert(desc);
    }
}

// グローバルインスタンス
const masterDataManager = new MasterDataManager();
