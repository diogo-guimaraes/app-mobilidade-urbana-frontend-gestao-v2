const routes = [
  {
    path: "/",
    // REMOVA esta linha: redirect: "/login",
    // Vamos tratar o redirecionamento no beforeEach
  },
  {
    path: "/login",
    component: () => import("src/pages/LoginUsuario.vue"),
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/usuarios',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/usuarios/ListaUsuarios.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes