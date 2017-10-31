<template>
  <div id="app">
    <v-user></v-user>
    <v-body></v-body>
  </div>
</template>

<script>
import vUser from './components/User.vue';
import vBody from './components/Body.vue'

export default {
  name: 'app',
  components: {
    vBody,vUser
  }
}
</script>

<style scoped lang="less">
  #body{
    margin: auto;
  }
</style>
