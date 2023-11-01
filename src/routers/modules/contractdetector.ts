import Layout from "@/layout/index.vue";

const contractDetector = [{
    path: '/contractdetector',
    component: Layout,
    redirect: '/contractdetector/detector',
    name: 'contractDetector',
    meta: {
        title: 'oyenet合约检测',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/contractdetector/detector',
            component: () => import('@/views/contractCheck/checkDectorRecords.vue'),
            name: 'oyenet检测台',
            meta: { title: 'oyenet检测台', keepAlive: true , icon: 'MenuIcon'}
        },
        {
            path: '/contractdetector/checkDectorRecords',
            component: () => import('@/views/contractCheck/smartfast.vue'),
            name: '合约检测记录查询',
            meta: { title: '合约检测记录查询', keepAlive: true , icon: 'School'}
        },
    ]
}]

export default contractDetector