import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));

function onInputText(e) {
  const inputValue = e.target.value.trim();

  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (inputValue === '') {
    return;
  } else {
    fetchCountries(inputValue).then(country => {
      const validCountriesList = country.length > 1 && country.length < 11;

      if (validCountriesList) {
        renderCountryListMarkup(country);
      } else if (country.length === 1) {
        renderOneCountryMarkup(country[0]);
      } else if (country.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (country.length > 10) {
        findTooManyMatches();
      }
    });
  }
}

function renderOneCountryMarkup({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  const langs = Object.values(languages).join(', ');

  const markup = `<div style="display:flex;align-items:center;"><img style="margin-right:10px;" src="${flags.svg}" alt="${name.official} weight="20" height="20" />
<h1 style="margin:0;">${name.official}</h1></div>
<p><b>Capital: ${capital}</b></p>
<p><b>Population: ${population} </b></p>
<p><b>Languages: ${langs}</b></p>
`;

  refs.countryInfo.innerHTML = markup;
}

function renderCountryListMarkup(country) {
  country.forEach(({ flags, name }) => {
    const markup = `<img style="margin-right:10px;" src="${flags.svg}" alt="${name.official}" width="20" height="20" />
<p style="margin:0;font-weight:500;">${name.official}</p>`;

    const li = document.createElement('li');
    refs.countryList.append(li);
    li.innerHTML = markup;

    li.style.listStyle = 'none';
    li.style.display = 'flex';
    li.style.alignItems = 'center';

    refs.countryList.style.padding = 0;
    refs.countryList.style.margin = 0;
  });
}

function findTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
