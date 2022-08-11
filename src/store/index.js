import Vue from 'vue'
import Vuex from 'vuex'
import dictSrv from "./dictSrv.js"
import adminSrv from "./adminSrv.js"
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
        dictSrv,
		adminSrv,
	}
});
export default store