import type { RouterConfig } from '@nuxt/schema'

export default {
    // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
    routes: (_routes) => [
        {
            path: '/',
            name: 'home',
            component: () => import('~/pages/index.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('~/pages/about.vue'),
        },
        {
            path: '/ALR/:query',
            name: 'ALR',
            component: () => import('~/pages/ALR.vue'),
        },
        {
            path: '/AUR/:query',
            name: 'AUR',
            component: () => import('~/pages/AUR.vue'),
        },
    ],
} satisfies RouterConfig