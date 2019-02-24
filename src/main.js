import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

/*Vue.http.options.root = 'http://krapipl.imumk.ru:8082/api/mobilev1/update'*/

new Vue({
  el: '#app',  
  render: h => h(App)
})
