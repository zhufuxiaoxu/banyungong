<template>
  <div id="app">
    <VPNList />
  </div>
</template>

<script>
import VPNList from './components/VPNList.vue'

export default {
  name: 'App',
  components: {
    VPNList
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style> 