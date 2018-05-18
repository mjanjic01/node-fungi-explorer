import $ from 'jquery';
import mapboxgl from 'mapbox-gl';

const coordinates = {
  lng: 15.9709069,
  lat: 45.8007152
};
const $map = $('.js-fungi-map');

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

if ($map.length) {
  const locations = $map.data('locations') || [];
  const map = new mapboxgl.Map({
    container: $map[0],
    style: 'mapbox://styles/mapbox/outdoors-v10',
    zoom: 7.5,
    center: coordinates
  });

  locations.forEach(({ longitude, latitude }) => {
    const marker = new mapboxgl.Marker()
      .setLngLat({
        lng: longitude,
        lat: latitude,
      })
      .addTo(map);
  });
}
