import { request, writeLog } from "../libs/core.js"
export default {
  namespaced: true,  //多出的一行
  state: {
    data: {
      yesOrNo: { 1: "是", 0: "否" },
      sysStatus: { 1: '正常', 2: '锁定', 0: '禁用' }
    }
  },
  mutations: {
    initSet(state, datas) {
      for (let keys in datas) {
        state.data[keys] = datas[keys];
      }
    }
  },
  getters: {
    list: state => {
      var dicts = {};
      for (var kstr in state.data) {
        dicts[kstr] = [];
        if (Array.isArray(state.data[kstr])) {
          dicts[kstr] = state.data[kstr];
          continue;
        }
        for (var str in state.data[kstr]) {
          (/^[\d]+$/.test(str)) && (str = Number(str));
          dicts[kstr].push([str, state.data[kstr][str]]);
        }
      }
      return dicts;
    },
  },
  actions: {
  }
}
