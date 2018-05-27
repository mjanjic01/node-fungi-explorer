<script>
  export default {
    props: {
      pages: {
        type: Number,
        required: true,
      },
      activePage: {
        type: Number,
        required: true,
      },
    },
    methods: {
      onPageClick(page) {
        this.$emit('click:page', page);
      }
    }
  }
</script>

<template lang="pug">
  nav
    ul.pagination.justify-content-center
      li.page-item(v-if="activePage !== 1")
        a.page-link(@click="onPageClick(activePage - 1)")
          span &laquo;

      li.page-item(
        v-for="page in pages"
        :class="{ 'active': page === activePage }"
      )
        a.page-link(@click="onPageClick(page)") {{page}}

      li.page-item(v-if="activePage !== pages")
        a.page-link(@click="onPageClick(activePage + 1)")
          span &raquo;
</template>
