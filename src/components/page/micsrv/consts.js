
const searchFormList = [
  { label: '关键词', value: 'query', type: 'input', width: '180px' },
  { label: '记录时间', value: 'stime', type: 'date', width: '320px' , dateType: 'daterange'},
  { label: '', width: '320px', value: 'btn', type: 'slot' }
];

const tables = [ // 表格数据
  { label: '记录ID', value: 'id', sort:'custom', width:100},
  { label: '微服务名称', value: 'name' },
  { label: '服务地址', value: 'srv' },
  { label: '状态', type: 'slot', sort:'custom', value: 'status', width:120},
  { label: '版本号', value: 'version', width:120},
  { label: '通信协议', value: 'proto', width:120},
  { label: '记录时间', sort:'custom', width:240, type: 'slot', value: 'stime'},
  { label: '操作', type: 'slot', value: 'btn', width:160}
];

export default {
  searchFormList,tables
};
