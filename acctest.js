 // Constants
    const API = 'https://hospital-wine-alpha.vercel.app/appointment/list/';
    const DOCTOR = 'https://hospital-wine-alpha.vercel.app/doctor/list/';
    const TIME = 'https://hospital-wine-alpha.vercel.app/doctor/availableTime/';
    
    // Fill options into a select
    function fillSelect(url, select, selectedId = null) {
      fetch(url).then(res => res.json()).then(data => {
        select.innerHTML = '';
        (data.results || data).forEach(d => {
          let opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = d.doctor_name || d.name;
          if (selectedId && selectedId == d.id) {
            opt.selected = true;
          }
          select.appendChild(opt);
        });
      });
    }
    
    // Load Doctor Filter Options
    function fillSelectff(url, selectId, keyName, selectedId = null) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const select = document.getElementById(selectId);
          select.innerHTML = '<option value="">All</option>';
          (data.results || data).forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item[keyName];
            if (selectedId && selectedId == item.id) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });
        });
    }
    function fillSelectf(url, selectId, keyName, selectedId = null, formatFunc = null) { 
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const select = document.getElementById(selectId);
          select.innerHTML = '<option value="">All</option>';
          (data.results || data).forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            const rawValue = item[keyName];
            opt.textContent = formatFunc ? formatFunc(rawValue) : rawValue;
            if (selectedId && selectedId == item.id) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });
        });
    }


// Load Doctor Filter Options
function loadDoctorFilter() {
  fillSelectf(DOCTOR, 'filterDoctor', 'doctor_name');
}


function loadTimeFilter() {
  fillSelectf(TIME, 'filterTime', 'name', null, formatTime12Hour);
}

   
    // Load Status Filter
    // function loadStatusFilter() {
    //   const appointment_Status = {
    //     // "Pending": "Pending",
    //     "Completed": "Visited",
    //   };
    //   let select = document.getElementById('filterStatus');
    //   select.innerHTML = '<option value="Visited">Visited</option>'; // Optional "All" option
    //   for (let key in appointment_Status) {
    //     let opt = document.createElement('option');
    //     opt.value = key;
    //     opt.textContent = appointment_Status[key];
    //     select.appendChild(opt);
    //   }
    // }
    function loadTypeFilter() {
      const appointment_Types = {
        "Online": "Online",
        "Offline": "Offline",
      };
      let select = document.getElementById('filterType');
      select.innerHTML = '<option value="">All</option>'; // Optional "All" option
      for (let key in appointment_Types) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.textContent = appointment_Types[key];
        select.appendChild(opt);
      }
    }
    function loadVersionFilter() {
      const appointment_Version = {
        "New": "New",
        "Old": "Old",
      };
      let select = document.getElementById('filterVersion');
      select.innerHTML = '<option value="">All</option>'; // Optional "All" option
      for (let key in appointment_Version) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.textContent = appointment_Version[key];
        select.appendChild(opt);
      }
    }
    
    // Render Appointment Table
    function renderAppointments() {
      // document.getElementById('fromDatee').value = '';
      // document.getElementById('toDatee').value = '';
      // const selectedDate = document.getElementById('filterDate').value;
      const selectedDoctor = document.getElementById('filterDoctor').value;
      const selectedTime = document.getElementById('filterTime').value; 
      // const selectedStatus = document.getElementById('filterStatus').value;
      const selectedType = document.getElementById('filterType').value;
      const selectedVersion = document.getElementById('filterVersion').value;
    
      fetch(API)
        .then(res => res.json())
        .then(data => {
          // Sort appointments by ascending ID
          data.sort((a, b) => a.id - b.id);
          const fromDate = document.getElementById("fromDatee").value;
          const toDate = document.getElementById("toDatee").value;

          let filtered = data;
          if (fromDate) {
            filtered = filtered.filter(a => a.appointment_date >= fromDate);
          }

          if (toDate) {
            filtered = filtered.filter(a => a.appointment_date <= toDate);
          }
          // if (selectedDate) {
          //   filtered = filtered.filter(a => a.appointment_date === selectedDate);
          // }
          if (selectedDoctor) {
            filtered = filtered.filter(a => a.doctor == selectedDoctor);
          }
          if (selectedTime) { 
            filtered = filtered.filter(a => a.time== selectedTime);
          } 
          // if (selectedStatus) {
          //   filtered = filtered.filter(a => a.appointment_Status == selectedStatus);
          // }
          if (selectedType) {
            filtered = filtered.filter(a => a.appointment_Types == selectedType);
          }
          if (selectedVersion) {
            filtered = filtered.filter(a => a.appointment_Version == selectedVersion);
          }
    
          let tbody = document.getElementById('appointmentTableBody');
          tbody.innerHTML = '';
          let total = 0;
          filtered.forEach((a, index) => {
            if(a.appointment_Status === "Completed"){

              tbody.innerHTML += `
                <tr>
                  <td>${a.id}</td>
                  <td>${a.patient_name}</td>
                  <td>${a.PatientID}</td>
                  <td>${a.appointment_Version}</td>
                  <td>${a.id}</td>
                  <td>${a.doctor_display}</td>
                  <td>${a.appointment_Types}</td>
                  <td>${a.phone_no}</td>
                  <td>${formatTime12Hour(a.time_display)}</td>
                  
  
                  <td>${a.total_amount} TK</td>
                  
                  
                </tr>
              `;
              total += parseFloat(a.total_amount);
            }
          });
          document.getElementById("totalAmountapp").textContent = total.toLocaleString();
        });
    }
    // <td><b>${a.appointment_Status === "Completed" ? "Visited" : a.appointment_Status}</b></td>
    function formatTime12Hour(timeStr) {
      if (!timeStr) return '';
      const [hour, minute] = timeStr.split(':');
      const h = parseInt(hour);
      const m = parseInt(minute);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour12 = ((h + 11) % 12 + 1); // converts 0-23 to 1-12
      return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
    }
    
    
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
}
function toFullTime(timeStr) {
  // If timeStr is already in HH:MM:SS, return it as-is
  if (timeStr.length === 8) return timeStr;

  // Convert "HH:MM" → "HH:MM:00"
  return timeStr + ":00";
} 
function toHourMinute(timeStr) {
  // Assumes format is "HH:MM:SS"
  return timeStr.slice(0, 5);
}




    // Set default filter to today
    // function setDefaultDate() {
    //   const today = new Date().toISOString().split('T')[0];
    //   document.getElementById('filterDate').value = '';
    // }
    

   
    
   
    
    // Load Everything
    window.onload = () => {
      // setDefaultDate();
      loadDoctorFilter();
      loadTimeFilter();
      // loadStatusFilter();
      loadTypeFilter();
      loadVersionFilter();
      renderAppointments();
      
      // fillSelect(DOCTOR, document.querySelector('#addForm [name="doctor"]'));
      // fillSelect(TIME, document.querySelector('#addForm [name="time"]'));
      // fillSelect(DOCTOR, document.querySelector('#editForm [name="doctor"]'));
      // fillSelect(TIME, document.querySelector('#editForm [name="time"]'));
    };
    
    
    // Change Label for Filter Date
    // function updateLabel() {
    //   const filterDate = document.getElementById('filterDate');
    //   const label = document.getElementById('filterDateLabel');
    //   if (filterDate.value) {
    //     label.textContent = "Date";
    //   } else {
    //     label.textContent = "Today";
    //   }
    // }
    // updateLabel();