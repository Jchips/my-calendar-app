'use strict';

// GLOBAL VARIABLES
let allMonths = document.querySelectorAll('.month-div');
let addBackground = document.getElementById('add-background');
let removeBackgroundBtn = document.getElementById('remove-background-btn');

// Loads user's new inputted background for the calendar
function handleAddBackground(e) {
  e.preventDefault(); // prevents instant form refresh
  let url = e.target.background.value;

  // Sets background image for all months
  for(let i = 0; i < allMonths.length; i++) {
    allMonths[i].style.backgroundImage = `url('${url}')`;
  }
  localStorage.setItem('background', JSON.stringify(url));
  addBackground.reset(); // clears form
  loadBackground();
}

// Removes the user's background from the calendar
function removeBackground() {
  for (let i = 0; i < allMonths.length; i++) {
    allMonths[i].style.background = '#f5f5f5'; // formerly #dbdbdb
  }
  localStorage.setItem('background', '');
  // renderMonth();
  loadBackground();
}

// EVENT LISTENERS
addBackground.addEventListener('submit', handleAddBackground);
removeBackgroundBtn.addEventListener('click', removeBackground);

// FUNCTION CALLS
loadBackground();
