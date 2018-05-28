<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    toastStyle: {
      default: 'success',
      validator(value) {
        return [
          'success',
          'warning',
          'danger',
          'info',
          'light',
          'dark',
        ].indexOf(value) !== -1
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
}
</script>

<template lang="pug">

  transition(name="fade")
    .alert.toast(
      role="alert"
      v-if="visible"
      :class=`{
        'alert-success': toastStyle === 'success',
        'alert-warning': toastStyle === 'warning',
        'alert-danger': toastStyle === 'danger',
        'alert-info': toastStyle === 'info',
        'alert-light': toastStyle === 'light',
        'alert-dark': toastStyle === 'dark',
      }`
      @click="onClick"
    )
      slot
</template>

<style scoped lang="scss">
  .toast {
    position: fixed;
    top: 66px;
    right: 16px;
    z-index: 1500;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
