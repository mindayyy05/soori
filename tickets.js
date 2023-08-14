const normalHours = ["7am-8am", "8am-9am", "9am-10am", "1pm-2pm", "2pm-3pm"];
const peakHours = ["10am-11am", "11am-12pm", "12pm-1pm", "3pm-4pm", "4pm-5pm", "5pm-6pm"];

const timeSlotCheckboxes = document.querySelectorAll('.timeSlot');
const timeSlotDisplay = document.getElementById('timeSlot');
const durationnDisplay = document.getElementById('durationn');
const slChildTicketDisplay = document.getElementById('slChildTicket');
const slAdultTicketDisplay = document.getElementById('slAdultTicket');
const foreignerChildTicketDisplay = document.getElementById('foreignerChildTicket');
const foreignerAdultTicketDisplay = document.getElementById('foreignerAdultTicket');
const infantTicketDisplay = document.getElementById('infantTicket');
const slChildChargeDisplay = document.getElementById('slChildCharge');
const slAdultChargeDisplay = document.getElementById('slAdultCharge');
const foreignerChildChargeDisplay = document.getElementById('foreignerChildCharge');
const foreignerAdultChargeDisplay = document.getElementById('foreignerAdultCharge');
const infantChargeDisplay = document.getElementById('infantCharge');
const chargeSummaryDisplay = document.getElementById('chargeSummary');
const selectedDateeDisplay = document.getElementById('selectedDatee');
const reservationDateInput = document.getElementById('reservation-id');

// ... (Rest of the code remains unchanged)
const ticketQuantities = {
  'slChild': 0,
  'slAdult': 0,
  'foreignerChild': 0,
  'foreignerAdult': 0,
  'infant': 0
};

const ticketPrices = {
  'slChild': {'normal': 2, 'peak': 3},
  'slAdult': {'normal': 4, 'peak': 6},
  'foreignerChild': {'normal': 5, 'peak': 8},
  'foreignerAdult': {'normal': 10, 'peak': 13},
  'infant': {'normal': 0, 'peak': 0}
};


function stepperSLC(step){
  const input=document.getElementById('slc');
  input.value=Math.max(parseInt(input.value)+step,0);
  updateTicketSummary();
}
function stepperSLA(step){
  const input=document.getElementById('sla');
  input.value=Math.max(parseInt(input.value)+step,0);
  updateTicketSummary();
}
function stepperFC(step){
  const input=document.getElementById('fc');
  input.value=Math.max(parseInt(input.value)+step,0);
  updateTicketSummary();
}
function stepperFA(step){
  const input=document.getElementById('fa');
  input.value=Math.max(parseInt(input.value)+step,0);
  updateTicketSummary();
}
function stepperInf(step){
  const input=document.getElementById('in');
  input.value=Math.max(parseInt(input.value)+step,0);
  updateTicketSummary();
}

function updateTicketSummary() {
  ticketQuantities['slChild'] = parseInt(document.getElementById('slc').value);
  ticketQuantities['slAdult'] = parseInt(document.getElementById('sla').value);
  ticketQuantities['foreignerChild'] = parseInt(document.getElementById('fc').value);
  ticketQuantities['foreignerAdult'] = parseInt(document.getElementById('fa').value);
  ticketQuantities['infant'] = parseInt(document.getElementById('in').value);
  slChildTicketDisplay.textContent = ticketQuantities['slChild'];
  slAdultTicketDisplay.textContent = ticketQuantities['slAdult'];
  foreignerChildTicketDisplay.textContent = ticketQuantities['foreignerChild'];
  foreignerAdultTicketDisplay.textContent = ticketQuantities['foreignerAdult'];
  infantTicketDisplay.textContent = ticketQuantities['infant'];
  updateSummary();
}

