document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fields = ["name", "email", "message"];

  // 表示とhiddenの両方に反映
  fields.forEach(id => {
    const value = urlParams.get(id) || "";
    const displayElem = document.getElementById(`confirm-${id}`);
    const hiddenElem = document.getElementById(`hidden-${id}`);
    if (displayElem) displayElem.textContent = value;
    if (hiddenElem) hiddenElem.value = value;
  });

  // 送信ボタン処理
  document.getElementById("send-btn").addEventListener("click", () => {
    const name = document.getElementById("hidden-name").value;
    const email = document.getElementById("hidden-email").value;
    const message = document.getElementById("hidden-message").value;
    const resultMessage = document.getElementById("result-message");

    fetch("https://script.google.com/macros/s/AKfycbzbtOOxFjTFLSqFqXFlk4cRImpM4ZUUmi38dqBIc9M0R3sFyGM9fdXNgvVcNOkVDjL1gw/exec", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "contact", name, email, message })
    })
    .then(() => {
      resultMessage.textContent = "送信しました。ありがとうございました！";
      resultMessage.style.color = "green";
    })
    .catch(() => {
      resultMessage.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
      resultMessage.style.color = "red";
    });
  });

  // 戻るリンク再構築
  const backLink = document.getElementById("back-link");
  const backParams = fields.map(key => {
    const val = urlParams.get(key) || "";
    return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
  });
  backLink.href = `contact.html?${backParams.join("&")}`;
});
