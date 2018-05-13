import mapboxgl from 'mapbox-gl';

const coordinates = [15.9709069, 45.8007152];
const $map = document.querySelector('.js-observation-map');

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: $map,
  style: 'mapbox://styles/mapbox/outdoors-v10',
  zoom: 7.5,
  center: coordinates
});

map
  .on('click', ({ lngLat }) => {
    const marker = new mapboxgl.Marker()
    .setLngLat(lngLat)
    .addTo(map);
  });

