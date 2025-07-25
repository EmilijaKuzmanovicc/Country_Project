import { fetchCountryByName, fetchBordersCountries } from "../fetchData.js";

export class Country {
  constructor(data) {
    this.officialName = data.officialName ?? null;
    this.name = data.name ?? null;
    this.flag = data.flag ?? null;
    this.nativeName = data.nativeName ?? null;
    this.population = data.population ?? null;
    this.region = data.region ?? null;
    this.subregion = data.subregion ?? null;
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
    const imgCountrySmall = document.createElement("img");
    imgCountrySmall.className = "imgCountrySmall";
    imgCountrySmall.src = this.flag;
    this.container.appendChild(imgCountrySmall);

    const descriptionCountry = document.createElement("div");
    descriptionCountry.className = "descriptionCountry";
    descriptionCountry.style.marginLeft = "20px";
    this.container.appendChild(descriptionCountry);

    const countryName = document.createElement("div");
    countryName.className = "countryName";
    countryName.innerHTML = this.name;
    descriptionCountry.appendChild(countryName);

    const nfObject = new Intl.NumberFormat('en-US');
    this.drawTextDescription(descriptionCountry, "Population:", nfObject.format(this.population));
    this.drawTextDescription(descriptionCountry, "Region:", this.region);
    this.drawTextDescription(descriptionCountry, "Capital:", this.capital);
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

  drawTextDescription(host, name, value, divOverFlow = "") {
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
    const backButton = document.createElement("button");
    backButton.className = "backButton backBtn";
    backButton.style.marginTop = "3rem";
    backButton.innerHTML = "← Back";
    host.appendChild(backButton);

    backButton.addEventListener("click", () => {

      host.style.display = "none";
      const divBody = document.querySelector(".divBody");
      divBody.style.display = "block";
    });

    const singleCountryDiv = document.createElement("div");
    singleCountryDiv.className = "singleCountryDiv";
    host.appendChild(singleCountryDiv);

    const imgCountryBig = document.createElement("img");
    imgCountryBig.className = "imgCountryBig";
    imgCountryBig.src = countryData.flags.svg;
    singleCountryDiv.appendChild(imgCountryBig);

    const countryDescriptionDiv = document.createElement("div");
    countryDescriptionDiv.className = "countryDescriptionDiv";
    singleCountryDiv.appendChild(countryDescriptionDiv);

    const countryName = document.createElement("div");
    countryName.className = "countryName";
    countryName.innerHTML = countryData.name.common;
    countryDescriptionDiv.appendChild(countryName);

    const leftRightDescription = document.createElement("div");
    leftRightDescription.className = "leftRightDescription";

    const textDescriptionDiv = document.createElement("div");
    textDescriptionDiv.className = "textDescriptionDiv";
    countryDescriptionDiv.appendChild(textDescriptionDiv);

    const nameDescription = document.createElement("div");
    nameDescription.className = "nameDescription";
    nameDescription.innerHTML = "Native Name: ";
    textDescriptionDiv.appendChild(nameDescription);

    const divOverFlow = document.createElement("div");
    divOverFlow.className = "divOverFlow";
    divOverFlow.innerHTML = countryData.name.official;
    textDescriptionDiv.appendChild(divOverFlow);

    divOverFlow.addEventListener("click", () => {
      divOverFlow.classList.toggle("expanded");
    });
    countryDescriptionDiv.appendChild(leftRightDescription);

    const leftDescription = document.createElement("div");
    leftDescription.className = "leftDescription";
    leftRightDescription.appendChild(leftDescription);
    const nfObject = new Intl.NumberFormat('en-US');

    this.drawTextDescription(leftDescription, "Population: ", nfObject.format(countryData.population));
    this.drawTextDescription(leftDescription, "Region: ", countryData.region);
    this.drawTextDescription(leftDescription, "Sub Region: ", countryData.subregion);
    this.drawTextDescription(leftDescription, "Capital: ", countryData.capital);

    const rightDescription = document.createElement("div");
    rightDescription.className = "rightDescription";
    leftRightDescription.appendChild(rightDescription);

    this.drawTextDescription(rightDescription, "Top Level Domain: ", countryData.tld.join(', '));
    this.drawTextDescription(rightDescription, "Currencies: ", Object.values(countryData.currencies).map(c => c.name).join(', '));
    this.drawTextDescription(rightDescription, "Languages: ", Object.values(countryData.languages).join(', '));

    const borderCountriesDiv = document.createElement("div");
    borderCountriesDiv.className = "borderCountriesDiv";
    countryDescriptionDiv.appendChild(borderCountriesDiv);

    const borderCountriesName = document.createElement("div");
    borderCountriesName.className = "borderCountriesName";
    borderCountriesName.innerHTML = "Border Countries: ";
    borderCountriesDiv.appendChild(borderCountriesName);

    listOfBorders.forEach(element => { this.drawBorderCountry(borderCountriesDiv, element); });
  }

  drawBorderCountry(host, countryName) {
    const countyNameDiv = document.createElement("button");
    countyNameDiv.className = "backButton countryButton";
    countyNameDiv.innerHTML = countryName;
    host.appendChild(countyNameDiv);

    countyNameDiv.addEventListener("click", async () => { this.loadCountryData(countryName); });
  }
}