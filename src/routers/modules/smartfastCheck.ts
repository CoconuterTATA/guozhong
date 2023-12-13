import Layout from "@/layout/index.vue";

const contractCheck = [{
    path: '/contractCheck',
    component: Layout,
    redirect: '/contractCheck/',
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
            path: '/contractCheck/smartfastRecords',
            component: () => import('@/views/contractCheck/checkRecords.vue'),
            name: 'SmartFast合约检测记录',
            meta: { title: '合约检测记录查询', keepAlive: true , icon: 'School'}
        },
    ]
}]

export default contractCheck