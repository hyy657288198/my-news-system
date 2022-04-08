import axios from 'axios'
import {store} from '../redux/store'

axios.defaults.baseURL="http://localhost:5000"

//response interceptor
axios.interceptors.request.use(function (config) {
    // show loading before request is sent
    store.dispatch({
        type:"change_loading",
        payload:true
    })
    return config;
  }, function (error) {
    //request error
    return Promise.reject(error);
  });

//response interceptor
axios.interceptors.response.use(function (response) {
    // hide loading with response data
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return response;
  }, function (error) {
    // hide loading with response error
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return Promise.reject(error);
  });