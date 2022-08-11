const searchFormList = [
  { label: '账号', value: 'query', type: 'input', width: '140px'},
  { label: '状态', value: 'status', type: 'select', width: '150px', option: 'sysUserStatus', filterable: true,  clearable: true},
  { label: '隶属部门', value: 'orgid', type: 'select', option: 'sysOrg', filterable: true,  clearable: true, loading: true, remote:true, store:"dictSrv/sysOrg", width: '200px'},
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
  { label: '是否允许多端登录', value: 'isdup', type: 'slot', width:100},
  { label: '过期时间', value: 'expire', type: 'slot', sort:'custom'},
  { label: '隶属部门', value: 'org'},
  { label: '入职时间', value: 'stime', type: 'slot', sort:'custom'},
  { label: '操作', type: 'slot', value: 'btn', width:100}
];

const fieldList = [ // 新增弹出数据
  { label: '登录账号', value: 'account', type: 'input', width: '300px', className:''},
  { label: '会员头像', value: 'avatar', type:'file', width: '300px', accept:'image/jpeg,image/gif,image/png', multiple:false, data:{skey:'file',appdir:'sysuser'}},
  { label: '登录密码', value: 'loginpw', type:'password', width: '300px', className:''},
  { label: '昵称', value: 'nickname', type: 'input' , width: '300px', className:''},
  { label: '电子邮箱', value: 'email', type:'input', width: '300px', className:''},
  { label: '手机号码', value: 'mobile', type:'input', width: '300px', className:''},
  { label: '状态', value: 'status', type:'select', width: '300px', option: 'sysUserStatus', filterable: true, className:''},
  { label: '是否允许多端登录', value: 'isdup', type:'select', width: '300px', option: 'yesOrNo', filterable: true, className:''},
  { label: '性别', value: 'sex', type:'select', width: '300px', option: 'sysUserSex', filterable: true, className:''},
  { label: '过期时间', value: 'expire', type:'date', width: '300px', dateType:'datetime', format:"yyyy-MM-dd HH:mm:ss", className:''},
  { label: '隶属部门', value: 'orgid', type:'select', width: '300px',  option: 'sysOrg', remote:true, loading: true, store:"dictSrv/sysOrg", className:''},
  { label: '入职时间', value: 'stime', type:'date', width: '300px', className:''},
  { label: '开通角色', value: 'roleids', type:'checkbox', width: '680px', option: 'sysRole', className:''},
];

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'change' }],
  avatar: [{ required: true, message: '请设置账号头像', trigger: 'change' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  email: [{ required: true, message: '请输入电子邮箱', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态信息', trigger: 'change' }],
  isdup: [{ required: true, message: '请选择是否允许多端登录', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  expire: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
  stime: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
  orgid: [{ required: true, message: '请选择隶属的部门', trigger: 'change' }]
};

const fieldData = (data)=>{
  var dataset = {roleids:[]};
  for (var idx = 0; idx < fieldList.length; idx++) {
    var ckey  = fieldList[idx].value;
    dataset[ckey] = (data && data[ckey])? data[ckey]:'';
  }
  if (dataset['roleids'] == "") {
    dataset[ckey] = [];
  }
  dataset.id = (data && data.id)? data.id:0;
  return dataset;
}

export default {
  searchFormList,tables,fieldList,fieldData,rules
};
