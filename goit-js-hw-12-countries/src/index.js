import './styles.css';
import template from './templates/countries.hbs';
import prelist from './templates/list.hbs';
import debounce from 'lodash.debounce';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

const input = document.querySelector('input');
const body = document.getElementById('empty');
const block = document.getElementById('whole_block');

input.addEventListener('input', debounce(search, 500));

const baseUrl = 'https://restcountries.eu/rest/v2/name/';

function pNotifyNotice() {
  error({
    title: 'Too many countries found. Please enter a more specific query.',
    width: '320px',
    delay: '2000',
  });
}

function search(e) {
  fetch(baseUrl + e.target.value)
    .then(result => {
      if (result.status === 404) {
        return;
      }
      if (result.status === 200) {
        let parcedJson = result.json();
        return parcedJson;
      }
    })
    .then(result => {
      if (result.length >= 10) {
        console.log(
          '%c Too many countries found. Please enter a more specific query',
          'color: tomato',
        );
        body.innerHTML = prelist('');
        pNotifyNotice();
        return result;
      }
      if (result.length < 10 && result.length >= 2) {
        body.innerHTML = prelist(result);
        result.map(mapped => {
          let mappedArrNames = mapped.name;
          return mappedArrNames;
        });
      }
      if (result.length === 1) {
        result.map(mapped => {
          let mappedArrName = mapped.name;
          console.log(`%c Your country is:  ${mappedArrName}`, 'color: #afa');
          body.innerHTML = template(mapped);
        });
      }
    })
    .catch(err =>
      console.log('%c Empty input! or Nothing matched!', 'color: chocolate'),
    );
}
