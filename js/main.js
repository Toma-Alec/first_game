// ========================================
// ゲーム管理システム
// ========================================

// ページ切り替え関数
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
    }
}

// タイトル画面に戻る関数
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

// ========================================
// イベントリスナー設定
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // メニューボタンにクリックイベントを追加
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            switchPage(pageName);
        });
    });

    console.log('🎮 Guild - ゲーム初期化完了');
});
