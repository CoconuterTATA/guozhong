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
            name: 'smartfast',
            meta: { title: 'smartfast', keepAlive: true , icon: 'MenuIcon'}
        },
    ]
}]

export default contractRouter