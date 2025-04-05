const CONTACT_API = "https://script.google.com/macros/s/AKfycbzbtOOxFjTFLSqFqXFlk4cRImpM4ZUUmi38dqBIc9M0R3sFyGM9fdXNgvVcNOkVDjL1gw/exec";

// contact.js
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contact-submit").addEventListener("click", function () {
    const name = encodeURIComponent(document.getElementById("name").value.trim());
    const email = encodeURIComponent(document.getElementById("email").value.trim());
    const message = encodeURIComponent(document.getElementById("message").value.trim());

    if (!message) {
      alert("お問い合わせ内容は必須です。");
      return;
    }

    const url = `confirm-contact.html?name=${name}&email=${email}&message=${message}`;
    window.location.href = url;
  });
});
