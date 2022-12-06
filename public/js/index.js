// The API Key is restricted to JSFiddle website
// Get your own API Key on https://myprojects.geoapify.com
const myAPIKey = "6dc7fb95a3b246cfa0f3bcef5ce9ed9a";

// get a city with Geoapify Geocoding API - https://www.geoapify.com/geocoding-api
const city = "Paris, France";
document.getElementById('city').innerHTML = city;

// query places by categories. Find the complete list of the categories on https://apidocs.geoapify.com/docs/places/#categories
const placeCategory = "commercial.books";
document.getElementById('category').innerHTML = placeCategory;

let stopped = false;
let results;

document.getElementById('button').onclick = function() {
  const state = document.getElementById('button').value;
  if (state === "Start") {
  	document.getElementById('button').value = "Stop";
    getCityData(city, myAPIKey).then((cityData) => {
      if (cityData) {
        getAllPlaces(placeCategory, cityData.place_id, myAPIKey).then((places) => {
        	results = places;
          document.getElementById('button').value = "Download results";
        });
      } else {
        console.log("The city is not found");
      }
    })
  } else if (state === "Stop") {
  	stopped = true;
  } else {
  	// Download results
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(results)], {'type':'application\/json'});
    a.href = window.URL.createObjectURL(blob);
    a.download = `${placeCategory}-${city}-${(new Date()).toUTCString()}.json`;
    a.click();
  }
}


function getCityData(city, apiKey) {
  return fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&format=json&apiKey=${myAPIKey}`).then(data => data.json()).then(results => {
    const cityData = results.results.length ? results.results[0] : null;
    return cityData;
  });
}


function getAllPlaces(category, cityId, apiKey) {
  return getPlacesRecursively([], 0, category, cityId, apiKey);
}

// one Places API request returns maximum of 500 objects, so it may require making several API calls to get all the places
function getPlacesRecursively(foundPlaces, offset, category, cityId, apiKey) {
  // Set the maximal number of Places returned within one API call. Note more significant limit number will require a more significant processing time.
  const limit = 20;
  return fetch(`https://api.geoapify.com/v2/places?categories=${category}&filter=place:${cityId}&limit=${limit}&apiKey=${apiKey}&offset=${offset}`).then(data => data.json()).then(places => {
    // Geoapify Places API returns a GeoJSON FeatureCollection object as a result. Let's collect only properties.
    foundPlaces.push(...places.features.map(feature => feature.properties));

    console.log(`${foundPlaces.length} places found`);

    if (places.features.length === 0 || stopped) {
      return foundPlaces;
    } else {
      // get the next page
      return getPlacesRecursively(foundPlaces, offset + limit, category, cityId, apiKey);
    }
  });
}