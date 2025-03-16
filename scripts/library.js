document.addEventListener("DOMContentLoaded", fetchStories);

const API_URL = "https://script.google.com/macros/s/AKfycbxUWNr-kxxpN8n_LBpu9UKeSspYmdwQgyQnnrYBrxsgEtEXZbl1xr5F3Y0fTZI3v0Hylg/exec";


// 🔹 小噺一覧を取得して表示
function fetchStories() {
    console.log("📢 データ取得を開始...");
    fetch(`${API_URL}?action=get`)
    .then(response => response.json())
    .then(data => {
        console.log("✅ レスポンス受信:", data);
        displayStories(data);
    })
    .catch(error => {
        console.error("❌ データ取得エラー:", error);
    });
}

// 🔹 取得したデータを HTML に表示
function displayStories(stories) {
    const container = document.getElementById("stories-container");
    container.innerHTML = "";  // 一旦クリア

    stories.forEach(story => {
        const storyElement = createStoryElement(story);
        container.appendChild(storyElement);
    });
}

// 🔹 小噺の HTML 要素を作成
function createStoryElement(story) {
    const storyDiv = document.createElement("div");
    storyDiv.classList.add("story");

    storyDiv.innerHTML = `
        <h2>${story.title}</h2>
        <p>${story.body}</p>
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
    `;

    return storyDiv;
}

// 🔹 いいねボタンを押したときの処理
function likeStory(title) {
  console.log(`👍 いいねボタンが押されました: ${title}`);

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", // ✅ 追加
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })
    .then((response) => {
      console.log("🔄 いいね送信完了", response);
      return response.json(); // 🚨 `no-cors` ではレスポンスを取得できない可能性あり
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

// 🔹 いいね数を更新
function updateLikeCount(title, newLikes) {
    const likeElement = document.getElementById(`likes-${title}`);
    if (likeElement) {
        likeElement.innerText = newLikes;
    } else {
        console.error(`⚠️ いいね表示要素が見つかりませんでした: ${title}`);
    }
}

