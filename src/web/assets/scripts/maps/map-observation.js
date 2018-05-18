import mapboxgl from 'mapbox-gl';

const coordinates = {
  lng: 15.9709069,
  lat: 45.8007152
};
const $map = document.querySelector('.js-observation-map');
const $lonInput = document.querySelector('.js-observation-lon');
const $latInput = document.querySelector('.js-observation-lat');

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

if ($map) {
  const map = new mapboxgl.Map({
    container: $map,
    style: 'mapbox://styles/mapbox/outdoors-v10',
    zoom: 7.5,
    center: coordinates
  });

  let marker;
  map
    .on('click', ({ lngLat }) => {
      if (marker) {
        marker.remove();
      }

      $lonInput.value = lngLat.lng;
      $latInput.value = lngLat.lat;

      marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .addTo(map);
    });

  if ($lonInput.value && $latInput.value) {
    marker = new mapboxgl.Marker()
      .setLngLat({
        lng: $lonInput.value,
        lat: $latInput.value,
      })
      .addTo(map);
  }
}
