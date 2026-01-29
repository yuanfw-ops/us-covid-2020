mapboxgl.accessToken =
  'pk.eyJ1IjoieXVhbmZ3MiIsImEiOiJjbWlqZ3RqZG0wb21iM2Vwd2ViNTI0NXozIn0.ubgQRn7GzHQFL4W6LoQDQw';

let map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-98, 38], // starting position [lng, lat]
  zoom: 3, // starting zoom
  projection: 'albers' // display the map in Albers USA projection
});

const grades = [500, 1500, 2500, 5000, 10000], 
      colors = ['#ffffff', '#fde0dd', '#fcbba1', '#de2d26', '#7f0000'],
      radii = [5, 15, 20, 25, 30, 35];

map.on('load', () => {
  map.addSource('covid_counts', {
    type: 'geojson',
    data: 'assets/covid_counts.geojson'
  });

  map.addLayer({
    id: 'covid_counts-point',
    type: 'circle',
    source: 'covid_counts',
    'paint': {
    // increase the radii of the circle as the zoom level and dbh value increases
        'circle-radius': {
            'property': 'cases',
            'stops': [
                [grades[0], radii[0]],
                [grades[1], radii[1]],
                [grades[2], radii[2]],
                [grades[3], radii[3]],
                [grades[4], radii[4]]
            ]
        },
        'circle-color': {
            'property': 'cases',
            'stops': [
                [grades[0], colors[0]],
                [grades[1], colors[1]],
                [grades[2], colors[2]],
                [grades[3], colors[3]],
                [grades[4], colors[4]]
            ]
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.6
    }
  });
  map.on('click', 'covid_counts-point', (event) => {
      new mapboxgl.Popup()
          .setLngLat(event.features[0].geometry.coordinates)
          .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br/><strong>Total Cases:</strong> ${event.features[0].properties.cases}`)
          .addTo(map);
  });
});

// create legend object, it will anchor to the div element with the id legend.
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Size</strong>'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radius = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
        'px; height: ' +
        dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
        '</span></p>');

}

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';

// combine all the html codes.
legend.innerHTML = labels.join('') + source;

