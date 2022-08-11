import {request, writeLog} from "@/libs/core.js"
import { Message } from 'element-ui'
const getList = async(args) => {
  args.status = parseInt(args.status);
  const data = await request({url:'/api/core/user/list', data:args, method:'post'});
  if (data && data.code == 0 ) {
    return data.datas;
  }
  return false;
}

const doRoleIds = async(args) => {
  const data = await request({url:'/api/core/user/roleids', data:args, method:'post'});
  if (data && data.code == 0 ) {
    return data.datas.roles.map(function(val) {
        return parseInt(val)
    });
  }
  return [];
}

const doSave = async(args) => {
	const data = await request({url:'/api/core/user/update', data:args, method:'post'});
	if (data && data.code == 0) {
		if (!args.id) {
			Message({message: '账号信息添加成功', type: 'success', duration: 3 * 1000});
		} else {
			Message({message: '账号信息编辑成功', type: 'success', duration: 3 * 1000});
		}
		return true;
	}
  return false;
}

const getAccess = async(args) => {
    var access = []
	const data = await request({url:'/api/core/user/getaccess', data:args, method:'post'});
    if (data && data.code == 0 && data.datas.access) {
        for (let idx = 0; idx < data.datas.access.length; idx++) {
            access.push(parseInt(data.datas.access[idx]));
        }
    }
    return access;
}

const setAccess = async(args) => {
  const data = await request({url:'/api/core/user/setaccess', data:args, method:'post'});
  if (data && data.code == 0 ) {
  	Message({message: '账号授权处理成功', type: 'success', duration: 3 * 1000});
    return true;
  }
  return false;
}

const doSafe = async(args) => {
  const data = await request({url:'/api/core/user/safe', data:args, method:'post'});
  if (data && data.code == 0 ) {
    Message({message: '账号编辑处理成功', type: 'success', duration: 3 * 1000});
    return true;
  }
  return false;
}

export default {
	getList,doSave,doSafe
};
