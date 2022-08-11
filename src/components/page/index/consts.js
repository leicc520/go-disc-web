const userInfo = [ // 新增弹出数据
  { label: '账号', value: 'account', type: 'input', width: '300px', disabled:true},
  { label: '姓名', value: 'nick', type: 'input', width: '300px', disabled:true},
  { label: '密码', value: 'loginpw', type:'password', width: '300px'},
  { label: '联系邮箱', value: 'email', type:'input', width: '300px'},
  { label: '手机号码', value: 'mobile', type:'input', width: '300px'},
  { label: '过期时间', value: 'expire',  type:'date', width: '300px', dateType:'datetime', format:"yyyy-MM-dd HH:mm", disabled:true},
  { label: '是否允许多端登录', value: 'isdup', type:'select', width: '300px', option: 'yesOrNo', filterable: true,disabled:true}
];

const userRules = { // 暂时不要
   email: [{ required: true, message: '请输入电子邮箱', trigger: 'change' }],
   mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }]
};

export default {
  userInfo,userRules
};