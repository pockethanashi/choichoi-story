document.getElementById("submit-btn").addEventListener("click", function () {
    const title = document.getElementById("confirm-title").textContent;
    const body = document.getElementById("confirm-body").innerText;
    const genre = document.getElementById("confirm-genre").textContent;
    const author = document.getElementById("confirm-author").textContent;
    const profile = document.getElementById("confirm-profile").innerText;

    // ✅ バージョン管理関連の取得（hidden要素 or innerText から）
    const version = document.getElementById("confirm-version").textContent;
    const updateDate = document.getElementById("confirm-updateDate").textContent;
    const originalId = document.getElementById("confirm-originalId").textContent;
    const updateMemo = document.getElementById("confirm-updateMemo").textContent;

    const postData = {
        action: "post",
        title,
        body,
        genre,
        author,
        profile,
        version,
        updateDate,
        originalId,
        updateMemo
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";
    
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // ← CORS制限があるのでレスポンスは読めない
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });

    alert("✅ 投稿処理が完了しました");
    window.location.href = "index.html";
});


// ✅ URLパラメータから値を取得して表示
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const title = decodeURIComponent(params.get("title") || "");
    const body = decodeURIComponent(params.get("body") || "");
    const genre = decodeURIComponent(params.get("genre") || "");
    const author = decodeURIComponent(params.get("author") || "");
    const profile = decodeURIComponent(params.get("profile") || "");

    const version = decodeURIComponent(params.get("version") || "");
    const updateDate = decodeURIComponent(params.get("updateDate") || "");
    const originalId = decodeURIComponent(params.get("originalId") || "");
    const updateMemo = decodeURIComponent(params.get("updateMemo") || "");

    // 表示用エレメントに反映
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-body").innerHTML = body.replace(/\n/g, "<br>");
    document.getElementById("confirm-genre").textContent = genre;
    document.getElementById("confirm-author").textContent = author;
    document.getElementById("confirm-profile").innerHTML = profile.replace(/\n/g, "<br>");

    // ✅ バージョン情報の表示要素があれば反映（なければ追加）
    document.getElementById("confirm-version").textContent = version;
    document.getElementById("confirm-updateDate").textContent = updateDate;
    document.getElementById("confirm-originalId").textContent = originalId;
    document.getElementById("confirm-updateMemo").textContent = updateMemo;
});
