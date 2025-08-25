# GroomerGo: User Flows

This document outlines the primary user flows for the GroomerGo application.

### Flow 1: Groomer Starts a Job

**Actor:** Groomer

**Goal:** To navigate to the next client's house and notify them automatically.

1.  **Open App:** The groomer opens the GroomerGo app at the start of their day.
2.  **View Dashboard:** The groomer is presented with the Dashboard, which shows a map with pins for all of today's appointments and a corresponding list of appointments.
3.  **Select Appointment:** The groomer taps on the next appointment in the list (e.g., "Jane Doe, 10:00 AM").
4.  **View Details:** The selected appointment is highlighted on the list and on the map. A "Start Travel" button appears.
5.  **Start Travel:** The groomer taps the "Start Travel" button.
    -   **System Action:** The groomer's status is updated to "En Route".
    -   **System Action:** Their live location sharing is activated for the client of this specific appointment.
    -   **System Action:** The client automatically receives a notification with a link to the tracking page.
6.  **Navigate:** The groomer uses their preferred navigation app to travel to the client's address.
7.  **Arrive:** Upon arrival, the groomer taps an "Arrived" button in the app.
    -   **System Action:** The groomer's status is updated to "Arrived".
    -   **System Action:** Live location sharing is deactivated for the client. The client's tracking page now shows an "Arrived" status.

---

### Flow 2: Client Tracks Groomer's Arrival

**Actor:** Client (Pet Owner)

**Goal:** To see the groomer's location and know when they will arrive.

1.  **Receive Link:** The client receives a notification (e.g., SMS or push notification) containing a unique, secure link. The notification says something like, "Your GroomerGo groomer is on the way! Track their arrival here: [link]".
2.  **Open Tracking Page:** The client taps the link, which opens a simple web page in their mobile browser.
3.  **View Map:** The page displays a map showing:
    -   An icon for their home address.
    -   A moving icon representing the groomer's vehicle.
    -   A line indicating the route.
4.  **Check Status:** Below the map, the client can see:
    -   **Groomer's Status:** "On the way!"
    -   **Estimated Time of Arrival (ETA):** "Arriving in approx. 12 minutes."
5.  **Groomer Arrives:** When the groomer arrives, the map view updates. The groomer icon is now at the client's home location, and the status changes to "Your groomer has arrived!". The ETA disappears.