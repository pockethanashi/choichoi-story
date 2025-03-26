document.addEventListener("DOMContentLoaded", () => {
    fetchStories();
});

const API_URL = "https://script.google.com/macros/s/AKfycbzXzLXCNZ8Qp0LF9wm2mgDOlya909e2yoDzgmYNZodAblw8d6ESiRnDPx8586FLfJjlvg/exec";

const STORIES_PER_PAGE = 3;
const PREVIEW_LINES = 15;

let stories = [];
let currentPage = 1;

// 🔹 小噺一覧を取得して表示
function fetchStories() {
    fetch(`${API_URL}?action=get`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            return response.json();
        })
        .then(data => {
            stories = data;
            displayStories();
            populateAuthorSidebar(); // ✅ サイドバーの作者一覧表示
        })
        .catch(error => console.error("❌ データ取得エラー:", error));
}

// 🔹 表示処理
function displayStories(filterAuthor = null) {
    const container = document.getElementById("stories-container");
    if (!container) return;
    container.innerHTML = "";

    const filtered = filterAuthor
        ? stories.filter(story => story.author === filterAuthor)
        : stories;

    const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
    const endIndex = startIndex + STORIES_PER_PAGE;
    const storiesToDisplay = filtered.slice(startIndex, endIndex);

    storiesToDisplay.forEach(story => {
        const storyElement = createStoryElement(story);
        container.appendChild(storyElement);
    });

    updatePagination(filtered.length);
}

// 🔹 HTML要素生成
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
        <p><strong>作者:</strong> ${story.author}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
    `;
    return storyDiv;
}

// 🔹 いいね処理
function likeStory(title) {
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });
    alert(`「${title}」にいいねしました！（反映には少し時間がかかる場合があります）`);
}

// 🔹 ページネーション更新
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / STORIES_PER_PAGE);
    const pageNumberElem = document.getElementById("pageNumber");
    if (pageNumberElem) pageNumberElem.innerText = `${currentPage} / ${totalPages}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayStories(currentAuthor); // ✅ フィルター保持
    }
});
document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredStories().length / STORIES_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        displayStories(currentAuthor); // ✅ フィルター保持
    }
});

// 🔹 作者一覧をサイドバーに表示
let currentAuthor = null;
function populateAuthorSidebar() {
    const authorList = document.getElementById("author-list");
    const authors = [...new Set(stories.map(s => s.author).filter(a => a))];

    authorList.innerHTML = "";
    authors.forEach(author => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = author;
        link.addEventListener("click", () => {
            currentPage = 1;
            currentAuthor = author;
            displayStories(author);
        });
        li.appendChild(link);
        authorList.appendChild(li);
    });

    // 🔸 全件表示リンクも追加
    const allLink = document.createElement("a");
    allLink.href = "#";
    allLink.textContent = "すべて表示";
    allLink.addEventListener("click", () => {
        currentPage = 1;
        currentAuthor = null;
        displayStories();
    });
    const allItem = document.createElement("li");
    allItem.appendChild(allLink);
    authorList.prepend(allItem);
}

// 🔹 現在のフィルターに応じたデータ取得
function filteredStories() {
    return currentAuthor ? stories.filter(s => s.author === currentAuthor) : stories;
}
