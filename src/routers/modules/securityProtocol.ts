import Layout from "@/layout/index.vue";

const securityProtocolAnalysis = [{
    path: '/securityProtocolAnalysis',
    component: Layout,
    redirect: '/securityProtocolAnalysis/',
    name: 'securityProtocolAnalysis',
    meta: {
        title: '安全协议分析',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/securityProtocolAnalysis/analysis',
            component: () => import('@/views/securityProtocolAnalysis/analysis.vue'),
            name: '安全协议分析',
            meta: { title: '安全协议分析', keepAlive: true , icon: 'MenuIcon'}
        },
    ]
}]

export default securityProtocolAnalysis