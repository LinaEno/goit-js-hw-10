import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchField: document.querySelector("input#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),

}

let searchName = '';

refs.searchField.addEventListener('input',  debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
    event.preventDefault();

    searchName = event.target.value.trim();

    if (searchName === '') {
        clear();
        return;
    } else fetchCountries(searchName).then(countryNames => {
        if (countryNames.length < 2) {
            addCountryFullInfo(countryNames);
        } else if (countryNames.length < 10 && countryNames.length > 1) {
            addCountryList(countryNames);
        } else {
            clear();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        };
    })
        .catch(() => {
            clear();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
}


function addCountryFullInfo(country) {
    clear();
    // console.log(country[0]);
    const languages = Object.values(country[0].languages).map(el => el.name).join(', ');
    console.log(languages);
    const countryFullMarkup = 
        `
        <img
            class="flag"
            src="${country[0].flags.svg}"
            alt="country flag"
            width=100
        />
        <h1>${country[0].name}</h1>
        <p>Capital: <span class="country-value">${country[0].capital}</span></p>
        <p>Population: <span class="country-value">${country[0].population}</span></p>
        <p>Languages: <span class="country-value">${languages}</span></p>
`;
    return refs.countryInfo.innerHTML = countryFullMarkup;
};

function addCountryList(country) {
    clear();
    const countryMarkup = country.map((item) => {
        return `
            <li class="country-list-item">
                <img
                    class="flag-svg"
                    src="${item.flags.svg}"
                    alt="flag"
                    width=100
                />
                <p class="country-name">${item.name}</p>
            </li>`
}).join('');
    refs.countryList.insertAdjacentHTML("beforeend", countryMarkup);
};

function clear() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}
