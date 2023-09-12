import Layout from "@/layout/index.vue";

const contractRouter = [{
    path: '/contractCheck',
    component: Layout,
    redirect: '/contractCheck/smartfast',
    name: 'contractCheck',
    meta: {
        title: 'SmartFast合约检测',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/contractCheck/smartfast',
            component: () => import('@/views/contractCheck/smartfast.vue'),
            name: 'SmartFast检测台',
            meta: { title: 'SmartFast检测台', keepAlive: true , icon: 'MenuIcon'}
        },
        {
            path: '/records/checkRecords',
            component: () => import('@/views/contractCheck/checkRecords.vue'),
            name: '合约检测记录查询',
            meta: { title: '合约检测记录查询', keepAlive: true , icon: 'School'}
        },
    ]
}]

export default contractRouter