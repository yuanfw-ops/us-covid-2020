mapboxgl.accessToken =
  'pk.eyJ1IjoieXVhbmZ3MiIsImEiOiJjbWlqZ3RqZG0wb21iM2Vwd2ViNTI0NXozIn0.ubgQRn7GzHQFL4W6LoQDQw';

let map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-98, 38], // starting position [lng, lat]
  zoom: 3, // starting zoom
  projection: 'albers' // display the map in Albers USA projection
});

async function geojsonFetch() {
    let response = await fetch('assets/covid_rates.geojson');
    let us_data = await response.json();

    map.on('load', function loadingData() {
        map.addSource('covid_rates', {
            type: 'geojson',
            data: us_data
        });

        map.addLayer({
            'id': 'us_data_layer',
            'type': 'fill',
            'source': 'covid_rates',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0', 
                    10,          
                    '#FED976', 
                    20,         
                    '#FEB24C',  
                    50,         
                    '#FD8D3C', 
                    100,         
                    '#FC4E2A', 
                    200,        
                    '#E31A1C',  
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-9',
            '10-19',
            '20-49',
            '50-99',
            '100-199',
            '200 or more'
        ];
        const colors = [
            '#FFEDA0',
            '#FED976',
            '#FEB24C',
            '#FD8D3C',
            '#FC4E2A',
            '#E31A1C'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Covid Rates<br>(cases per 100k people)</b><br><br>";


        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.display = 'inline-block';
            key.style.width = '12px';
            key.style.height = '12px';
            key.style.marginRight = '8px';
            key.style.border = '1px solid #999';
            key.style.verticalAlign = 'middle';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });

// Clicking on map features to display info
    map.on('click', 'us_data_layer', (e) => {
    const f = e.features[0];
    const county = f.properties.county || f.properties.name || 'Unknown';
    const rate = f.properties.rates;

    new mapboxgl.Popup({ closeButton: true, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(
        `<strong>County:</strong> ${county}<br/>` +
        `<strong>Rate:</strong> ${rate} cases per 100k`
        )
        .addTo(map);
    });
}
geojsonFetch();
