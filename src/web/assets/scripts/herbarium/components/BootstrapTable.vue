<template functional lang="pug">
  .table-responsive
    table.table.table-striped.table-hover
      thead
        slot(name="header")
      tbody
        slot(name="body")
      tfoot
        slot(name="footer")
</template>
