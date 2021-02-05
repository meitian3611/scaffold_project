import Vue from "vue";

// 生产环境时配置
// axios.defaults.baseURL = 'http://dev.mofang.oa.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
//全局注册，使用方法为:this.$axios
Vue.prototype.$axios = axios;
