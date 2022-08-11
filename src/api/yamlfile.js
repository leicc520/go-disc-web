import {request, writeLog} from "@/libs/core.js"
import { Message } from 'element-ui'
const getList = async(args) => {
  const data = await request({url:'/api/core/yaml/list', data:args, method:'post'});
  if (data && data.code == 0 ) {
    return data.datas;
  }
  return false;
}

const doDelete = async(args) => {
	const data = await request({url:'/api/core/yaml/delete', data:args, method:'post'});
	if(data && data.code == 0){
		Message({message: '服务配置删除成功', type: 'success', duration: 3 * 1000});
		return true;
	}
  return false;
}

const doSave = async(args) => {
	const data = await request({url:'/api/core/yaml/update', data:args, method:'post'});
	if(data && data.code == 0){
		if(!args.id){
			Message({message: '服务配置新增成功', type: 'success', duration: 3 * 1000});
		}else{
			Message({message: '服务配置编辑成功', type: 'success', duration: 3 * 1000});
		}
		return true;
	}
  return false;
}

export default {
	getList,doDelete,doSave
};
