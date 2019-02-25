<template>
  <div id="app">
    <div class="int-cont">
      <div class="container pt-5">   
        <Showcase></Showcase>
      </div>
    </div>      
  </div>
</template>

<script>

import Showcase from './components/Showcase'

export default {
  name: 'app',
  data () {
    return {
     
    }
  },
  components:{
    Showcase
  }
}
</script>

<style>

</style>
