import Layout from "@/layout/index.vue";

const contractSecurityAnalysis = [{
    path: '/contractdetector',
    component: Layout,
    redirect: '/contractSecurity/csa',
    name: 'contractSecurity',
    meta: {
        title: '合约安全分析',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/contractdetector/csa',
            component: () => import('@/views/contractSecurity/contractSecurityAnalysis.vue'),
            name: '合约安全分析',
            meta: { title: '合约安全分析', keepAlive: true , icon: 'MenuIcon'}
        },

    ]
}]

export default contractSecurityAnalysis
