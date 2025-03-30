document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbyy2QS8TdacrRRtVRzl1MGg6CMRQNQILrYh-spuDTM2H-9GrtWjiuEnk6f-RpHldsnUqw/exec";

let allVersions = []; // バージョンごとの小噺を格納

function getStoryTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("title");
}

function fetchStoryDetail() {
    const title = getStoryTitleFromURL();
    if (!title) {
        console.error("❌ タイトルが指定されていません");
        return;
    }

    fetch(`${API_URL}?action=get`)
        .then(response => response.json())
        .then(data => {
            allVersions = data.filter(s => s.title === title);
            if (allVersions.length === 0) {
                console.error("❌ 該当する小噺が見つかりません");
                return;
            }
            populateVersionSelector();
            displayStory(allVersions[0]); // 最新（最初）のバージョンを表示
        })
        .catch(error => console.error("❌ データ取得エラー:", error));
}

function populateVersionSelector() {
    const select = document.getElementById("version-select");
    if (!select) return;

    select.innerHTML = ""; // 既存の選択肢をクリア

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

    // プロフィールボタンの動作（任意）
    const profileBtn = document.querySelector(".profile-btn");
    if (profileBtn) {
        profileBtn.onclick = () => showProfile(story.author, story.profile);
    }
}


function likeStory(title) {
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });
    alert(`「${title}」にいいねしました！（反映には少し時間がかかる場合があります）`);
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
