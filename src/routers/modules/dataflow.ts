import Layout from "@/layout/index.vue";

const dataflow = [{
    path: '/dataflow',
    component: Layout,
    redirect: '/dataflow/staticCheckRecords',
    name: 'dataflowcCheck',
    meta: {
        title: '流量检测',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/dataflow/staticCheckRecords',
            component: () => import('@/views/dataflow/staticCheckRecords.vue'),
            name: 'staticCheckRecords',
            meta: { title: '静态流量分析记录', keepAlive: true , icon: 'MenuIcon'}
        },
        {
            path: '/dataflow/staticCheck',
            component: () => import('@/views/dataflow/staticAnalysis.vue'),
            name: 'staticAnalysis',
            meta: { title: '静态流量分析', keepAlive: true , icon: 'MenuIcon'}
        },
        {
            path: '/dataflow/dynamicCheck',
            component: () => import('@/views/dataflow/dynamicCheck.vue'),
            name: 'dynamicCheck',
            meta: { title: '动态流量分析', keepAlive: true , icon: 'MenuIcon'}
        }
    ]
}]

export default dataflow