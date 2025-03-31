//const API_URL = "https://script.google.com/macros/s/AKfycbySmKN_CVGf7pOD6QPfSJ1qLQvpA5GBBsRMyrpxQIpy-elMUmkGVBjM2z_ZKTeUwrd2Xg/exec?action=post";
const API_URL = "https://script.google.com/macros/s/AKfycbyd1K0W3VLk2hzDot0NEOs3VSxZzuE6fiy9AhmwckesAHvTCLXi1pVeO3zOzFjDa143jw/exec";

document.getElementById("confirm-btn").addEventListener("click", function () {
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const genre = document.getElementById("genre").value;
    const author = document.getElementById("author").value.trim();
    const profile = document.getElementById("profile").value.trim();

    // ✅ バージョン管理項目を取得
    const version = document.getElementById("version").value.trim();
    const updateDate = document.getElementById("updateDate").value;
    const originalId = document.getElementById("originalId").value.trim();
    const updateMemo = document.getElementById("updateMemo").value.trim();

    if (!title || !body || !author) {
        alert("タイトル、本文、作者名は必須です。");
        return;
    }

    const params = new URLSearchParams({
        title,
        body,
        genre,
        author,
        profile,
        version,
        updateDate,
        originalId,
        updateMemo
    });

    window.location.href = `confirm.html?${params.toString()}`;
});


