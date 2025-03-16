document.addEventListener("DOMContentLoaded", fetchStories);

const API_URL = "https://script.google.com/macros/s/AKfycbyulAkkCtRCDoihyMtEeA47tW_UNUps5-Kv4Zs-0ybRPAvDh1HorIn1PbwUoBDGbRxO4A/exec";


const STORIES_PER_PAGE = 5; // 1ページあたりの最大表示数
const PREVIEW_LINES = 5; // トップページで表示する本文の行数

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

// 🔹 小噺の HTML 要素を作成（本文のプレビュー機能あり）
function createStoryElement(story) {
    const storyDiv = document.createElement("div");
    storyDiv.classList.add("story");

    // 🔸 改行を `<br>` に変換して表示
    const storyLines = story.body.split("\n").map(line => line.trim() ? line : "<br>"); // 空行も反映
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

