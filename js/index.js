const darkModeToggle = document.querySelector(".dark-mode-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  document.body.classList.add("dark");
}
 
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  
  let theme = "light";
  if (document.body.classList.contains("dark")) {
    theme = "dark";
  }

  localStorage.setItem("theme", theme);
});
