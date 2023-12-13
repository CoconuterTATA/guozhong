import Layout from "@/layout/index.vue";

const toDetector = [{
    path: '/todetector',
    component: Layout,
    redirect: '/todetector/',
    name: 'toDetector',
    meta: {
        title: 'Todetector合约检测',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/todetector/detector',
            component: () => import('@/views/contractCheck/todetector.vue'),
			//component: () => import('@/views/contractCheck/oyenetRecords'),
            name: 'Todetector检测台',
            meta: { title: 'Todetector检测台', keepAlive: true , icon: 'MenuIcon'}
        },
		{
		    path: '/todetector/checkDectorRecords',
		    /*component: () => import('@/views/contractCheck/todetector.vue'),*/
			component: () => import('@/views/contractCheck/todetectorRecords'),
		    name: 'Todetector检测记录',
		    meta: { title: '合约检测记录查询', keepAlive: true , icon: 'School'}
		},
        /*{
            path: '/todetector/checktodetectorRecords',
            component: () => import('@/views/contractCheck/oyenetRecords'),
            name: '合约检测记录查询',
            meta: { title: '合约检测记录查询', keepAlive: true , icon: 'School'}
        },*/
    ]
}]

export default toDetector