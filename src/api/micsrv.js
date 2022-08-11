import {request, writeLog} from "@/libs/core.js"
import { Message } from 'element-ui'
const getList = async(args) => {
    const data = await request({url:'/api/core/misrv/list', data:args, method:'post'});
    if (data && data.code == 0 ) {
        return data.datas;
    }
    return false;
}

const doStatus = async(args) => {
	const data = await request({url:'/api/core/misrv/status', data:args, method:'post'});
	if(data && data.code == 0){
		Message({message: '微服务状态设置成功', type: 'success', duration: 3 * 1000});
		return true;
	}
    return false;
}

const doReload = async(args) => {
	const data = await request({url:'/api/core/misrv/reload', data:args, method:'post'});
	if(data && data.code == 0){
		Message({message: '重载微服务配置成功', type: 'success', duration: 3 * 1000});
		return true;
	}
    return false;
}

export default {
	getList,doStatus,doReload
};
