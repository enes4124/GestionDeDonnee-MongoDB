let nancyCoordinates = [48.692054, 6.184417];

var map = L.map("map").setView(nancyCoordinates, 13);

// map a la taille de la fenetre
map.invalidateSize();

// icon parking
var parkingIcon = L.icon({
  iconUrl:
    "https://cdn.discordapp.com/attachments/1049705107081662535/1069741390663266395/parking-location.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [35, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [35, 35],
});
// icon velo
var veloIcon = L.icon({
  iconUrl:
    "https://cdn.discordapp.com/attachments/1049705107081662535/1069740802345021552/bicycle-pin.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [40, 40],
});
// icon bus
var busIcon = L.icon({
  iconUrl:
    "https://cdn.discordapp.com/attachments/1049705107081662535/1069741909725171802/bus-stop-pointer.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [40, 40],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function getMarkerParking() {
  fetch("/parking/features")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        L.marker([element.geometry.y, element.geometry.x], {
          icon: parkingIcon,
        })
          .bindPopup(element.attributes.NOM)
          .addTo(map);
      });
    })
    .catch((error) => console.error(error));
}

function getMarkerBike() {
  fetch("/bike")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        L.marker([element.lat, element.lon], { icon: veloIcon })
          .bindPopup(element.name)
          .addTo(map);
      });
    })
    .catch((error) => console.error(error));
}

function getMarkerBus() {
  fetch("/bus")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        let lat = element.geometry.coordinates[1];
        let lon = element.geometry.coordinates[0];

        if (typeof lat !== "object" && typeof lon !== "object") {
          L.marker(
            [element.geometry.coordinates[1], element.geometry.coordinates[0]],
            {
              icon: busIcon,
            }
          )
            .bindPopup(element.properties.name)
            .addTo(map);
        } 
        // else {
        //   let coo = element.geometry.coordinates;
        //   coo.forEach((data) => {
        //     L.marker([data[1], data[0]], {
        //       icon: busIcon,
        //     })
        //       .bindPopup(element.properties.route_long_name)
        //       .addTo(map);
        //   });
        // }
        // par raison de performance on affiche pas les bus qui font plusieurs arrêts
      });
    })
    .catch((error) => console.error(error));
}

getMarkerParking();
getMarkerBike();
getMarkerBus();
