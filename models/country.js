import { fetchCountryByName, fetchBordersCountries } from "../fetchData.js";
import { createButton } from "../components/button.js";
export const countries = [];
export const regions = new Set();
let currentSelected = "";
let currentSearch = "";
let debounceTimer;

let currentPage = 0;
let pageSize;
let isLastPage = false;
let filteredCounties = [];
let currentPageWidth;
export class Country {
  constructor(data) {
    this.officialName = data.officialName ?? null;
    this.name = data.name ?? null;
    this.flag = data.flag ?? null;
    this.nativeName = data.nativeName ?? null;
    this.population = data.population ?? null;
    this.region = data.region ?? null;
    this.subregion = data.subregion ?? "suuu";
    this.capital = data.capital ?? null;
    this.topLevelDomain = data.topLevelDomain ?? null;

    this.currencies = Array.isArray(data.currencies)
      ? data.currencies.map(c => ({
        code: c.code ?? null,
        name: c.name ?? null,
        symbol: c.symbol ?? null
      }))
      : null;

    this.languages = Array.isArray(data.languages)
      ? data.languages.map(l => ({
        iso639_1: l.iso639_1 ?? null,
        iso639_2: l.iso639_2 ?? null,
        name: l.name ?? null,
        nativeName: l.nativeName ?? null
      }))
      : null;

    this.borders = data.borders ?? null;
  }

  drawCountry(host) {
    this.container = document.createElement("div");
    this.container.className = "containerCountry";
    const countryImgSmall = document.createElement("img");
    countryImgSmall.className = "countryImgSmall";
    countryImgSmall.src = this.flag;
    this.container.appendChild(countryImgSmall);

    const countryDescription = document.createElement("div");
    countryDescription.className = "countryDescription";
    countryDescription.style.marginLeft = "20px";
    this.container.appendChild(countryDescription);

    const countryName = document.createElement("div");
    countryName.className = "countryName";
    countryName.innerHTML = this.name;
    countryDescription.appendChild(countryName);

    const nfObject = new Intl.NumberFormat('en-US');
    this.drawTextDescription(countryDescription, "Population:", nfObject.format(this.population));
    this.drawTextDescription(countryDescription, "Region:", this.region || "NA");
    this.drawTextDescription(countryDescription, "Capital:", this.capital.length === 0 ? "NA" : this.capital);
    host.appendChild(this.container);

    this.container.addEventListener("click", async () => {
      await this.loadCountryData(this.officialName);
    });
    return this.container;

  }
  async loadCountryData(countryName) {
    const singleCountyBody = document.querySelector(".singleCountyBody");
    const divBody = document.querySelector(".divBody");

    const countryData = await fetchCountryByName(countryName);

    const listOfBorders = [];

    for (const borderCode of countryData.borders) {
      const border = await fetchBordersCountries(borderCode);
      listOfBorders.push(border);
    }

    divBody.style.display = "none";
    singleCountyBody.innerHTML = "";
    singleCountyBody.style.display = "block";

    this.drawSingleCountry(singleCountyBody, countryData, listOfBorders);
  }

  drawTextDescription(host, name, value) {
    const textDescriptionDiv = document.createElement("div");
    textDescriptionDiv.className = "textDescriptionDiv";
    host.appendChild(textDescriptionDiv);

    const nameDescription = document.createElement("div");
    nameDescription.className = "nameDescription";
    nameDescription.innerHTML = name;
    textDescriptionDiv.appendChild(nameDescription);

    const valueDescription = document.createElement("div");
    valueDescription.className = "valueDescription";
    valueDescription.innerHTML = value;
    textDescriptionDiv.appendChild(valueDescription);
  }

