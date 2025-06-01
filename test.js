async function fetchAppointments() {
  try {
    const res = await fetch('https://hospital-wine-alpha.vercel.app/appointment/list/');
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
