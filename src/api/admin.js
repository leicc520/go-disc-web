import {request, writeLog} from "../libs/core.js"
/**
会员登录校验逻辑
@param args{account:xxx. loginpw:xxx, vcode:xxxx}
****************************************************************/
export const signIn = async(args) => {
  const data = await request({url:'/signin/check', data:args, method:'post'});
  if (data && data.code == 0 && data.datas.sign && localStorage) {
    localStorage.setItem('sid', data.datas.sign);
  }
  return data;
}

export const captchaCheck = async(args) => {
  const data = await request({url:'/captcha/check', data:args, method:'post'});
  return data;
}

export const captchaJson = async(args) => {
  const data = await request({url:'/captcha/json', data:args, method:'post'});
  return data;
}
