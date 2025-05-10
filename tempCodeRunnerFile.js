async function fetchAppointments() {
  try {
    const res = await fetch('http://127.0.0.1:8000/appointment/list/');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const appointments = await res.json();

    appointments.forEach((appointment, index) => {
      console.log(`Appointment ${index + 1} ID:`, appointment.id);
    });
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
  }
}

fetchAppointments();