<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onModalClose() {
        this.$emit('hide');
      }
    }
  }
</script>

<template lang="pug">
  transition(name="fade")
    div(
      v-show="visible"
    )
      .modal-backdrop
      .modal(
        tabindex="-1"
        role="dialog"
        @click.self="onModalClose"
      )
        .modal-dialog(role="document")
          .modal-content
            .modal-header
              h5.modal-title(v-if="title && title.length") {{title}}
              button.close(
                type="button"
                aria-label="Close"
                @click="onModalClose"
              )
                span(aria-hidden="true") ×
            .modal-body
              slot
</template>

<style scoped lang="scss">
  .modal {
    display: block;
  }

  .modal-backdrop {
    opacity: 0.5;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
