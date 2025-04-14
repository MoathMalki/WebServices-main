# Assignment 1 - Web Services Technologies

**Team Members:**
- Rami Rimawi (1211583)
- Moath Mouadi (1210225)
- Ahmad Ewidat (1212596)

## 🔍 Description
This React app consumes the [Foursquare Places API](https://docs.foursquare.com/developer/reference/place-search) to search for nearby places (cafés, restaurants, resorts) based on user's current location or a default one and https://opencagedata.com/api
## 🚀 How to Run
1. Clone the repo.
2. Run `npm install`
3. Replace `"YOUR_API_KEY_HERE"` in `src/App.js` with your real API key from Foursquare.
4. Run `npm start` to launch the app.

## Features

- **Search for Nearby Places**: Users can enter a location (city or area) and search for places such as cafes, restaurants, and resorts in that area.
- **Map View**: The application integrates a map (using React-Leaflet) that updates with the search results and shows markers for each place.
- **Favorites**: Users can mark places as favorites, and view them later in the "Favorites" page.
- **Place Details**: Displays additional information about each place such as name, category, and formatted address.
- **Responsive UI**: The app is designed to be responsive and works well on both desktop and mobile devices.

## Technologies Used

This project uses a variety of technologies and tools to build the web application:

- **React**: A frontend JavaScript library for building user interfaces.
- **React Router**: For handling navigation between pages (Home page and Favorites page).
- **Leaflet**: A library for displaying interactive maps and adding markers to them.
- **Axios**: A library for making HTTP requests to fetch data from APIs.
- **Foursquare API**: Used to search and retrieve details of nearby places (cafes, restaurants, resorts, etc.).
- **OpenCage Geocoding API**: API for converting place names into geographic coordinates (latitude and longitude).

Enjoy exploring nearby places!
