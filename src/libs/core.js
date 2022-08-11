import axios from 'axios'
import { get } from 'lodash'
import Cookies from 'js-cookie'
import { Message, Loading } from 'element-ui'
export const BaseURL = 'http://127.0.0.1:7000';

var _token = null;
var _router = null;
var _loading = null;
const loglevel = (process.env.NODE_ENV == 'development') ? 3 : 0;

/**
 * @description 创建请求实例
 */
function createService() {
  const service = axios.create();
  service.interceptors.request.use(//请求拦截
    config => config,
    error => {
      writeLog(0, error);
      return Promise.reject(error)
    }
  );

  service.interceptors.response.use(//响应拦截
    response => {
      if (_loading) {
        _loading.close();
        _loading = null;
      }
      const dataAxios = response.data;
      const { code } = dataAxios;
      if (code === undefined) {
        return dataAxios;
      } else if (code != 0) {
        Message({ message: dataAxios.msg, type: 'error', duration: 3 * 1000 });
        writeLog(3, `${dataAxios.code}-${dataAxios.msg}: ${response.config.url}`);
        if (code == 20000 && _router) {
          _router.push("/login");
        } else if (code == 20001 && _router) {
          _router.push("/403");
        }
      }
      return dataAxios;
    },
    error => {
      if (_loading) {
        _loading.close();
        _loading = null;
      }
      const status = get(error, 'response.status');
      switch (status) {
        case 400: error.message = '请求错误'; break;
        case 401: error.message = '未授权，请登录'; break;
        case 403: error.message = '拒绝访问'; break;
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
        case 408: error.message = '请求超时'; break;
        case 500: error.message = '服务器内部错误'; break;
        case 501: error.message = '服务未实现'; break;
        case 502: error.message = '网关错误'; break;
        case 503: error.message = '服务不可用'; break;
        case 504: error.message = '网关超时'; break;
        case 505: error.message = 'HTTP版本不受支持'; break;
        default: break;
      }
      return Promise.reject(error);
    }
  );
  return service;
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
  return async (config) => {
    const aptoken = appToken(false);
    const configDefault = {
      headers: {
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 60000,
      baseURL: BaseURL,
      data: {}
    };
    (aptoken) && (configDefault.headers['Signature'] = aptoken);
    if (config && config.data && config.data.loading) {
      _loading = Loading.service({
        fullscreen: true, spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)', text: '数据处理中...'
      });
    }
    return await service.request(Object.assign(configDefault, config));
  }
}

//打印输出日志的处理
export const writeLog = (level, args) => {
  if (level <= loglevel) {
    switch (level) {
      case 3:
        console.log(args);
        break;
      case 2:
        console.warn(args);
        break;
      default:
        console.error(args);
        break;
    }
  }
}

export const appToken = (isclean) => {
  if (isclean) {//清理
    (localStorage) && localStorage.removeItem('sid');
    Cookies.remove('sid');
    _token = null;
  } else {
    if (!_token && localStorage) {
      _token = localStorage.getItem('sid');
    }
    (!_token) && (_token = Cookies.get('sid'));
    return _token;
  }
}

export const signCheck = async (store, router) => {
  const stoken = appToken();
  const user = store.getters["adminSrv/user"];
  _router = router;
  if (stoken && (!user || !user.id)) {//刷新重新加载校验权限
    const datas = await request({ url: '/api/core/signin/recheck', method: 'post' });
    if (datas.code == 0 && datas.datas.user) {
      store.commit("adminSrv/initSet", { user: datas.datas.user });
    } else {//校验失败的情况
      appToken(true);
      router.push('/login');
    }
  }
}

export const showToast = (msg, type = 'error', mises = 3 * 1000) => {
  Message({ message: msg, type: type, duration: mises });
};

// 用于真实网络请求的实例和请求方法
export const service = createService();
export const request = createRequestFunction(service);
