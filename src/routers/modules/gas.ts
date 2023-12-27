import Layout from "@/layout/index.vue";

const gasTime = [{
    path: '/gasRealTime',
    component: Layout,
    redirect: '/gasRealTime/btc',
    name: 'gasRealTime',
    meta: {
        title: 'ETH/BSC实时Gas',
        icon: 'MenuIcon'
    },
    children: [

        {
            path: '/gasRealTime/eth',
            component: () => import('@/views/gas/eth.vue'),
            name: 'staticCheck',
            meta: { title: 'ETH/BSC实时Gas', keepAlive: true , icon: 'MenuIcon'}
        },

    ]
}]

export default gasTime