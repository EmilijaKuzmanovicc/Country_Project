import { fetchData } from "./fetchData.js";
import { drawNavbar } from "./models/navBar.js";
import { countries, regions, drawBody, updatePageSize } from "./models/country.js";

async function main() {

  const loader = document.createElement("div");
  loader.className = "loader";

  document.body.appendChild(loader);

  updatePageSize();
  await fetchData(countries, regions);

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("darkMode");
  }

  drawNavbar(document.body);

  const singleCountyBody = document.createElement("div");
  singleCountyBody.className = "singleCountyBody";
  singleCountyBody.style.display = "none";
  document.body.appendChild(singleCountyBody);

  const div = document.createElement("div");
  div.className = "divBody";
  document.body.appendChild(div);
  drawBody(div);

}

main();





