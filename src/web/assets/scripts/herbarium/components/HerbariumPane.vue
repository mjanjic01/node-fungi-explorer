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
      }
    },
    computed: {
    },
    methods: {
      onFormSubmit() {
        this.$emit('submit:form', this.herbarium);
      }
    },
    data() {
      return {
       }
    },
  }
</script>

<template lang="pug">
  form(@submit.prevent="onFormSubmit")
    h3 {{herbarium.name}}
    .form-group
      label Vidljivost
      .form-check
        input.form-check-input(
          type="checkbox"
          name="isPrivate"
          v-model="herbarium.isPrivate")
        label.form-check-label Privatan
    .form-group
      label Naziv
      input.form-control.form-control-sm(
        type="string"
        placeholder="Naziv herbarija"
        v-model="herbarium.name"
      )

    .form-group
      label Opis
      textarea.form-control(
        rows="3"
        name="description"
        v-model="herbarium.description"
      ) {{herbarium.description}}

    draggable(
      class="draggable"
      v-model="herbarium.observations"
      :options="{ group: 'observations', pull: true, put: true }"
    )
      .d-flex(
        v-for="observation in herbarium.observations"
        :key="observation.id"
      )
        div
          img(:src="observation.image" width="100px")

        div {{observation.fungi.name}}
        div {{observation.description}}
        div {{observation.date}}

    button.btn.btn-primary(type="submit") Spremi

</template>

<style scoped lang="scss">
  .draggable {
    height: 500px;
    overflow: auto;
    background: #F5F5F5;
  }
</style>
