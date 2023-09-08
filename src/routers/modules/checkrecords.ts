import Layout from "@/layout/index.vue";

const contractRouter = [{
    path: '/checkRecords',
    component: Layout,
    redirect: '/records/checkRecords',
    name: 'checkRecords',
    meta: {
        title: '合约检测记录',
        icon: 'chat-square'
    },
    children: [
        {
            path: '/records/checkRecords',
            component: () => import('@/views/records/checkRecords.vue'),
            name: '合约检测记录查询',
            meta: { title: '合约检测记录查询', keepAlive: true , icon: 'MenuIcon'}
        },
    ]
}]

export default contractRouter