document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbzKiwxtMNfSz_LGRJGrReXlTHsmLfUqlEKquH3mEVXbyfQ6KUdzZYqo2k2fs0aunZFSWQ/exec";

// 🔹 URLからタイトルを取得
function getStoryTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("title");
}

// 🔹 小噺の詳細データを取得
function fetchStoryDetail() {
    const title = getStoryTitleFromURL();
    if (!title) {
        console.error("❌ タイトルが指定されていません");
        return;
    }

    console.log(`📢 データ取得開始: ${title}`);
    fetch(`${API_URL}?action=get`)
    .then(response => response.json())
    .then(data => {
        const story = data.find(s => s.title === title);
        if (story) {
            displayStory(story);
        } else {
            console.error("❌ 該当する小噺が見つかりません");
        }
    })
    .catch(error => {
        console.error("❌ データ取得エラー:", error);
    });
}

// 🔹 小噺の詳細を表示（改行も反映）
function displayStory(story) {
    const container = document.getElementById("story-container");
    container.innerHTML = `
        <h2>${story.title}</h2>
        <p>${story.body.replace(/\n/g, "<br>")}</p>
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
        <button class="profile-btn" onclick="showProfile('${story.author}', '${story.profile}')">👤 作者プロフィールを見る</button>
    `;
}

// 🔹 いいねボタンを押したときの処理（スプレッドシートに反映）
function likeStory(title) {
    console.log(`👍 いいねボタンが押されました: ${title}`);

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    })
    .then(response => {
        console.log("🔄 いいね送信完了", response);
        return response.json();
    })
    .then(data => {
        console.log("✅ いいね更新成功", data);
        if (data.success) {
            alert(`「${title}」のいいねが ${data.likes} に増えました！`);
            updateLikeCount(title, data.likes);
        } else {
            console.error("❌ いいね更新失敗:", data.error);
        }
    })
    .catch(error => {
        console.error("❌ いいね送信エラー:", error);
    });
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

// 🔹 プロフィールモーダルを表示
function showProfile(author, profile) {
    const modal = document.getElementById("profile-modal");
    const profileTitle = document.getElementById("profile-title");
    const profileText = document.getElementById("profile-text");

    profileTitle.innerText = `作者: ${author}`;
    profileText.innerText = profile;

    modal.style.display = "block";

    // ✅ モーダルを閉じる処理
    document.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // ✅ モーダル外をクリックして閉じる
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}
