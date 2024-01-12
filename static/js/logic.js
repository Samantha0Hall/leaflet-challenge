// Link to GEOJSON data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request to the query URL then log
d3.json(link).then(function (data) {
  console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

// Define the colors
function chooseColor(depth){
    if (depth < 10) return "#8bf545";
    else if (depth < 30) return "#b9f294";
    else if (depth < 50) return "#edda47";
    else if (depth < 70) return "##fac761";
    else if (depth < 90) return "#de8559";
    else return "#e35752";
  }
}

// Create popup that describes the place and time of the earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

// Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

// Point to layer used to alter markers
    pointToLayer: function(feature, latlng) {

// Determine style markers based on properties
      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 1
      }
      return L.circle(latlng,markers);
    }
  });

  createMap(earthquakes);

function createMap(earthquakes) {
// Create the base layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
// Create a baseMaps object
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
// Create an overlay object
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
// Create map with streetmap and earthquakes layers
    var myMap = L.map("map", {
      center: [39.7392, 104.9903],
      zoom: 7,
      layers: [street, earthquakes]
    });
  
// Create layer control.
    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);
  }