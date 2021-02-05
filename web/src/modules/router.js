import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err);
};
const router = new VueRouter({
  // 使用路由的history模式
  // mode: 'history',
  routes: [
    { path: "/404", component: () => import("@/views/404"), name: "404" },
    {
      path: "/content",
      alias: "/",
      component: () => import("@/views/content"),
      name: "portal首页"
    },
    { path: "*", redirect: "/404", hidden: true }
  ]
});

/**  重写路由的push方法解决
 * message: "Navigating to current location (XXX) is not allowed" 报错
const routerPush = router.prototype.push
router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
**/

export default router;
