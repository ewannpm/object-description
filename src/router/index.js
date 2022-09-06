import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
import ObjectDescription from '../views/ObjectDescription.vue'
import SectionDescription from '../views/SectionDescription'

const routes = [
    { path: '/', redirect: '/Home' },
    { path: '/Home', component: Home },
    { path: '/ObjectDescription', component: ObjectDescription },
    { path: '/SectionDescription', component: SectionDescription }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router