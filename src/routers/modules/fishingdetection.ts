import Layout from "@/layout/index.vue";

const fishingDetection = [{
    path: '/fishingdetector',
    component: Layout,
   /* redirect: '/contractSecurity/csa',
    name: 'contractSecurity',*/
    meta: {
        title: '钓鱼账户检测',
        icon: 'MenuIcon'
    },
    children: [
        {
            path: '/fishingdetector/',
            component: () => import('@/views/fishingdetection/fishingDetection.vue'),
            name: '钓鱼账户检测',
            meta: { title: '钓鱼账户检测', keepAlive: true , icon: 'MenuIcon'}
        },

    ]
}]

export default fishingDetection
