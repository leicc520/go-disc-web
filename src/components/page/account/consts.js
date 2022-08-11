const searchFormList = [
  { label: '账号', value: 'query', type: 'input', width: '200px'},
  { label: '状态', value: 'status', type: 'select', width: '150px', option: 'sysStatus', filterable: true,  clearable: true},
  { label: '', width: '100%', value: 'btn', type: 'slot' }
];

const tables = [ // 表格数据
  { label: '账号ID', value: 'id', sort:'custom', width:100},
  { label: '登录账号', value: 'account'},
  { label: '昵称', value: 'nickname'},
  { label: '电子邮箱', value: 'email'},
  { label: '手机号码', value: 'mobile'},
  { label: '注册时间', value: 'regtime', type: 'slot'},
  { label: '状态', value: 'status', type: 'slot', sort:'custom', width:80},
  { label: '过期时间', value: 'expire', type: 'slot', sort:'custom'},
  { label: '更新时间', value: 'stime', type: 'slot', sort:'custom'},
  { label: '操作', type: 'slot', value: 'btn', width:100}
];

const fieldList = [ // 新增弹出数据
  { label: '登录账号', value: 'account', type: 'input', width: '320px', className:''},
  { label: '登录密码', value: 'loginpw', type:'password', width: '320px', className:''},
  { label: '昵称', value: 'nickname', type: 'input' , width: '320px', className:''},
  { label: '电子邮箱', value: 'email', type:'input', width: '320px', className:''},
  { label: '手机号码', value: 'mobile', type:'input', width: '320px', className:''},
  { label: '状态', value: 'status', type:'select', width: '320px', option: 'sysStatus', filterable: true, className:''},
  { label: '过期时间', value: 'expire', type:'date', width: '320px', dateType:'datetime', format:"yyyy-MM-dd HH:mm:ss", className:''}
];

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'change' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  email: [{ required: true, message: '请输入电子邮箱', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态信息', trigger: 'change' }],
  expire: [{ required: true, message: '请选择过期时间', trigger: 'change' }]
};

const fieldData = (data)=>{
  var dataset = {};
  for (var idx = 0; idx < fieldList.length; idx++) {
    var ckey  = fieldList[idx].value;
    dataset[ckey] = (data && data[ckey])? data[ckey]:'';
  }
  dataset.id = (data && data.id)? data.id:0;
  return dataset;
}

export default {
  searchFormList,tables,fieldList,fieldData,rules
};
