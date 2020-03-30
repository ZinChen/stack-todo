
const routes = [
  {
    path: '/admin', component: () => import('pages/Admin.vue')
  },
  {
    path: '/', component: () => import('pages/Index.vue')
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
