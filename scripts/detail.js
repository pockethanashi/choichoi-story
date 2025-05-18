document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";

let allVersions = []; // 同じoriginalIdを持つバージョン違いを格納

// 🔹 URLからid（originalId）を取得
function getStoryIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function fetchStoryDetail() {
    const originalId = getStoryIdFromURL();
    if (!originalId) {
        console.error("❌ 作品IDが指定されていません");
        return;
    }

    fetch(`${API_URL}?action=get`)
        .then(response => response.json())
        .then(data => {
            // originalId が一致するすべてのバージョンを抽出
            allVersions = data.filter(s => s.originalId === originalId);

            if (allVersions.length === 0) {
                console.error("❌ 該当する作品が見つかりません");
                return;
            }

            // 🔽 バージョンの新しさでソート（更新日＆バージョン番号）
            allVersions.sort((a, b) => {
                const dateA = new Date(a.updateDate || "1900-01-01");
                const dateB = new Date(b.updateDate || "1900-01-01");
                const versionA = parseFloat(a.version || "0");
                const versionB = parseFloat(b.version || "0");

                if (dateA < dateB) return 1;
                if (dateA > dateB) return -1;
                return versionB - versionA;
            });

            populateVersionSelector();
            displayStory(allVersions[0]); // 最新バージョンを表示
        })
        .catch(error => console.error("❌ データ取得エラー:", error));
}

function populateVersionSelector() {
    const select = document.getElementById("version-select");
    if (!select) return;

    select.innerHTML = "";

    allVersions.forEach((story, index) => {
        const option = document.createElement("option");
        option.value = index;

        const versionLabel = story.version ? `v${story.version}` : "バージョンなし";
        const memo = story.updateMemo || "メモなし";

        option.textContent = `${versionLabel}（${memo}）`;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        const selected = parseInt(e.target.value);
        displayStory(allVersions[selected]);
    });
}

function displayStory(story) {
  document.getElementById("story-title").textContent = story.title;
  document.getElementById("story-genre").textContent = story.genre;
  document.getElementById("story-author").textContent = story.author || "不明";
  document.getElementById("story-likes").textContent = story.likes;
  document.getElementById("story-version").textContent = story.version || "なし";
  document.getElementById("story-updateDate").textContent = story.updateDate || "不明";
  document.getElementById("story-updateMemo").textContent = story.updateMemo || "なし";
  document.getElementById("story-originalAuthor").textContent =
    findOriginalAuthor(allVersions, story.originalId);
    
 

  document.title = `${story.title} `;

  // 🔸 差分ハイライト処理
  const currentBody = story.body || "";
  const currentIndex = allVersions.findIndex(s => s.version === story.version);
  const previousBody = currentIndex < allVersions.length - 1
    ? allVersions[currentIndex + 1].body || ""
    : currentBody;

  const diffHtml = highlightDiff(previousBody, currentBody);
  document.getElementById("story-body").innerHTML = diffHtml;
//  document.getElementById("story-body").innerHTML = story.body.replace(/\n/g, "<br>");


  // 🔸 プロフィールボタンのイベント設定
  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn) {
    profileBtn.onclick = () => showProfile(story.author, story.profile);
  }

  // 🔸 「いいね」ボタンの挙動
  const likeButton = document.querySelector("button[onclick^='likeStory']");
  if (likeButton) {
    likeButton.onclick = () => likeStory(story.originalId, story.version);
  }
}



function likeStory(originalId, version) {
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalId, version })
  });
  alert(`このバージョン（ID: ${originalId}, v${version}）にいいねしました！`);
}


function showProfile(author, profile) {
    const modal = document.getElementById("profile-modal");
    const profileTitle = document.getElementById("profile-title");
    const profileText = document.getElementById("profile-text");

    profileTitle.innerText = `作者: ${author}`;
    profileText.innerText = profile;

    modal.style.display = "block";

    document.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}


function findOriginalAuthor(data, originalId) {
  const normalizedId = (originalId || "").trim().toLowerCase();

  // originalId が一致する候補をすべて取得
  const candidates = data.filter(s =>
    (s.originalId || "").trim().toLowerCase() === normalizedId
  );

  if (candidates.length === 0) return "不明";

  // 更新日→バージョン番号の順に昇順ソート（最初の作者がオリジナルとみなす）
  candidates.sort((a, b) => {
    const dateA = new Date(a.updateDate || "9999-12-31");
    const dateB = new Date(b.updateDate || "9999-12-31");
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    const verA = parseFloat(a.version || "0");
    const verB = parseFloat(b.version || "0");
    return verA - verB;
  });

  return candidates[0].author || "不明";
}



function highlightDiff(oldText, newText) {
  const diff = Diff.diffWordsWithSpace(oldText, newText);

  return diff.map(part => {
    const valueWithBr = part.value.replace(/\n/g, "<br>");
    if (part.added) {
      return `<span class="diff-added">${valueWithBr}</span>`;
    } else if (part.removed) {
      return ""; // ← 削除部分は表示しない
    } else {
      return valueWithBr;
    }
  }).join('');
}


//新機能
// URLのクエリパラメータから storyId を取得して data-story-id にセット
(function injectStoryId() {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get('id');
  if (storyId) {
    let el = document.querySelector('[data-story-id]');
    if (!el) {
      el = document.createElement('div');
      el.style.display = 'none';
      el.setAttribute('data-story-id', storyId);
      document.body.prepend(el);
    } else {
      el.setAttribute('data-story-id', storyId);
    }
  }
})();


// 感情ログボタンの href を更新する処理
(function updateLogButtonHref() {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get('id');
  if (storyId) {
    const logLink = document.querySelector('.log-button');
    if (logLink) {
      logLink.href = `reading-log.html?id=${encodeURIComponent(storyId)}`;
    }
  }
})();


// ログを取得して表示する
(function renderStoryLogs() {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get('id');
  if (!storyId) return;
  const key = `storyLog_${storyId}`;
  const logs = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById('logItems');
  if (!container) return;
  container.innerHTML = '';

  logs.forEach((log, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '0.5em';
    div.innerHTML = `
      <strong>${log.emotion}</strong> ${log.comment} <span style="color:#666;">(${log.date})</span>
    `;
    container.appendChild(div);
  });
})();

function deleteLog(index) {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get('id');
  if (!storyId) return;
  const key = `storyLog_${storyId}`;
  let logs = JSON.parse(localStorage.getItem(key)) || [];
  logs.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(logs));
  location.reload();
}




