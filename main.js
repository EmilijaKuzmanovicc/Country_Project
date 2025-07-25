import { fetchData } from "./fetchData.js";
import { drawNavbar } from "./models/navBar.js"

const countries = [];
const regions = new Set();
let currentSelected = "";
let currentSearch = "";
let debounceTimer;
let currentPage = 0;
let pageSize;
let isLastPage = false;
let filteredCounties = [];
let currentPageWidth;

function onScroll() {
  let currentScroll = window.innerHeight + window.scrollY;
  let height = document.body.offsetHeight;
  if (currentScroll >= height) {
    const countryDiv = document.querySelector(".countryDiv");
    drawCountyFunc(countryDiv);
  };
};

window.addEventListener("scroll", onScroll);



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

function drawBody(host) {
  const countryListDiv = document.createElement("div");
  countryListDiv.className = "countryListDiv";
  host.appendChild(countryListDiv);

  const countrySearchContainer = document.createElement("div");
  countrySearchContainer.className = "countrySearchContainer";
  countryListDiv.appendChild(countrySearchContainer);

  const countryDiv = document.createElement("div");
  countryDiv.className = "countryDiv";
  drawFilter(countrySearchContainer, countryDiv);

  countryListDiv.appendChild(countryDiv);

  const notFoundDiv = document.createElement("div");
  notFoundDiv.className = "notFoundDiv";
  notFoundDiv.innerHTML = "Sorry, no matches for the entered values.";
  notFoundDiv.style.display = "none";
  countryListDiv.appendChild(notFoundDiv);

  filteredCountiesFunction(currentSelected, currentSearch);
  drawCountyFunc(countryDiv);
}

function filteredCountiesFunction(region, searchText) {
  filteredCounties = [];

  countries.forEach(e => {
    const matchRegion = region === "" || e.region === region;
    const matchSearch = searchText === "" || e.name?.toLowerCase().includes(searchText.toLowerCase());

    if (matchRegion && matchSearch) { filteredCounties.push(e); }
  });
}

function drawCountyFunc(host) {
  const notFoundDiv = document.querySelector(".notFoundDiv");

  if (filteredCounties.length === 0) { notFoundDiv.style.display = "block"; }
  else {
    notFoundDiv.style.display = "none";

    if (!isLastPage) {
      const startIndex = currentPage;
      const endIndex = currentPage + pageSize;
      let firstCountries = [];

      if (filteredCounties.length < endIndex) {
        firstCountries = [...filteredCounties];
        isLastPage = true;
      }
      else {
        firstCountries = filteredCounties.slice(startIndex, endIndex);
        currentPage += pageSize;
      }

      firstCountries.forEach(country => {
        country.drawCountry(host);
      });
    }
  }
}

function updatePageSize() {
  pageSize = 8;

  if (window.innerWidth < 1400) { pageSize = 6; }
  else if (window.innerWidth < 510) { pageSize = 3; }

}

window.addEventListener('resize', function () {
  currentPageWidth = window.innerWidth;
  pageSize = 8;
  if (window.innerWidth < 1400) { pageSize = 6; }
  else if (window.innerWidth < 510) { pageSize = 3; }
});


function drawFilter(host, countyC) {

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = " Search...";
  searchInput.className = "searchInput";
  host.appendChild(searchInput);

  const select = document.createElement("select");
  select.className = "selectDiv";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Filter by region";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);


  regions.forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    select.appendChild(option);
  });
  host.appendChild(select);

  select.addEventListener("change", () => {
    countyC.innerHTML = "";
    currentPage = 0;
    isLastPage = false;
    filteredCountiesFunction(select.value, currentSearch);
    drawCountyFunc(countyC);
  });

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentPage = 0;
      currentSearch = e.target.value.trim();
      countyC.innerHTML = "";
      isLastPage = false;
      filteredCountiesFunction(currentSelected, currentSearch);
      drawCountyFunc(countyC);
    }, 100);
  });
}


