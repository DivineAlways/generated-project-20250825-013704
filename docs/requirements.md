# GroomerGo: Requirements

## 1. Functional Requirements

| ID   | Role    | Requirement                                                                   | Priority |
|------|---------|-------------------------------------------------------------------------------|----------|
| FR-1 | Groomer | Must be able to see a list of all appointments scheduled for the current day. | High     |
| FR-2 | Groomer | Must be able to see all appointment locations as pins on a map interface.       | High     |
| FR-3 | Groomer | Must be able to select an appointment from the list or map to view details.   | High     |
| FR-4 | Groomer | Must be able to update their status (e.g., "Start Travel", "Arrive", "Complete"). | High     |
| FR-5 | Client  | Must be able to view a map showing the groomer's current location.             | High     |
| FR-6 | Client  | Must be able to see their own location (house) on the tracking map.             | High     |
| FR-7 | Client  | Must be able to see the groomer's current status (e.g., "On the way").          | High     |
| FR-8 | Client  | Must be able to see an estimated time of arrival (ETA).                       | Medium   |

## 2. Non-Functional Requirements

| ID    | Category      | Requirement                                                                                                   |
|-------|---------------|---------------------------------------------------------------------------------------------------------------|
| NFR-1 | UI/UX         | The application must have a dark theme with a purple primary color (`#2C2A4A`) and yellow accents (`#FFC857`).  |
| NFR-2 | Performance   | The application must load quickly and animations (like map tracking) should be smooth on mobile devices.      |
| NFR-3 | Usability     | The interface must be intuitive and require minimal training for both groomers and clients.                  |
| NFR-4 | Compatibility | The prototype must render correctly on modern web browsers (Chrome, Firefox, Safari).                           |
| NFR-5 | Design        | The application must be mobile-first and responsive to various screen sizes.                                |

## 3. Data Requirements

-   **Appointment Data:**
    -   `appointmentId`: Unique identifier
    -   `clientName`: Full name of the client
    -   `clientAddress`: Full address for mapping
    -   `clientLocation`: Geographic coordinates {lat, lon}
    -   `dogName`: Name of the pet
    -   `serviceType`: e.g., "Full Groom", "Bath & Tidy"
    -   `appointmentTime`: Scheduled time (e.g., "10:00 AM")
    -   `status`: e.g., "Pending", "En Route", "Arrived", "In Progress", "Completed"
-   **Groomer Data:**
    -   `groomerId`: Unique identifier
    -   `currentLocation`: Live geographic coordinates {lat, lon}
    -   `currentStatus`: e.g., "Idle", "Traveling to next appointment"