// import axios from 'axios';

// let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// export const addDict = params => { return axios.post(`${base}/etl/master/sys/dict/save`, params).then(res => res.data); };

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

axios.interceptors.response.use(response => {
    let rep = response.data;
     if (rep.code === -1) {
        Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
        })
        return;
    }

    // if (rep.code == 0) {
    //     Message({
    //         message: rep.msg,
    //         type: 'success',
    //         duration: 3 * 1000
    //     })
    // }
    return rep;
}, error => {
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({ message: '服务器被吃了( ╯□╰ )' })
    } else if (error.response.code == 403) {
        Message.error({ message: '权限不足，请联系管理员' })
    } else if (error.response.code == 401) {
        Message.error({ message: '尚未登录，请登录' })
        router.replace('/');
    } else {
        // if (error.response.data.msg) {
        //     Message.error({ message: error.response.data.msg })
        // } else {
        //     Message.error({ message: '未知错误!' })
        // }
    }
    return;
})

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url,id) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: { id }
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}

export const deleteById = (url) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`
    })
}

export const getDictField = (url) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
    })
}