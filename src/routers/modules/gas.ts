import Layout from "@/layout/index.vue";

const gasTime = [{
    path: '/gasRealTime',
    component: Layout,
    redirect: '/gasRealTime/btc',
    name: 'gasRealTime',
    meta: {
        title: '实时Gas',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/gasRealTime/btc',
            component: () => import('@/views/gas/btc.vue'),
            name: 'gasbtc',
            meta: { title: 'BTC', keepAlive: true , icon: 'MenuIcon'}
        },
        {
            path: '/gasRealTime/eth',
            component: () => import('@/views/gas/eth.vue'),
            name: 'staticCheck',
            meta: { title: 'ETH', keepAlive: true , icon: 'MenuIcon'}
        },

    ]
}]

export default gasTime