
const doctorListURL = 'http://127.0.0.1:8000/doctor/list/';
const appointmentListURL = 'http://127.0.0.1:8000/appointment/list/';
const userListURL = 'http://127.0.0.1:8000/users/';

async function loadDashboardStats() {
    try {
        // Total Doctor
        const doctorRes = await fetch(doctorListURL);
        const doctorData = await doctorRes.json();
        document.getElementById("TotalDoctor").innerText = doctorData.count;

        // Total Appointment, Online, Offline
        const appointmentRes = await fetch(appointmentListURL);
        const appointmentData = await appointmentRes.json();

        const totalAppointments = appointmentData.length;
        const onlineAppointments = appointmentData.filter(a => a.appointment_Types === "Online").length;
        const offlineAppointments = appointmentData.filter(a => a.appointment_Types === "Offline").length;

        document.getElementById("TotalAppointment").innerText = totalAppointments;
        document.getElementById("OnlineAppointment").innerText = onlineAppointments;
        document.getElementById("OfflineAppointment").innerText = offlineAppointments;

        // Total User
        const userRes = await fetch(userListURL);
        const userData = await userRes.json();
        document.getElementById("TotalUser").innerText = userData.length;
    } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        document.querySelectorAll('#TotalDoctor, #TotalAppointment, #OnlineAppointment, #OfflineAppointment, #TotalUser')
            .forEach(el => el.innerText = 'Error');
    }
}

// Call on page load
window.onload = loadDashboardStats;

