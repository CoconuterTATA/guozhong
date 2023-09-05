import Layout from "@/layout/index.vue";

const contractRouter = [{
    path: '/contractCheck',
    component: Layout,
    redirect: '/contractCheck/smartfast',
    name: 'contractCheck',
    meta: {
        title: '合约检测',
        icon: 'chat-square'
    },
    children: [
        {
            path: '/contractCheck/smartfast',
            component: () => import('@/views/contractCheck/smartfast.vue'),
            name: 'SmartFast检测台',
            meta: { title: 'SmartFast检测台', keepAlive: true , icon: 'MenuIcon'}
        },
    ]
}]

export default contractRouter