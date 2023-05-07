'use strict';

// GLOBAL VARIABLES
let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let hours = ['All Day', '12AM','12:30AM', '1AM', '1:30AM', '2AM', '2:30AM', '3AM', '3:30AM', '4AM', '4:30AM', '5AM', '5:30AM', '6AM', '6:30AM', '7AM', '7:30AM', '8AM','8:30AM', '9AM', '9:30AM', '10AM', '10:30AM', '11AM', '11:30AM', '12PM', '12:30PM', '1PM', '1:30PM', '2PM','2:30PM', '3PM', '3:30PM', '4PM', '4:30PM', '5PM', '5:30PM', '6PM', '6:30PM', '7PM','7:30PM', '8PM', '8:30PM', '9PM', '9:30PM', '10PM', '10:30PM', '11PM', '11:30PM'];
let colors = {
  'Default yellow': '#d4a43b',
  Blue: '#0096FF',
  'Baby Blue': '#ADD8E6',
  'Dark Blue': 'blue',
  Green: 'green',
  Red: 'red',
  Purple: '#B589D6',
  Celebrate: 'linear-gradient(to top, #c471f5 0%, #fa71cd 100%)'
};
let months = [];
const year = 23;

// DOM WINDOW
let calendar = document.getElementById('calendar-container');
let selectMonth = document.getElementById('month-dropdown');
let modal = document.getElementById('modal');
let closeButton = document.getElementById('close-button');
let selectedDay = null;
let addEventForm = document.getElementById('add-event-form');

// Month contructor
// startDay code from https://math.stackexchange.com/questions/3894758/formula-to-find-the-day-of-any-date-in-gregorian-calendar-derivation
// numberOfWeeks code from https://stackoverflow.com/questions/2483719/get-weeks-in-month-through-javascript
function Month(nameOfMonth, numberOfDays, keyValue, index) {
  this.nameOfMonth = nameOfMonth;
  this.numberOfDays = numberOfDays;
  this.keyValue = keyValue;
  this.index = index;
  this.startDay = (1 + this.keyValue + 5 + year + Math.floor(year / 4)) % 7; //returns a number, 0 = Sunday, 1 = Monday, etc. 
  this.numberOfWeeks = getNumWeeks(this.index, this.startDay);

  months.push(this);
}

