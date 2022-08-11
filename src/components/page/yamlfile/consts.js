const searchFormList = [
  { label: '关键词', value: 'query', type: 'input', width: '200px' },
  { label: '', width: '200px', value: 'btn', type: 'slot' }
];

const tables = [ // 表格数据
  { label: '记录ID', value: 'id', width: 100 },
  { label: '配置名称', value: 'name', width: 180 },
  { label: '配置版本', value: 'version', width: 120 },
  { label: '状态', value: 'status', type: 'slot', sort: 'custom', width: 120 },
  { label: '配置内容', value: 'yaml' },
  { label: '调用统计', value: 'calls', width: 120 },
  { label: '设置账号', value: 'user', width: 140 },
  { label: '更新时间', value: 'stime', type: 'slot', width: 120 },
  { label: '操作', type: 'slot', value: 'btn', width: 160 }
];

const fieldList = [ // 新增弹出数据
  { label: '配置名称', value: 'name', type: 'input', width: '300px' },
  { label: '版本号', value: 'version', type: 'input', width: '300px' },
  { label: '配置内容', value: 'yaml', type: 'slot', width: '920px', autosize: { minRows: 18, maxRows: 1000 } },
];

const rules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'change' }],
  yaml: [{ required: true, message: '请输入YAML格式配置', trigger: 'change' }]
};

const fieldData = (data) => {
  var dataset = {};
  for (var idx = 0; idx < fieldList.length; idx++) {
    var ckey = fieldList[idx].value;
    dataset[ckey] = (data) ? data[ckey] : '';
  }
  dataset.id = (data && data.id) ? data.id : 0;
  return dataset;
}

export default {
  searchFormList, tables, fieldList, fieldData, rules
};
