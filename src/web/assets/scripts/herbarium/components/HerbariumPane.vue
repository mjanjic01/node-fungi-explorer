<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    props: {
      herbarium: {
        type: Object,
        required: true,
      },
      herbariumTypes: {
        type: Array,
        required: true,
      }
    },
    methods: {
      onHerbariumChanged(change) {
        if (change.removed || change.added) {
          this.$emit('change:herbarium', this.herbarium);
        }
      },
      fungiName(fungi) {
        return fungi.name ||
          `${fungi.species.genus.name} ${fungi.species.name} ${fungi.variant || ''}`;
      }
    }
  }
</script>

<template lang="pug">
  .card
    .card-body
      form
        h3 {{herbarium.name}}
        .form-group
          label Vidljivost
          .form-check
            input.form-check-input(
              type="checkbox"
              name="isPrivate"
              v-model="herbarium.isPrivate"
              @change="onHerbariumChanged"
            )
            label.form-check-label Privatan
        .form-group
          select.form-control(
            v-model="herbarium.type"
            @change="onHerbariumChanged"
          )
            option(
              v-for="type in herbariumTypes"
              :key="type.id"
              :value="type"
            ) {{type.name}}
        .form-group
          label Naziv
          input.form-control.form-control-sm(
            type="string"
            name="name"
            placeholder="Naziv herbarija"
            v-model="herbarium.name"
            v-validate="'required'"
            @change="onHerbariumChanged"
          )
          span(v-show="errors.has('name')") {{ errors.first('name') }}

        .form-group
          label Opis
          textarea.form-control(
            rows="3"
            name="description"
            v-model="herbarium.description"
            @change="onHerbariumChanged"
          ) {{herbarium.description}}

        draggable(
          class="draggable"
          v-model="herbarium.observations"
          :options="{ group: 'observations', pull: true, put: true}"
          @change="onHerbariumChanged"
        )
          .d-flex.draggable-item(
            v-for="observation in herbarium.observations"
            :key="observation.id"
          )
            div
              img(:src="observation.image" width="100px")

            div {{fungiName(observation.fungi)}}
            div {{observation.description}}
            div {{observation.date}}

</template>

<style scoped lang="scss">
  .draggable {
    height: 500px;
    overflow: auto;
    background: #F5F5F5;
  }

  .draggable-item {
    cursor: -webkit-grab;

    &:active,
    &:focus {
      cursor: -webkit-grabbing;
    }
  }
</style>
