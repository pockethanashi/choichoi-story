document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbxUWNr-kxxpN8n_LBpu9UKeSspYmdwQgyQnnrYBrxsgEtEXZbl1xr5F3Y0fTZI3v0Hylg/exec";


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
    `;
}

// 🔹 いいねボタンを押したときの処理
function likeStory(title) {
    console.log(`👍 いいねボタンが押されました: ${title}`);

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // ✅ CORS対策
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    })
    .then((response) => {
        console.log("🔄 いいね送信完了", response);
        return response.json();
    })
    .then((data) => {
        console.log("✅ いいね更新成功", data);
        if (data.success) {
            alert(`「${title}」のいいねが ${data.likes} に増えました！`);
        } else {
            console.error("❌ いいね更新失敗:", data.error);
        }
    })
    .catch((error) => {
        console.error("❌ いいね送信エラー:", error);
    });
}
