<script>
  import draggable from 'vuedraggable'

  import BootstrapTable from 'herbarium/components/BootstrapTable.vue';
  import BootstrapPagination from 'herbarium/components/BootstrapPagination.vue';
  import BootstrapModal from 'herbarium/components/BootstrapModal.vue';
  import BootstrapToast from 'herbarium/components/BootstrapToast.vue';
  import HerbariumPane from 'herbarium/components/HerbariumPane.vue';

  import HerbariumForm from 'herbarium/components/forms/HerbariumForm.vue';

  import apiService from 'herbarium/services/api';

  const PANE_LOCATIONS = {
    left: Symbol('left'),
    right: Symbol('right')
  };

  export default {
    components: {
      draggable,
      'bootstrap-table': BootstrapTable,
      'bootstrap-toast': BootstrapToast,
      'bootstrap-modal': BootstrapModal,
      'bootstrap-pagination': BootstrapPagination,
      'herbarium-pane': HerbariumPane,
      'herbarium-form': HerbariumForm,
    },
    props: {
      herbariums: {
        type: Array,
        required: true,
      },
      herbariumTypes: {
        type: Array,
        required: true,
      }
    },
    computed: {
      filteredHerbariums() {
        return this.herbariumsList.filter((herbarium) => {
          const sanitizedQuery = this.searchQuery.trim().toLowerCase();
          return herbarium.name.toLowerCase().includes(sanitizedQuery) ||
            herbarium.description.toLowerCase().includes(sanitizedQuery) ||
            (herbarium.isPrivate ? 'privatan' : 'javan').includes(sanitizedQuery) ||
            herbarium.type.name.toLowerCase().includes(sanitizedQuery);
        });
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
      onDeleteClick(herbariumId) {
        this.deletedHerbariumIds.push(herbariumId);
        const herbariumIndex = this.herbariumsList.findIndex((herbarium) => herbarium.id === herbariumId);
        this.herbariumsList.splice(herbariumIndex, 1);
        if (this.selectedHerbariumLeft && (this.selectedHerbariumLeft.id === herbariumId)) {
          this.selectedHerbariumLeft = null;
        } else if (this.selectedHerbariumRight && (this.selectedHerbariumRight.id === herbariumId)) {
          this.selectedHerbariumRight = null;
        }
      },
      showToast(text, style) {
        this.isToastVisible = true;
        this.toastText = text;
        this.toastStyle = style;
        setTimeout(() => {
          this.isToastVisible = false;
        }, 3000);
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
        this.isSaveDisabled = true;
        apiService.updateHerbariums(this.herbariums.filter((herbarium) => {
          return this.modifiedHerbariumIds.indexOf(herbarium.id) !== -1;
        }))
        .then(() => {
          this.modifiedHerbariumIds = [];
          return apiService.deleteHerbariums(this.deletedHerbariumIds);
        })
        .then(() => {
          this.deletedHerbariumIds = [];
          this.isSaveDisabled = false;
          this.showToast('Promjene uspješno pohranjene', 'success');
        })
        .catch(() => {
          this.showToast('Greška pri spremanju promjena', 'danger');
          this.isSaveDisabled = false;
        });
      },
      onHerbariumCreateClick() {
        this.isModalVisible = true;
      },
      onHerbariumCreateSubmit(herbarium) {
        apiService.createHerbarium(herbarium)
          .then((herbarium) => {
            this.isModalVisible = false;
            this.showToast(`Herbarij ${herbarium.name} je uspješno stvoren`, 'success');
            const newHerbarium = {
              ...herbarium,
              type: this.herbariumTypes.find(({id}) => id === herbarium.type)
            }
            this.herbariumsList.push(newHerbarium);
            this.herbariums.push(newHerbarium);
            this.tableStart = Math.floor(this.herbariumsList.length / this.tableStep) * this.tableStep;
          })
          .catch(() => {
            this.isModalVisible = false;
            this.showToast('Greška pri stvaranju herbarija', 'danger');
          })
      }
    },
    data() {
      return {
        PANE_LOCATIONS,
        herbariumsList: Array.from(this.herbariums),
        searchQuery: '',
        tableStart: 0,
        tableStep: 5,
        isSaveDisabled: false,
        isModalVisible: false,
        isToastVisible: false,
        toastStyle: 'success',
        toastText: '',
        selectedHerbariumLeft: null,
        selectedHerbariumRight: null,
        modifiedHerbariumIds: [],
        deletedHerbariumIds: []
       }
    }
  }
</script>

<template lang="pug">
  div
    bootstrap-toast(
      :visible="isToastVisible"
      :toastStyle="toastStyle"
      @click="isToastVisible = false"
    ) {{toastText}}
    bootstrap-modal(
      title="Novi herbarij"
      :visible="isModalVisible"
      @hide="isModalVisible = false"
    )
      herbarium-form(
        :herbariumTypes="herbariumTypes"
        @submit="onHerbariumCreateSubmit"
      )

    .btn.btn-primary.float-right.rounded-0(@click="onHerbariumCreateClick") Novi herbarij

    input.form-control.form-control-sm.rounded-0(
      type="search"
      placeholder="Pretraživanje"
      v-model="searchQuery"
    )
    bootstrap-table
      template(slot="header")
        tr
          th(scope="col") Naziv
          th(scope="col") Opis
          th(scope="col") Tip
          th(scope="col") Vidljivost
          th.text-right(scope="col") Broj zapažanja
          th(scope="col")
          th(scope="col")
      template(slot="body")
        tr(
          v-for="herbarium in displayHerbariums"
          :key="herbarium.id"
        )
          td {{herbarium.name}}
          td {{herbarium.description}}
          td
            select.form-control(
              v-model="herbarium.type"
              @change="onHerbariumModified(herbarium)"
            )
              option(
                v-for="type in herbariumTypes"
                :key="type.id"
                :value="type"
              ) {{type.name}}

          td {{herbarium.isPrivate ? 'Privatan' : 'Javan'}}
          td.text-right {{herbarium.observations.length}}
          td
            button.btn.btn-primary.rounded-0(
              @click="onOpenClick(PANE_LOCATIONS.left, herbarium)"
            ) ◀
            button.btn.btn-primary.rounded-0(
              @click="onOpenClick(PANE_LOCATIONS.right, herbarium)"
            ) ▶

          td
            button.btn.btn-danger.rounded-0(
              @click="onDeleteClick(herbarium.id)"
            ) Obriši


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
          :herbariumTypes="herbariumTypes"
          @change:herbarium="onHerbariumModified"
        )
      .col-6
        herbarium-pane(
          v-if="selectedHerbariumRight"
          :herbarium="selectedHerbariumRight"
          :herbariumTypes="herbariumTypes"
          @change:herbarium="onHerbariumModified"
        )

    button.btn.btn-primary.save-button(
      v-if="modifiedHerbariumIds.length || deletedHerbariumIds.length"
      :disabled="isSaveDisabled"
      @click="onHerbariumChangesSubmitClick"
    ) Pohrani promjene ({{modifiedHerbariumIds.length + deletedHerbariumIds.length}})

</template>

<style scoped lang="scss">
  .save-button {
    position: fixed;
    bottom: 16px;
    right: 16px;
  }
</style>
