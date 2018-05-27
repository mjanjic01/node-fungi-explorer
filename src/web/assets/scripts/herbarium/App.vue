<script>
  import draggable from 'vuedraggable'

  import BootstrapTable from 'herbarium/components/BootstrapTable.vue';
  import HerbariumPane from 'herbarium/components/HerbariumPane.vue';

  import apiService from 'herbarium/services/api';

  const PANE_LOCATIONS = {
    left: Symbol('left'),
    right: Symbol('right')
  };

  export default {
    components: {
      draggable,
      'bootstrap-table': BootstrapTable,
      'herbarium-pane': HerbariumPane,
    },
    props: {
      herbariums: {
        type: Array,
        required: true,
      }
    },
    computed: {
      filteredHerbariums() {
        return this.herbariums.filter((h) => {
          const sanitizedQuery = this.searchQuery.trim().toLowerCase();
          return h.name.toLowerCase().includes(sanitizedQuery);
        })
      }
    },
    methods: {
      onOpenClick(location, herbarium) {
        switch(location) {
          case this.PANE_LOCATIONS.left:
            if (this.selectedHerbariumRight === herbarium) {
              this.selectedHerbariumRight = this.selectedHerbariumLeft;
            }

            this.selectedHerbariumLeft = herbarium;
            break;
          case this.PANE_LOCATIONS.right:
            if (this.selectedHerbariumLeft === herbarium) {
              this.selectedHerbariumLeft = this.selectedHerbariumRight;
            }

            this.selectedHerbariumRight = herbarium;
            break;
        }
      },
      onHerbariumFormSubmit(herbarium) {
        apiService.updateHerbarium(herbarium);
      }
    },
    data() {
      return {
        PANE_LOCATIONS,
        searchQuery: '',
        selectedHerbariumLeft: null,
        selectedHerbariumRight: null
       }
    },
  }
</script>

<template lang="pug">
  div
    input.form-control.form-control-sm(
      type="search"
      placeholder="Pretraživanje"
      v-model="searchQuery"
    )
    bootstrap-table
      template(slot="header")
        tr
          th(scope="col") Naziv
          th(scope="col") Opis
          th(scope="col") Vidljivost
          th.text-right(scope="col") Broj zapažanja
          th(scope="col")
      template(slot="body")
        tr(
          v-for="herbarium in filteredHerbariums"
          :key="herbarium.id"
        )
          td {{herbarium.name}}
          td {{herbarium.description}}
          td {{herbarium.isPrivate ? 'Privatan' : 'Javan'}}
          td.text-right {{herbarium.observations.length}}
          td
            button.btn.btn-primary.rounded-0(
              @click="onOpenClick(PANE_LOCATIONS.left, herbarium)"
            ) ◀
            button.btn.btn-primary.rounded-0(
              @click="onOpenClick(PANE_LOCATIONS.right, herbarium)"
            ) ▶


    .row
      .col-6
        herbarium-pane(
          v-if="selectedHerbariumLeft"
          :herbarium="selectedHerbariumLeft"
          @submit:form="onHerbariumFormSubmit"
        )
      .col-6
        herbarium-pane(
          v-if="selectedHerbariumRight"
          :herbarium="selectedHerbariumRight"
          @submit:form="onHerbariumFormSubmit"
        )
</template>

<style lang="scss">
  .my-rule {
    color: red;
  }
</style>
