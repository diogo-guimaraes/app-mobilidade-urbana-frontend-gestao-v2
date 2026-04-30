const routes = [
  {
    path: "/",
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
    children: [{ path: '', component: () => import('src/pages/usuarios/PaginaUsuarios.vue') }],
  },
  {
    path: '/motoristas',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/usuarios/PaginaMotoristas.vue') }],
  },
  {
    path: '/passageiros',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/usuarios/PaginaPassageiros.vue') }],
  },
  {
    path: '/veiculos',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/PaginaVeiculos.vue') }],
  },
  {
    path: '/corridas',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/PaginaCorridas.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes