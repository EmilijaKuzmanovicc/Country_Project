import { Country } from "./models/country.js";

export async function fetchData(countries, regions) {
    try {
        showLoader();
        const url = "https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population";
        const response = await fetch(url);
        if (!response.ok) { throw new Error('Network response was not ok'); }
        hideLoader();
        const data = await response.json();

        data.forEach(element => {

            const newCountry = new Country({
                name: element.name.common,
                flag: element.flags.svg,
                region: element.region,
                population: element.population,
                capital: element.capital,
                officialName: element.name.official,
            });

            countries.push(newCountry);
            regions.add(element.region);
        });


    } catch (error) { console.error('There was an error:', error); }
}

export async function fetchCountryByName(countryName) {
    try {
        showLoader();
        const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true&fields=name,flags,borders,population,region,subregion,capital,tld,currencies,languages`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        hideLoader();
        return data[0];
    } catch (error) { console.error("Error loading country data!", error); }
}

export async function fetchBordersCountries(countryName) {
    try {
        showLoader();

        const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(countryName)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        hideLoader();
        return data[0].name.common;

    } catch (error) { console.error("Error loading country data!", error); }
}

export function showLoader() {
    const loader = document.querySelector(".loader");
    if (loader) { loader.classList.remove("loader-hidden"); }
}

export function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) { loader.classList.add("loader-hidden"); }
}