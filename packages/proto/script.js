const submitBtn = document.getElementById("submit-btn");
const input = document.getElementById("password-input");
const content = document.getElementById("content");
const loginScreen = document.getElementById("lock-screen"); // note id change

const correctPassword = "open"; // Replace with your actual password

// Check if user already logged in
if (localStorage.getItem("authenticated") === "true") {
  loginScreen.style.display = "none";
  content.style.display = "block";
}

submitBtn.addEventListener("click", function () {
  if (input.value === correctPassword) {
    localStorage.setItem("authenticated", "true");
    loginScreen.style.display = "none";
    content.style.display = "block";
  } else {
    alert("Incorrect password.");
  }
});
