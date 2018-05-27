<script>
  import draggable from 'vuedraggable'

  import BootstrapTable from 'herbarium/components/BootstrapTable.vue';
  import BootstrapPagination from 'herbarium/components/BootstrapPagination.vue';
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
      'bootstrap-pagination': BootstrapPagination,
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
        return this.herbariums.filter((herbarium) => {
          const sanitizedQuery = this.searchQuery.trim().toLowerCase();
          return herbarium.name.toLowerCase().includes(sanitizedQuery);
        })
      },
      displayHerbariums() {
        return this.filteredHerbariums.slice(this.tableStart, this.tableStep * this.currentPage);
      },
      pageCount() {
        return Math.ceil(this.filteredHerbariums.length / this.tableStep);
      },
      currentPage() {
        return Math.ceil(this.tableStart / this.tableStep) + 1;
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
      onPageClick(page) {
        this.tableStart = (page - 1) * this.tableStep;
      },
      onHerbariumModified(herbarium) {
        if (this.modifiedHerbariumIds.indexOf(herbarium.id) === -1) {
          this.modifiedHerbariumIds.push(herbarium.id);
        }
      },
      onHerbariumChangesSubmitClick() {
        apiService.updateHerbariums(this.herbariums.filter((herbarium) => {
          return this.modifiedHerbariumIds.indexOf(herbarium.id) !== -1;
        })).then(() => {
          this.modifiedHerbariumIds = [];
        });
      }
    },
    data() {
      return {
        PANE_LOCATIONS,
        searchQuery: '',
        tableStart: 0,
        tableStep: 5,
        selectedHerbariumLeft: null,
        selectedHerbariumRight: null,
        modifiedHerbariumIds: []
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
          v-for="herbarium in displayHerbariums"
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

    bootstrap-pagination(
      :pages="pageCount"
      :activePage="currentPage"
      @click:page="onPageClick"
    )

    .row
      .col-6
        herbarium-pane(
          v-if="selectedHerbariumLeft"
          :herbarium="selectedHerbariumLeft"
          @change:herbarium="onHerbariumModified"
        )
      .col-6
        herbarium-pane(
          v-if="selectedHerbariumRight"
          :herbarium="selectedHerbariumRight"
          @change:herbarium="onHerbariumModified"
        )

      .col-12
        button.btn.btn-primary.mt-2.w-100(
          v-if="modifiedHerbariumIds.length"
          @click="onHerbariumChangesSubmitClick"
        ) Pohrani promjene

</template>

<style scoped lang="scss">
</style>