function updateSummary() {
  const selectedTimeSlots = Array.from(timeSlotCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  const earliestTime = selectedTimeSlots.length > 0 ? selectedTimeSlots[0].split('-')[0] : '7.00am';
  const latestTime = selectedTimeSlots.length > 0 ? selectedTimeSlots[selectedTimeSlots.length - 1].split('-')[1] : '8.00am';

  timeSlotDisplay.textContent = `${earliestTime} - ${latestTime}`;

  const normalCount = selectedTimeSlots.filter(slot => normalHours.includes(slot)).length;
  const peakCount = selectedTimeSlots.filter(slot => peakHours.includes(slot)).length;

  durationnDisplay.textContent = `${selectedTimeSlots.length}hrs (${normalCount} normal : ${peakCount} peak)`;

  let totalCharge = 0;

  for (const ticketType in ticketQuantities) {
    const quantity = ticketQuantities[ticketType];

    const normalPrice = ticketPrices[ticketType]['normal'];
    const peakPrice = ticketPrices[ticketType]['peak'];
    const ticketCharge = (normalPrice * normalCount + peakPrice * peakCount) * quantity;
    totalCharge += ticketCharge;

    localStorage.setItem('selectedTimeSlots', JSON.stringify(selectedTimeSlots));
    localStorage.setItem('durationn', durationnDisplay.textContent);
    localStorage.setItem('slChildTicket',slChildTicketDisplay.textContent);
    localStorage.setItem('slAdultTicket',slAdultTicketDisplay.textContent);
    localStorage.setItem('foreignerChildTicket',foreignerChildTicketDisplay.textContent);
    localStorage.setItem('foreignerAdultTicket',foreignerAdultTicketDisplay.textContent);
    localStorage.setItem('infantTicket',infantTicketDisplay.textContent);
    localStorage.setItem('slChildCharge',slChildChargeDisplay.textContent);
    localStorage.setItem('slAdultCharge',slAdultChargeDisplay.textContent);
    localStorage.setItem('foreignerChildCharge',foreignerChildChargeDisplay.textContent);
    localStorage.setItem('foreignerAdultCharge',foreignerAdultChargeDisplay.textContent);
    localStorage.setItem('infantCharge',infantChargeDisplay.textContent);
    localStorage.setItem('chargeSummary',chargeSummaryDisplay.textContent);

    // Update charge displays for each category
    document.getElementById(`${ticketType}Charge`).textContent = ticketCharge;
  }

  chargeSummaryDisplay.textContent = `$ ${totalCharge} `;
  localStorage.setItem('summaryTableHTML', document.getElementById('summary').innerHTML);
  localStorage.setItem('chargeSummary',chargeSummaryDisplay.textContent);

}
// Update the summary when checkboxes are clicked
timeSlotCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateSummary);
});
function updateSelectedDate() {
  const selectedDatee = reservationDateInput.value;
localStorage.setItem("datee",selectedDatee);
const dateValue = localStorage.getItem("datee")
  selectedDateeDisplay.textContent = dateValue;
  updateSummary();
}

// Initialize the selected date and update summary
updateSelectedDate();

function updatePurchaseButtonStatus() {
    const allInputsFilled = (
      reservationDateInput.value !== '' &&
      Array.from(timeSlotCheckboxes).some(checkbox => checkbox.checked) &&
      (ticketQuantities['slChild'] > 0 || ticketQuantities['slAdult'] > 0 ||
      ticketQuantities['foreignerChild'] > 0 || ticketQuantities['foreignerAdult'] > 0 ||
      ticketQuantities['infant'] > 0)
    );
  
    const purchaseButton = document.getElementById('purchase-button');
    const purchaseLink = document.getElementById('purchase-link');
  
    if (allInputsFilled) {
      purchaseButton.removeAttribute('disabled');
      purchaseLink.href = "details.html?summary=REPLACE_WITH_SUMMARY_DATA";
    } else {
      purchaseButton.setAttribute('disabled', 'true');
      purchaseLink.removeAttribute('href');
    }

    localStorage.setItem('summaryTableHTML', document.getElementById('summary').innerHTML);
  }
  
  // Call the updatePurchaseButtonStatus function whenever there's an input change
  reservationDateInput.addEventListener('change', updatePurchaseButtonStatus);
  timeSlotCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePurchaseButtonStatus);
  });
  for (const ticketType in ticketQuantities) {
    const input = document.getElementById(ticketType);
    input.addEventListener('change', updatePurchaseButtonStatus);
  }
  
  // Call the updatePurchaseButtonStatus function initially
  updatePurchaseButtonStatus();

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  function updateSelectedDate() {
    const selectedDateInput = reservationDateInput.value;
    const selectedDate = selectedDateInput || getCurrentDate(); // Use selected date or current date
    localStorage.setItem('datee', selectedDate);
    selectedDateeDisplay.textContent = selectedDate;
    updateSummary();
  }
  
  