document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbyd1K0W3VLk2hzDot0NEOs3VSxZzuE6fiy9AhmwckesAHvTCLXi1pVeO3zOzFjDa143jw/exec";

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
  document.getElementById("story-body").innerHTML = story.body.replace(/\n/g, "<br>");
  document.getElementById("story-genre").textContent = story.genre;
  document.getElementById("story-author").textContent = story.author || "不明";
  document.getElementById("story-likes").textContent = story.likes;
  document.getElementById("story-version").textContent = story.version || "なし";
  document.getElementById("story-updateDate").textContent = story.updateDate || "不明";
  document.getElementById("story-updateMemo").textContent = story.updateMemo || "なし";

  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn) {
    profileBtn.onclick = () => showProfile(story.author, story.profile);
  }

  // 🔹 「いいね」ボタンの挙動を設定
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
