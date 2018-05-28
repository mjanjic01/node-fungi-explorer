<script>
  export default {
    props: {
      herbariumTypes: {
        type: Array,
        required: true,
      }
    },
    methods: {
      onFormSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$emit('submit', {
              name: this.name,
              description: this.description,
              isPrivate: this.isPrivate,
              type: this.type,
            });
          }
        });
      }
    },
    data() {
      return {
        isPrivate: false,
        name: '',
        description: '',
        type: this.herbariumTypes[0].id,
      };
    }
  }
</script>

<template lang="pug">
  form(@submit.prevent="onFormSubmit")
    .form-group
      label Vidljivost
      .form-check
        input.form-check-input(
          type="checkbox"
          name="isPrivate"
          v-model="isPrivate"
        )
        label.form-check-label Privatan
    .form-group
      select.form-control(
        v-model="type"
        name="type"
      )
        option(
          v-for="type in herbariumTypes"
          v-validate="'required'"
          :key="type.id"
          :value="type.id"
        ) {{type.name}}

    .form-group
      label Naziv
      input.form-control.form-control-sm(
        type="string"
        name="name"
        placeholder="Naziv herbarija"
        :class="{ 'is-invalid': errors.has('name') }"
        v-model="name"
        v-validate="'required'"
      )
      .invalid-feedback(v-show="errors.has('name')") Naziv je obvezan

    .form-group
      label Opis
      textarea.form-control(
        rows="3"
        name="description"
        v-model="description"
      ) {{description}}


    .form-group
      button.btn.btn-primary(type="submit") Stvori

</template>

<style scoped lang="scss">
</style>
