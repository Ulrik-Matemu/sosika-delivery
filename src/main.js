import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import "./firebase"; // Initializes Firebase
import "./push-notifications"; // Handles notifications

document.addEventListener('DOMContentLoaded', () => {
  // Your DOM manipulation code here
  document.querySelector('#app').innerHTML = `
  <div id="app">
  
  </div>
`


setupCounter(document.querySelector('#counter'))
});

