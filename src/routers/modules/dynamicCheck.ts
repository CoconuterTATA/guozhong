import Layout from "@/layout/index.vue";

const dynamicCheck = [{
    path: '/dynamicCheck',
    component: Layout,
    redirect: '/dynamicCheck/check',
    name: 'dynamicCheck',
    meta: {
        title: '动态流量检测',
        icon: 'MenuIcon'
    },
    children: [
    ]
}]

export default dynamicCheck