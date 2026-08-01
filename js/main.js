// ========================================
// ゲーム管理システム
// ========================================

/**
 * ページ遷移処理
 */
function switchPage(pageName) {
    // タイトル画面を非表示
    const titleScreen = document.getElementById('title-screen');
    titleScreen.classList.remove('active');

    // コンテンツエリアを表示
    const contentArea = document.getElementById('content-area');
    contentArea.classList.add('active');

    // すべてのページコンテンツを非表示
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    // 選択されたページを表示
    const selectedPage = document.getElementById(`page-${pageName}`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // ギルドページの場合、UIを初期化
        if (pageName === 'guild') {
            guildUI.init().then(() => {
                guildUI.switchGuildView('composition');
            }).catch(err => console.error('ギルドUI初期化エラー:', err));
        }
        
        // マスターデータページの場合
        if (pageName === 'special') {
            masterDataManager.switchView('races');
        }
    }
}

/**
 * タイトル画面に戻る関数
 */
function backToTitle() {
    // すべてのページコンテンツを非表示
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    // コンテンツエリアを非表示
    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('active');

    // タイトル画面を表示
    const titleScreen = document.getElementById('title-screen');
    titleScreen.classList.add('active');
}

/**
 * 初期化処理
 */
async function initGame() {
    console.log('🎮 ゲーム初期化中...');
    
    try {
        // ギルドデータベースを初期化
        await guildDB.init();
        
        // メニューボタンにイベントリスナーを追加
        const menuButtons = document.querySelectorAll('.menu-btn');
        menuButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pageName = this.getAttribute('data-page');
                if (pageName) switchPage(pageName);
            });
        });
        
        console.log('✅ ゲーム初期化完了');
    } catch (err) {
        console.error('❌ ゲーム初期化エラー:', err);
    }
}

// ========================================
// イベントリスナー設定
// ========================================

document.addEventListener('DOMContentLoaded', initGame);
