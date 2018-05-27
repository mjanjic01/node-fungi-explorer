import Vue from 'vue';
import VeeValidate from 'vee-validate';
import App from './App.vue';


const $mountEl = document.querySelector('#app');

if ($mountEl) {
  const herbariums = JSON.parse($mountEl.getAttribute('data-herbariums'));
  const herbariumTypes = JSON.parse($mountEl.getAttribute('data-types'));

  Vue.use(VeeValidate);
  new Vue({
    el: $mountEl,
    components: {
      app: App,
    },
    render(h) {
      return h('app', {
        props: {
          herbariums,
          herbariumTypes,
        }
      });
    }
  });
}
