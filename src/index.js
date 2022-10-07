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

  fetchCountries(inputValue)
    .then(data => {
      const validCountriesList = data.length > 1 && data.length < 11;

      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (validCountriesList) {
        renderCountryListMarkup(data);
      } else if (data.length === 1) {
        renderOneCountryMarkup(data[0]);
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(error => console.log(error));
}

function renderOneCountryMarkup({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  const langs = Object.values(languages).join(', ');

  const markup = `<h1>${name.official}</h1>
        <p><b>Capital: ${capital}</b></p>
        <p><b>Population: ${population} </b></p>
        <p><b>Languages: ${langs}</b></p>`;

  refs.countryInfo.innerHTML = markup;
}

function renderCountryListMarkup(data) {
  data.forEach(({ flags, name }) => {
    const markup = `<img style="margin-right:10px;" src="${flags.svg}" alt="${name.official}" width="20" height="20" />
<p style="margin:0;font-weight:500;">${name.official}</p>`;
    console.log(data);
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
