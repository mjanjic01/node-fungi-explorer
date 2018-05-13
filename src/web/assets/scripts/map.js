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

      $lonInput.value = lngLat.lat;
      $latInput.value = lngLat.lng;

      marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .addTo(map);
    });
}
