document.addEventListener("DOMContentLoaded", fetchStories);

const API_URL = "https://script.google.com/macros/s/AKfycbw3c-nDajMqRibcPQTWtk0yy80JX3gbAOJ5oSI1W11E7Qcg4ZsZZC87Qg8cpyfWDtICyQ/exec";


const STORIES_PER_PAGE = 5;
const PREVIEW_LINES = 10;

let stories = [];
let currentPage = 1;

// 🔹 小噺一覧を取得して表示
function fetchStories() {
    console.log("📢 データ取得を開始...");
    fetch(`${API_URL}?action=get`, { mode: "cors" })
    .then(response => response.json())
    .then(data => {
        console.log("✅ レスポンス受信:", data);
        stories = data;
        displayStories();
    })
    .catch(error => {
        console.error("❌ データ取得エラー:", error);
    });
}

// 🔹 取得したデータを HTML に表示
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

// 🔹 小噺の HTML 要素を作成
function createStoryElement(story) {
    const storyDiv = document.createElement("div");
    storyDiv.classList.add("story");

    const storyLines = story.body.split("\n");
    const previewText = storyLines.slice(0, PREVIEW_LINES).join("<br>");

    storyDiv.innerHTML = `
        <h2>${story.title}</h2>
        <p>${previewText}${storyLines.length > PREVIEW_LINES ? "..." : ""}</p>
        ${storyLines.length > PREVIEW_LINES ? `<a href="detail.html?title=${encodeURIComponent(story.title)}">続きを読む</a>` : ""}
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
        <button class="profile-btn" onclick="showProfile('${story.author}', '${story.profile}')">👤 作者プロフィールを見る</button>
    `;

    return storyDiv;
}

// 🔹 いいねボタンを押したときの処理
function likeStory(title) {
    console.log(`👍 いいねボタンが押されました: ${title}`);

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", title }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("✅ いいね更新成功", data);
            document.getElementById(`likes-${title}`).innerText = data.likes;
        } else {
            console.error("❌ いいね更新失敗:", data.error);
        }
    })
    .catch(error => {
        console.error("❌ いいね送信エラー:", error);
    });
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