  drawSingleCountry(host, countryData, listOfBorders) {
    const backButton = createButton({
      text: "← Back",
      className: "backButton",
      onClick: () => {
        host.style.display = "none";
        document.querySelector(".divBody").style.display = "block";
      },
    });
    backButton.style.marginTop = "3rem";
    host.appendChild(backButton)

    const singleCountryDiv = document.createElement("div");
    singleCountryDiv.className = "singleCountryDiv";
    host.appendChild(singleCountryDiv);

    const countryImgBig = document.createElement("img");
    countryImgBig.className = "countryImgBig";
    countryImgBig.src = countryData.flags.svg;
    singleCountryDiv.appendChild(countryImgBig);

    const countryDescriptionDiv = document.createElement("div");
    countryDescriptionDiv.className = "countryDescriptionDiv";
    singleCountryDiv.appendChild(countryDescriptionDiv);

    const countryName = document.createElement("div");
    countryName.className = "countryName";
    countryName.innerHTML = countryData.name.common;
    countryDescriptionDiv.appendChild(countryName);

    const moreAboutCounty = document.createElement("div");
    moreAboutCounty.className = "moreAboutCounty";

    const textDescriptionDiv = document.createElement("div");
    textDescriptionDiv.className = "textDescriptionDiv";
    countryDescriptionDiv.appendChild(textDescriptionDiv);

    countryDescriptionDiv.appendChild(moreAboutCounty);

    const leftDescription = document.createElement("div");
    leftDescription.className = "leftDescription";
    moreAboutCounty.appendChild(leftDescription);
    const nfObject = new Intl.NumberFormat('en-US');

    this.drawTextDescription(leftDescription, "Native Name: ", countryData.name.official);
    this.drawTextDescription(leftDescription, "Population: ", nfObject.format(countryData.population));
    this.drawTextDescription(leftDescription, "Region: ", countryData.region || "NA");
    this.drawTextDescription(leftDescription, "Sub Region: ", countryData.subregion || "NA");
    this.drawTextDescription(leftDescription, "Capital: ", countryData.capital.length === 0 ? "NA" : countryData.capital);

    const rightDescription = document.createElement("div");
    rightDescription.className = "rightDescription";
    moreAboutCounty.appendChild(rightDescription);

    this.drawTextDescription(rightDescription, "Top Level Domain: ", countryData.tld.join(', ') || "NA");
    this.drawTextDescription(rightDescription, "Currencies: ", Object.values(countryData.currencies).map(c => c.name).join(', ') || "NA");
    this.drawTextDescription(rightDescription, "Languages: ", Object.values(countryData.languages).join(', ') || "NA");

    const borderCountriesDiv = document.createElement("div");
    borderCountriesDiv.className = "borderCountriesDiv";
    countryDescriptionDiv.appendChild(borderCountriesDiv);

    const borderCountriesName = document.createElement("div");
    borderCountriesName.className = "borderCountriesName";
    borderCountriesName.innerHTML = "Border Countries: ";
    borderCountriesDiv.appendChild(borderCountriesName);

    if (listOfBorders.length === 0) {
      const noBordersText = document.createElement("div");
      noBordersText.className = "noBordersText";
      noBordersText.innerHTML = "There are no countries bordering this one.";
      borderCountriesDiv.appendChild(noBordersText);
    }
    else { listOfBorders.forEach(element => { this.drawBorderCountry(borderCountriesDiv, element); }); }
  }

  drawBorderCountry(host, countryName) {
    const borderBtn = createButton({
      text: countryName,
      className: "backButton borderCountryButton",
      onClick: () => this.loadCountryData(countryName),
    });
    host.appendChild(borderBtn);
  }
}

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
    currentSelected = select.value;
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

export function drawBody(host) {
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

  console.log(countries);
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

export function updatePageSize() {
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

function onScroll() {
  let currentScroll = window.innerHeight + window.scrollY;
  let height = document.body.offsetHeight;
  if (currentScroll >= height) {
    const countryDiv = document.querySelector(".countryDiv");
    drawCountyFunc(countryDiv);
  };
};

window.addEventListener("scroll", onScroll);