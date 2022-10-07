const BASE_URL = 'https://restcountries.com';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    return response.json();
  });
}
