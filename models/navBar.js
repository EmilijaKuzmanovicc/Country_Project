export function drawNavbar(host) {

   const navbar = document.createElement("nav");
  navbar.className = "navbar ";
  host.appendChild(navbar);


  const headLine = document.createElement("div");
  headLine.innerHTML = "Where in the world?";
  headLine.style.fontWeight = "bold";
  headLine.style.fontSize = "20px";
  headLine.style.marginLeft="1rem";
  navbar.appendChild(headLine);

  const darkModeDiv = document.createElement("div");
  darkModeDiv.className = "darkModeDiv";
  navbar.appendChild(darkModeDiv);

  const imgDarkMode = document.createElement("img");
  imgDarkMode.className = "imgDarkMode";
  darkModeDiv.appendChild(imgDarkMode);

  const textDarkMode = document.createElement("div");
  textDarkMode.className = "textDarkMode";

  let isDark = document.body.classList.contains("darkMode");
  applyTheme(isDark, imgDarkMode, textDarkMode);

  darkModeDiv.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
    isDark = !isDark;
    applyTheme(isDark, imgDarkMode, textDarkMode);
  });

  darkModeDiv.appendChild(imgDarkMode);
  darkModeDiv.appendChild(textDarkMode);
}

function applyTheme(isDark, imgDarkMode, textDarkMode) {
  imgDarkMode.src = isDark ? "assets/moon.png" : "assets/sun.png";
  imgDarkMode.style.filter = isDark
    ? "brightness(1.2) contrast(100%) grayscale(0%)"
    : "brightness(0.2) contrast(150%) grayscale(30%)";
  textDarkMode.innerHTML = isDark ? "Dark Mode" : "Light Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}