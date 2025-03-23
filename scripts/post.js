//const API_URL = "https://script.google.com/macros/s/AKfycbySmKN_CVGf7pOD6QPfSJ1qLQvpA5GBBsRMyrpxQIpy-elMUmkGVBjM2z_ZKTeUwrd2Xg/exec?action=post";
const API_URL = "https://script.google.com/macros/s/AKfycbzs3eTsfF7uFUN31Ag5sf71vR_ZIAN2b9JWvKaxp9byHbJLnQHumzPktrnvUZml9WAWRw/exec";

document.getElementById("confirm-btn").addEventListener("click", function () {
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const genre = document.getElementById("genre").value;
    const author = document.getElementById("author").value.trim();
    const profile = document.getElementById("profile").value.trim();

    if (!title || !body || !author) {
        alert("タイトル、本文、作者名は必須です。");
        return;
    }

    // URLにデータをエンコードして渡す
    const params = new URLSearchParams({
        title: encodeURIComponent(title),
        body: encodeURIComponent(body),
        genre: encodeURIComponent(genre),
        author: encodeURIComponent(author),
        profile: encodeURIComponent(profile),
    });

    window.location.href = `confirm.html?${params.toString()}`;
});



