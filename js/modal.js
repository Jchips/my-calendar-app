'use strict';

// let hours = ['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'];

// let colors = {
//   blue: 'blue',
//   green: 'green',
//   red: 'red'
// };

// Adds all the hours to the dropdown in the modal
function populateTimes() {
  const selectElement = document.getElementById('times');
  for (let i = 0; i < hours.length; i++) {
    let option = document.createElement('option');
    option.value = hours[i];
    option.textContent = hours[i];
    selectElement.appendChild(option);
  }
}

function populateColors() {
  const selectElement = document.getElementById('colors');
  for(const property in colors) {
    let option = document.createElement('option');
    option.value = property;
    option.textContent = property;
    selectElement.appendChild(option);
  }
}

// Gets events from local storage
function checkLocalStorage(date) {
  let day;
  if (localStorage.getItem(date)) {
    day = new Day(JSON.parse(localStorage.getItem(date)));
  } else {
    day = new Day([]);
  }
  return day;
}

// Takes the user's input and adds it as a new event
function handleAddEvent(e) {
  e.preventDefault();
  let submittedTime = document.getElementById('times').value;
  let eventTitle = e.target.eventTitle.value;
  let eventColor = document.getElementById('colors').value;
  let day = checkLocalStorage(selectedDay.id);
  day.addEvent(submittedTime, eventTitle, eventColor);
  day.saveToLocalStorage(selectedDay.id);
  displayEventsToCalendar(selectedDay);
  handleCloseClick();
}

// If the td (day) has an event added to it, append event(s) to the modal for that day
function displayEventsToModal(td) {
  let day = checkLocalStorage(td.id);

  // clear all events in the td (day) first so that events don't show doubles on the calendar
  // when displaying.
  let allEventsInDay = document.getElementById('events-container');
  allEventsInDay.innerHTML = '';

  // Adds all events in the day to modal
  for (let i = 0; i < day.eventsOfDay.length; i++) {
    let newEventDiv = document.createElement('div');
    newEventDiv.classList.add('added-events');
    newEventDiv.id = i;
    let eventTimeDisplay = document.createElement('p');
    let hr = document.createElement('hr'); // line to seperate time from event title
    let eventTitleDisplay = document.createElement('p');
    eventTimeDisplay.textContent = day.eventsOfDay[i].time;
    eventTitleDisplay.textContent = day.eventsOfDay[i].title;
    newEventDiv.style.background = colors[day.eventsOfDay[i].color];
    checkColor(newEventDiv);

    // Remove event button for each event
    let removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = '❌';
    removeButton.addEventListener('click', function(){
      handleRemoveEvent(newEventDiv.id, td, day);
    });

    newEventDiv.appendChild(removeButton);
    newEventDiv.appendChild(eventTimeDisplay);
    newEventDiv.appendChild(hr);
    newEventDiv.appendChild(eventTitleDisplay);
    allEventsInDay.appendChild(newEventDiv);
  }
}

/**
 * Removes an event from the selected day and then updates the calendar and modal.
 * @param {Number} eventID - The id of the event's div. It will be a number.
 * @param {Element} date - The td element user is removing an event from
 * @param {Object} day - The day object user is removing an event from
 */
function handleRemoveEvent(eventID, date, day){
  day.removeEvent(eventID, date.id);
  displayEventsToCalendar(date);
  displayEventsToModal(date);
}

// EVENT LISTENERS
addEventForm.addEventListener('submit', handleAddEvent);

// FUNCTION CALLS
populateTimes();
populateColors();
