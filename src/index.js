import './css/styles.css';
import { fetchCountries as fetchCountriesData} from './JS/fetchCountries'
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const refs = {
  inputEl:document.querySelector('#search-box'),
countryListEl:document.querySelector('.country-list'),
countryInfoEl:document.querySelector('.country-info'),
}

const DEBOUNCE_DELAY = 300;
const classForNameOneCountry = 'titleForOneCountry';

refs.inputEl.addEventListener('input', debounce(handleOnInputEl, DEBOUNCE_DELAY))

async function handleOnInputEl(event) {
  const valueOfInputEl = event.target.value.trim();
  if (valueOfInputEl === '') {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
    refs.inputEl.style.backgroundColor = '#fafafa';
    return
  }
  try {
    const dataOfCountries = await fetchCountriesData(valueOfInputEl);
     return showOnScreen(dataOfCountries);
  } catch (error) {
    refs.countryInfoEl.innerHTML = '';
    refs.countryListEl.innerHTML = '';
    refs.inputEl.style.backgroundColor = 'rgb(241, 121, 121)';
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function showOnScreen(arreyOfCountries) {
  if (arreyOfCountries.length >= 10) {
    refs.inputEl.style.backgroundColor = 'rgb(10, 208, 238)';
   
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  else if (arreyOfCountries.length === 1) {
    refs.inputEl.style.backgroundColor='#a2f19b'
      makeMarkupCountriesList(arreyOfCountries, classForNameOneCountry);
      makeMarkupCountryInfo(arreyOfCountries);
  }
  else if (arreyOfCountries.length >= 2 && arreyOfCountries.length < 10) {
        makeMarkupCountriesList(arreyOfCountries)
        refs.inputEl.style.backgroundColor = '#dceb5c';
    refs.countryInfoEl.innerHTML = '';
    }
}

function makeMarkupCountriesList(arreyOfCountries, classForNameOneCountry) {
  let markupCountiesList = ''
  markupCountiesList = arreyOfCountries.reduce((acc, { flags:{svg}, name:{common}}) => {
 
    acc += `<li>
          <img src="${svg}" width="40" height="25">
          <p class=${classForNameOneCountry ? classForNameOneCountry : 'classForNameAllCountries'}>${common}</p></li>`
    return acc
  }, '')
        
  refs.countryListEl.innerHTML = markupCountiesList;
}

function makeMarkupCountryInfo(arreyOfCountries) {
  let markupCountryInfo = '';
  markupCountryInfo= arreyOfCountries.reduce((acc, {capital, population,languages}) => {
            acc += `
          <p><span class="title">Capital:</span> ${capital}</p>
          <p><span class="title">Population:</span> ${population}</p>
          <p><span class="title">Languages:</span> ${Object.values(languages).join(',')}</p>
          `
       return acc 
     }, '')
        refs.countryInfoEl.innerHTML = markupCountryInfo;
}

