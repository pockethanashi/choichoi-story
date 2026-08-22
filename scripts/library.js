document.addEventListener("DOMContentLoaded", () => {
    fetchStories(); 
});

const API_URL = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";

const STORIES_PER_PAGE = 5;
const PREVIEW_LINES = 15;

let stories = [];
let currentPage = getPageFromURL();
let currentAuthor = getAuthorFromURL();


function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
}

function getAuthorFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("author") || null;
}



// 🔹 データ取得
function fetchStories() {
    fetch(`${API_URL}?action=get`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            return response.json();
        })
        .then(data => {
            stories = getLatestStories(data);
            displayStories(currentAuthor);
            populateAuthorSidebar();
            populateAuthorDropdown();
            populateStoryTitleList();
        })
        .catch(error => console.error("❌ データ取得エラー:", error));
}

// 🔹 最新バージョンのみ抽出（同日ならバージョン番号が高い方）
function getLatestStories(allStories) {
    const latestMap = new Map();

    allStories.forEach(story => {
        const key = story.title;
        const newDate = new Date(story.updateDate || "1900-01-01");
        const newVersion = parseFloat(story.version || "0");

        const current = latestMap.get(key);
        if (!current) {
            latestMap.set(key, story);
            return;
        }

        const currentDate = new Date(current.updateDate || "1900-01-01");
        const currentVersion = parseFloat(current.version || "0");

        if (newDate > currentDate || (newDate.getTime() === currentDate.getTime() && newVersion > currentVersion)) {
            latestMap.set(key, story);
        }
    });

    return Array.from(latestMap.values());
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

// 🔹 HTML生成
function createStoryElement(story) {
    const storyDiv = document.createElement("div");
    storyDiv.classList.add("story");

    const storyLines = story.body.split("\n");
    const previewText = storyLines.slice(0, PREVIEW_LINES).join("<br>");

    storyDiv.innerHTML = `
        <h2>${story.title}</h2>
        <p>${previewText}${storyLines.length > PREVIEW_LINES ? "..." : ""}</p>
        ${storyLines.length > PREVIEW_LINES ? `
        <div class="read-links">
          <a class="read-link" href="detail.html?id=${encodeURIComponent(story.originalId)}">横書きで読む</a>
          <a class="read-link vertical-read-link" href="detail-vertical.html?id=${encodeURIComponent(story.originalId)}">縦書きで読む</a>
        </div>` : ""}
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>作者:</strong> ${story.author}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
    `;
    return storyDiv;
}

// 🔹 小噺タイトル一覧（更新日の新しい順に最大12件）
function populateStoryTitleList() {
    const list = document.getElementById("story-title-list");
    if (!list) return;

    const sortedStories = [...stories].sort((a, b) => {
        const dateA = new Date(a.updateDate || "1900-01-01");
        const dateB = new Date(b.updateDate || "1900-01-01");
        return dateB - dateA;
    });

    list.innerHTML = "";
    sortedStories.slice(0, 12).forEach(story => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `detail-vertical.html?id=${encodeURIComponent(story.originalId)}`;
        link.textContent = story.title;
        li.appendChild(link);
        list.appendChild(li);
    });
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

// 🔹 ページネーション
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / STORIES_PER_PAGE);
    const pageNumberElem = document.getElementById("pageNumber");
    if (pageNumberElem) pageNumberElem.innerText = `${currentPage} / ${totalPages}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    redirectToPage(currentPage - 1);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredStories().length / STORIES_PER_PAGE);
  if (currentPage < totalPages) {
    redirectToPage(currentPage + 1);
  }
});


function redirectToPage(page, author = currentAuthor) {
  const params = new URLSearchParams();
  if (author) params.set("author", author);
  params.set("page", page);
  window.location.href = `index.html?${params.toString()}`;
}


// 🔹 作者一覧（サイドバー）
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
          redirectToPage(1, author); // ← URLに反映
        });
        li.appendChild(link);
        authorList.appendChild(li);
    });

    const allLink = document.createElement("a");
    allLink.href = "#";
    allLink.textContent = "すべて表示";
    allLink.addEventListener("click", () => {
      currentPage = 1;
      currentAuthor = null;
      redirectToPage(1, null); // ← すべてに戻る
    });
    const allItem = document.createElement("li");
    allItem.appendChild(allLink);
    authorList.prepend(allItem);
}

// 🔹 スマホ用プルダウン
function populateAuthorDropdown() {
    const dropdown = document.getElementById("author-select");
    if (!dropdown) return;

    const authors = [...new Set(stories.map(s => s.author).filter(a => a))];
    dropdown.innerHTML = '<option value="">すべての作者</option>';

    authors.forEach(author => {
        const option = document.createElement("option");
        option.value = author;
        option.textContent = author;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", () => {
      const selectedAuthor = dropdown.value || null;
      currentAuthor = selectedAuthor;
      currentPage = 1;
      redirectToPage(1, selectedAuthor);
    });
    
    if (currentAuthor) {
      dropdown.value = currentAuthor;
    }
}

// 🔹 現在の絞り込み状態に応じた一覧
function filteredStories() {
    return currentAuthor ? stories.filter(s => s.author === currentAuthor) : stories;
}



/*いいねボタン追加するとき用
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>  
        storyDiv.innerHTML　に追加

 */
 
