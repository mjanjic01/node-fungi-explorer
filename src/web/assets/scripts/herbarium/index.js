import Vue from 'vue';
import App from './App.vue';

const $mountEl = document.querySelector('#app');

if ($mountEl) {
  const herbariums = JSON.parse($mountEl.getAttribute('data'));
  new Vue({
    el: $mountEl,
    components: {
      app: App,
    },
    render(h) {
      return h('app', {
        props: {
          herbariums
        }
      });
    }
  });
}
