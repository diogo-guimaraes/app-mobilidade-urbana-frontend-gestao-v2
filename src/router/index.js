import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/auth";

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    const token = localStorage.getItem("token");
    if (token && !authStore.user) {
      try {
        await authStore.fetchUser();
      } catch (e) {
        console.log(e, 'e')
        console.warn("Sessão expirada. Redirecionando para login.");
        authStore.logout();
      }
    }

    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/login");  // Mude de "/" para "/login"
    } else if (to.path === "/" && isAuthenticated) {
      next("/dashboard");
    } else {
      next();
    }
  });


  return Router;
});
