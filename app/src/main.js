let nancyCoordinates = [48.692054, 6.184417];

var map = L.map('map').setView(nancyCoordinates, 13)

// map a la taille de la fenetre
map.invalidateSize();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);

function getMarker() {
    return fetch('/nancy/features')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(element => {
                L.marker([element.geometry.y, element.geometry.x]).bindPopup(element.attributes.NOM).addTo(map);
            });
        })
        .catch(error => console.error(error));
}

getMarker();