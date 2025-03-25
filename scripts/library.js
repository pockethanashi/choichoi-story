document.addEventListener("DOMContentLoaded", fetchStories);

const API_URL = "https://script.google.com/macros/s/AKfycbykUw1ZjKKTNyAd3_v0AG5ovIfL7dtpo7jG7GuAN3BFZ33mh6q6rrmfhq8I5MBLILpNvQ/exec";


const STORIES_PER_PAGE = 3; // 1ページあたりの最大表示数
const PREVIEW_LINES = 15; // トップページで表示する本文の行数

let stories = [];
let currentPage = 1;

// 🔹 小噺一覧を取得して表示
function fetchStories() {
    console.log("📢 データ取得を開始...");
    fetch(`${API_URL}?action=get`)
    .then(response => {
        if (!response.ok) throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("✅ レスポンス受信:", data);
        stories = data;
        displayStories();
    })
    .catch(error => {
        console.error("❌ データ取得エラー:", error);
    });
}

// 🔹 ページネーション対応の表示処理
function displayStories() {
    const container = document.getElementById("stories-container");
    if (!container) {
        console.error("⚠️ stories-container が見つかりません");
        return;
    }
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
    const endIndex = startIndex + STORIES_PER_PAGE;
    const storiesToDisplay = stories.slice(startIndex, endIndex);

    storiesToDisplay.forEach(story => {
        const storyElement = createStoryElement(story);
        container.appendChild(storyElement);
    });

    updatePagination();
}

// 🔹 小噺の HTML 要素を作成（PREVIEW_LINES に対応）
function createStoryElement(story) {
    const storyDiv = document.createElement("div");
    storyDiv.classList.add("story");

    // 🔸 改行を `<br>` に変換して表示し、指定行数だけ表示
    const storyLines = story.body.split("\n");
    const previewText = storyLines.slice(0, PREVIEW_LINES).join("<br>");

    storyDiv.innerHTML = `
        <h2>${story.title}</h2>
        <p>${previewText}${storyLines.length > PREVIEW_LINES ? "..." : ""}</p>
        ${storyLines.length > PREVIEW_LINES ? `<a href="detail.html?title=${encodeURIComponent(story.title)}">続きを読む</a>` : ""}
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
    `;

    return storyDiv;
}

// 🔹 いいねボタンを押したときの処理（スプレッドシートに反映）
// 🔹 いいねボタンを押したときの処理（スプレッドシートに反映）
function likeStory(title) {
    console.log(`👍 いいねボタンが押されました: ${title}`);

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // ← これがあるとレスポンス読めないが送信はできる
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title }) // ← タイトルだけでいいね処理と判定
    });

    // 🔸 レスポンスは取得できないので仮にアラートだけ表示
    alert(`「${title}」にいいねしました！（反映には少し時間がかかる場合があります）`);

    // ✅ 更新のため再読み込みする場合はこちら（任意）
    // location.reload();
}



// 🔹 いいね数を更新
function updateLikeCount(title, newLikes) {
    const likeElement = document.getElementById(`likes-${title}`);
    if (likeElement) {
        likeElement.innerText = newLikes;
    } else {
        console.error(`⚠️ いいね表示要素が見つかりませんでした: ${title}`);
    }
}

// 🔹 ページネーションの更新
function updatePagination() {
    const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);
    const pageNumberElem = document.getElementById("pageNumber");
    if (pageNumberElem) {
        pageNumberElem.innerText = `${currentPage} / ${totalPages}`;
    }

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// 🔹 前ページへ
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayStories();
    }
});

// 🔹 次ページへ
document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        displayStories();
    }
});