// Renders month onto index page
Month.prototype.render = function () {
  let monthDiv = document.createElement('div');
  monthDiv.id = this.nameOfMonth;
  monthDiv.classList.add('month-div');

  // add name of month
  let h2 = document.createElement('h2');
  h2.textContent = this.nameOfMonth;
  monthDiv.appendChild(h2);

  // create table for month
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let headRow = document.createElement('tr');

  // Make a th for each day of the week
  for (let i = 0; i < daysOfWeek.length; i++) {
    let th = document.createElement('th');
    th.textContent = daysOfWeek[i];
    headRow.appendChild(th);
  }

  let counter = 1;
  let tbody = document.createElement('tbody');

  // Loops through the number of weeks each month has and creates a row for each week
  for (let i = 0; i < this.numberOfWeeks; i++) {
    let tr = document.createElement('tr');
    // Loops through the days of the week and creates a td for each day
    for (let j = 0; j < daysOfWeek.length; j++) {
      let td = document.createElement('td');
      let tdContainer = document.createElement('div');
      tdContainer.classList.add('td-container');
      // if this is the first week, then start the counter on whichever day of the week the month starts
      // if it's the not first week, then start the counter on Sunday because the other weeks is always a full week
      if (i === 0) {
        if (j >= this.startDay) {
          counter = displayCounter(this.nameOfMonth, counter, this.numberOfDays, td, tdContainer);
        }
      } else {
        counter = displayCounter(this.nameOfMonth, counter, this.numberOfDays, td, tdContainer);
      }
      td.appendChild(tdContainer);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  thead.appendChild(headRow);
  table.appendChild(tbody);
  table.appendChild(thead);
  monthDiv.appendChild(table);
  calendar.appendChild(monthDiv);
};

// Day constructor
function Day(eventsOfDay) {
  this.eventsOfDay = eventsOfDay;
}

// Day method to add events
Day.prototype.addEvent = function (time, title, color) {
  let newEvent = new DayEvent(time, title, color);
  this.eventsOfDay.push(newEvent);
  this.eventsOfDay.sort((a,b) => {
    return hours.indexOf(a.time) - hours.indexOf(b.time);
  });
};

// Day method to remove events
Day.prototype.removeEvent = function (eventIndex, date) {
  this.eventsOfDay.splice(eventIndex, 1);
  this.saveToLocalStorage(date);
};

// Day method to store events to Local
Day.prototype.saveToLocalStorage = function (date) {
  localStorage.setItem(date, JSON.stringify(this.eventsOfDay));
};

//DayEvent constructor
function DayEvent(time, title, color) {
  this.time = time;
  this.title = title;
  this.color = color;
}

// Displays the days of the month and the events of each day
function displayCounter(month, counter, numberOfDays, td, tdContainer) {
  if (counter > numberOfDays) {
    td.textContent = ' ';
  } else {
    tdContainer.id = `${month}${counter}`;
    td.textContent = counter++;
    displayEventsToCalendar(tdContainer);
    tdContainer.classList.add('calendar-date');
    tdContainer.addEventListener('click', handleDateClick);
  }
  return counter;
}

/**
 * Calculates how many weeks there are in a given month.
 * @param {Number} month - A month index. (0-January, 1-Febraury, etc.)
 * @param {Number} firstDay - The index of the first day of the month (0-Sunday, 1-Monday, etc.)
 * @returns a number of how many weeks there are in the given month
 */
function getNumWeeks(month, firstDay) {
  let dayThreshold = [5, 1, 5, 6, 5, 6, 5, 5, 6, 5, 6, 5];
  let baseWeeks = (month === 1 ? 4 : 5); // only February can fit in 4 weeks
  return baseWeeks + (firstDay >= dayThreshold[month] ? 1 : 0); // add an extra week if the month starts beyond the threshold day.
}

// Makes modal appear when you click on a day in the calendar
function handleDateClick(e) {
  modal.style.display = 'block';
  selectedDay = this; // grabs the td that the user clicked on
  displayEventsToModal(selectedDay);
  addEventForm.reset(); // clears the form for next event
}

// Closes the modal when you press the 'close' button
function handleCloseClick(e) {
  modal.style.display = 'none';
}

// Displays all events from localStorage to the calendar
function displayEventsToCalendar(td) {
  // If the td (day) has an event added to it in local storage, append event to the calendar
  if (localStorage.getItem(td.id)) {

    // clear all events in the td (day) first so that events don't show doubles on the calendar
    // when displaying.
    let allEventsInDay = document.querySelectorAll(`#${td.id} .added-events`);
    for (let i = 0; i < allEventsInDay.length; i++) {
      allEventsInDay[i].remove();
    }

    let day = new Day(JSON.parse(localStorage.getItem(td.id)));
    for (let i = 0; i < day.eventsOfDay.length; i++) {
      let newEventDiv = document.createElement('div');
      newEventDiv.classList.add('added-events');
      let eventTimeDisplay = document.createElement('p');
      let hr = document.createElement('hr'); // line to seperate time from event title
      let eventTitleDisplay = document.createElement('p');
      eventTimeDisplay.textContent = day.eventsOfDay[i].time;
      eventTitleDisplay.textContent = day.eventsOfDay[i].title;
      newEventDiv.style.background = colors[day.eventsOfDay[i].color];
      checkColor(newEventDiv);
      newEventDiv.appendChild(eventTimeDisplay);
      newEventDiv.appendChild(hr);
      newEventDiv.appendChild(eventTitleDisplay);
      td.appendChild(newEventDiv);
    }
  }
}

function checkColor(eventDiv) {
  if(eventDiv.style.background === colors['Dark Blue'] ||
    eventDiv.style.background === colors.Green ||
    eventDiv.style.background === colors.Red
  ) {
    eventDiv.style.color = '#eee';
  }
}

// populates month dropdown for user to select which month they want to view
function monthDropDown() {
  const selectElement = document.getElementById('select-month');
  for (let i = 0; i < months.length; i++) {
    let option = document.createElement('option');
    option.value = months[i].nameOfMonth;
    option.textContent = months[i].nameOfMonth;
    selectElement.appendChild(option);
  }
}

// Only renders the month that the user selects
function handleMonthSubmit(e) {
  e.preventDefault(); // prevents instant form refresh
  renderMonth();
}

// Renders whichever month the user selects
function renderMonth() {
  calendar.innerHTML = ''; // erases all calendars from display
  let selectedMonth = document.getElementById('select-month').value;

  // renders only the calendar that the user selected
  for (let i = 0; i < months.length; i++) {
    if (selectedMonth === months[i].nameOfMonth) {
      months[i].render();
    }
  }
  loadBackground();
}

// Loads the calendar background from localStorage
function loadBackground() {
  let getBackground = localStorage.getItem('background');
  if (getBackground) {
    let allMonths = document.querySelectorAll('.month-div');
    for (let i = 0; i < allMonths.length; i++) {
      allMonths[i].style.backgroundImage = `url('${JSON.parse(getBackground)}')`;
    }
  }
}

// Month instances
function generateMonths() {
  let jan = new Month('January', 31, 1, 0);
  let feb = new Month('February', 28, 4, 1);
  let mar = new Month('March', 31, 4, 2);
  let apr = new Month('April', 30, 0, 3);
  let may = new Month('May', 31, 2, 4);
  let jun = new Month('June', 30, 5, 5);
  let jul = new Month('July', 31, 0, 6);
  let aug = new Month('August', 31, 3, 7);
  let sep = new Month('September', 30, 6, 8);
  let oct = new Month('October', 31, 1, 9);
  let nov = new Month('November', 30, 4, 10);
  let dec = new Month('December', 31, 6, 11);

  // automatically renders whatever the current month is
  const getDate = new Date();
  const currentMonth = getDate.getMonth(); // returns an index. 0=January, 1=February etc.
  for (let i = 0; i < months.length; i++) {
    if (i === currentMonth) {
      months[i].render();
    }
  }
}

// EVENT LISTENERS
closeButton.addEventListener('click', handleCloseClick);
selectMonth.addEventListener('submit', handleMonthSubmit);

// FUNCTION CALLS
generateMonths();
monthDropDown();
