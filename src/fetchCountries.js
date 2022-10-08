const BASE_URL = 'https://restcountries.com';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export function fetchCountries(name) {
  return fetch(`${BASE_URL}/v3.1/name/${name}?${searchParams}`).then(
    response => {
      return response.json();
    }
  );
}
