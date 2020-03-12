import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import datasource from '@/views/datasource/list'
import redirect from '@/views/redirect/index'
import login from '@/views/login/index'
import authredirect from '@/views/login/authredirect'
import index from '@/views/dashboard/index'
import transList from '@/views/trans/list'
import transUpload from '@/views/trans/upload'
import transCreate from '@/views/trans/create'
import task from '@/views/task/index'
import dict from '@/views/sys/dict/index'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: redirect
      }
    ]
  },
  {
    path: '/login',
    component: login,
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: authredirect,
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: '/index',
        component: index,
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/datasource',
    component: Layout,
    redirect: '/datasource/index',
    alwaysShow: true,
    meta: {
      title: '数据源管理',
      icon: 'database',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: datasource,
        name: 'datasource',
        meta: {
          title: '数据源列表',
          icon:'list'
        }
      }
    ]
  },
  {
    path: '/node',
    component: Layout,
    redirect: '/node/list',
    // alwaysShow: true, // will always show the root menu
    meta: {
      title: '工作节点监控',
      icon: 'monitor',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/node/list'),
        name: '节点',
        meta: {
          icon: 'monitor',
          title: '工作节点监控',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/datasource/index',
    // alwaysShow: true,
    meta: {
      title: 'ETL任务管理',
      icon: 'task',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: task,
        name: 'ETL任务管理',
        meta: {
          title: 'ETL任务管理',
          icon:'task',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/add',
    component: Layout,
    // redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '转换管理',
      icon: 'trans_management',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: '/trans/list',
        component: transList,
        name: '转换列表',
        meta: {
          icon: 'list',
          title: '转换列表',
          roles: ['admin']
        }
      },
      {
        path: '/trans/create',
        component: transCreate,
        name: '添加转换',
        meta: {
          icon: 'trans',
          title: '添加转换',
          roles: ['admin']
        }
      },
      {
        path: '/trans/upload',
        component: transUpload,
        name: '上传转换',
        meta: {
          icon: 'upload',
          title: '上传转换',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '系统管理',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'dict',
        component:dict,
        name: 'dict',
        meta: {
          icon: 'dict',
          title: '数据字典'
        }
      },
      {
        path: 'userList',
        component: () => import('@/views/user/list'),
        name: 'user',
        meta: {
          icon: 'user',
          title: '用户管理',
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
