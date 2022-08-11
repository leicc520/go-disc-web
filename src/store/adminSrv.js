import {request, writeLog} from "../libs/core.js"
export default {
  namespaced: true,  //多出的一行
  state: {
  	user: {}
  },
  mutations: {
    initSet(state, datas) {
        for (let keys in datas) {
            state[keys] = datas[keys];
        }
    }
  },
  getters: {
  	user: state => {
  		return state.user;
  	}
  },
  actions: {
  }
}
