document.addEventListener('DOMContentLoaded', () => {
    const groomerView = document.getElementById('groomerView');
    const clientView = document.getElementById('clientView');
    const groomerToggle = document.getElementById('groomerToggle');
    const clientToggle = document.getElementById('clientToggle');

    let appData = {};
    let travelInterval = null;

    function switchView(view) {
        if (view === 'groomer') {
            groomerView.classList.add('active');
            clientView.classList.remove('active');
            groomerToggle.classList.add('active');
            clientToggle.classList.remove('active');
            renderGroomerView();
        } else {
            clientView.classList.add('active');
            groomerView.classList.remove('active');
            clientToggle.classList.add('active');
            groomerToggle.classList.remove('active');
            renderClientView();
        }
    }

    groomerToggle.addEventListener('click', () => switchView('groomer'));
    clientToggle.addEventListener('click', () => switchView('client'));

    async function fetchData() {
        try {
            const response = await fetch('./assets/dummy-data.json');
            appData = await response.json();
            // Deep copy for reset functionality
            appData.initial = JSON.parse(JSON.stringify(appData));
            switchView('groomer');
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    }

    // --- Groomer View Logic ---
    function renderGroomerView() {
        renderMapPins();
        renderAppointmentList();
    }

    function getRelativePosition(lat, lon) {
        // Simple mapping of lat/lon to percentage-based coordinates for the mock map
        // This is a crude approximation and not geographically accurate.
        const mapBounds = { minLat: 34.00, maxLat: 34.10, minLon: -118.40, maxLon: -118.20 };
        const top = 100 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat) * 100);
        const left = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon) * 100);
        return { top: `${top}%`, left: `${left}%` };
    }

    function renderMapPins() {
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = ''; // Clear existing pins
        appData.appointments.forEach(appt => {
            const pin = document.createElement('div');
            pin.className = 'map-pin';
            pin.dataset.id = appt.id;
            const pos = getRelativePosition(appt.location.lat, appt.location.lon);
            pin.style.top = pos.top;
            pin.style.left = pos.left;
            if (appt.id === appData.groomer.activeAppointmentId) {
                pin.classList.add('selected');
            }
            pin.addEventListener('click', () => selectAppointment(appt.id));
            mapContainer.appendChild(pin);
        });
    }

    function renderAppointmentList() {
        const listContainer = document.getElementById('appointment-list');
        listContainer.innerHTML = '';
        appData.appointments.forEach(appt => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.dataset.id = appt.id;
            if (appt.id === appData.groomer.activeAppointmentId) {
                card.classList.add('selected');
            }
            card.innerHTML = `
                <h3>${appt.time} - ${appt.clientName}</h3>
                <p><strong>Dog:</strong> ${appt.dogName} | <strong>Service:</strong> ${appt.service}</p>
                <p>${appt.address}</p>
            `;
            card.addEventListener('click', () => selectAppointment(appt.id));
            listContainer.appendChild(card);
        });

        const selectedAppointment = appData.appointments.find(a => a.id === appData.groomer.activeAppointmentId);
        const actionButtonContainer = document.createElement('div');
        actionButtonContainer.id = 'action-button-container';
        listContainer.appendChild(actionButtonContainer);
        renderActionButton(selectedAppointment);
    }
    
    function renderActionButton(appointment) {
        const container = document.getElementById('action-button-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (!appointment) return;

        const button = document.createElement('button');
        button.className = 'action-button';
        
        if (appData.groomer.status === 'Idle') {
            button.textContent = 'Start Travel';
            button.onclick = () => startTravel(appointment.id);
        } else if (appData.groomer.status === 'En Route' && appData.groomer.activeAppointmentId === appointment.id) {
            button.textContent = 'Arrived';
            button.onclick = () => arriveAtDestination(appointment.id);
        } else {
             button.textContent = 'Trip in Progress';
             button.disabled = true;
        }

        container.appendChild(button);
    }

    function selectAppointment(id) {
        if (appData.groomer.status === 'En Route') return; // Cannot select while traveling
        appData.groomer.activeAppointmentId = id;
        renderGroomerView();
    }

    function startTravel(id) {
        appData.groomer.status = 'En Route';
        const appointment = appData.appointments.find(a => a.id === id);
        appointment.status = 'En Route';
        
        // Start simulation
        const destination = appointment.location;
        const start = appData.groomer.currentLocation;
        const totalSteps = 20; // 20 seconds to "arrive"
        let currentStep = 0;

        travelInterval = setInterval(() => {
            currentStep++;
            if (currentStep >= totalSteps) {
                arriveAtDestination(id);
                return;
            }
            // Linear interpolation for simulation
            const newLat = start.lat + (destination.lat - start.lat) * (currentStep / totalSteps);
            const newLon = start.lon + (destination.lon - start.lon) * (currentStep / totalSteps);
            appData.groomer.currentLocation = { lat: newLat, lon: newLon };
            
            if(clientView.classList.contains('active')) {
                updateClientGroomerPosition();
            }
        }, 1000);
        
        renderGroomerView();
    }
    
    function arriveAtDestination(id) {
        clearInterval(travelInterval);
        travelInterval = null;

        const appointment = appData.appointments.find(a => a.id === id);
        appData.groomer.status = 'Arrived';
        appData.groomer.currentLocation = appointment.location;
        appointment.status = 'Arrived';

        // In a real app, you'd move to the next state. Here we reset for demo.
        setTimeout(() => {
             appData = JSON.parse(JSON.stringify(appData.initial));
             renderGroomerView();
             if (clientView.classList.contains('active')) renderClientView();
        }, 3000);

        renderGroomerView();
        if (clientView.classList.contains('active')) renderClientView();
    }

    // --- Client View Logic ---
    function renderClientView() {
        const clientMap = document.getElementById('client-map-container');
        const statusArea = document.getElementById('client-status-area');
        clientMap.innerHTML = '';
        
        const activeAppointment = appData.appointments.find(a => a.id === appData.groomer.activeAppointmentId);

        if (!activeAppointment || appData.groomer.status === 'Idle') {
            statusArea.innerHTML = `<h2>Waiting for Groomer</h2><p>Your groomer has not started their trip yet.</p>`;
            return;
        }

        // Render home and groomer icons
        const homeIcon = document.createElement('div');
        homeIcon.className = 'client-map-icon';
        homeIcon.id = 'home-icon';
        homeIcon.innerHTML = '🏠';
        const homePos = getRelativePosition(activeAppointment.location.lat, activeAppointment.location.lon);
        homeIcon.style.top = homePos.top;
        homeIcon.style.left = homePos.left;
        clientMap.appendChild(homeIcon);

        const groomerIcon = document.createElement('div');
        groomerIcon.className = 'client-map-icon';
        groomerIcon.id = 'groomer-icon';
        groomerIcon.innerHTML = '🚐';
        clientMap.appendChild(groomerIcon);
        
        updateClientGroomerPosition();
        updateClientStatus();
    }
    
    function updateClientGroomerPosition() {
        const groomerIcon = document.getElementById('groomer-icon');
        if (groomerIcon) {
            const groomerPos = getRelativePosition(appData.groomer.currentLocation.lat, appData.groomer.currentLocation.lon);
            groomerIcon.style.top = groomerPos.top;
            groomerIcon.style.left = groomerPos.left;
        }
    }

    function updateClientStatus() {
        const statusArea = document.getElementById('client-status-area');
        if (!statusArea) return;

        if (appData.groomer.status === 'En Route') {
             statusArea.innerHTML = `<h2>Your groomer is on the way!</h2><p>Estimated Arrival: <strong>~10 Mins</strong></p>`;
        } else if (appData.groomer.status === 'Arrived') {
             statusArea.innerHTML = `<h2>Your groomer has arrived!</h2>`;
        }
    }

    fetchData();
});