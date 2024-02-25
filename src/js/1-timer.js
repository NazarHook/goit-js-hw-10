'use strict';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const input = document.querySelector('input');
const startBtn = document.querySelector('button');
const daysField = document.querySelector('span[data-days]');
const hoursField = document.querySelector('span[data-hours]');
const minutesField = document.querySelector('span[data-minutes]');
const secondsField = document.querySelector('span[data-seconds]');
let userSelectedDate;
let timerInterval;
const options = {
  dateFormat: 'Y-m-d H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < Date.now()) {
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }
    startBtn.disabled = false;
    const timeRemaining = convertMs(userSelectedDate - Date.now());
  },
};
flatpickr('#datetime-picker', options);
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
function timer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    input.disabled = true;
  } else {
    clearInterval(timerInterval);
    startBtn.disabled = false;
  }
}
function updateTimer() {
  const timeRemaining = convertMs(userSelectedDate - Date.now());
  daysField.textContent = addLeadingZero(timeRemaining.days);
  hoursField.textContent = addLeadingZero(timeRemaining.hours);
  minutesField.textContent = addLeadingZero(timeRemaining.minutes);
  secondsField.textContent = addLeadingZero(timeRemaining.seconds);

  if (
    timeRemaining.days === 0 &&
    timeRemaining.hours === 0 &&
    timeRemaining.minutes === 0 &&
    timeRemaining.seconds === 0
  ) {
    clearInterval(timerInterval);
    startBtn.disabled = false;
  }
}
startBtn.addEventListener('click', timer);
window.addEventListener('load', () => {
  startBtn.disabled = true
})

