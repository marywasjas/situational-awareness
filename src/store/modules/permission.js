import { asyncRoutes, constantRoutes } from '@/router'
import { getAlarmDeviceAll } from '@/api/alarm'
/* Layout */
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateRoutesRoute({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getAlarmDeviceAll().then(res => {
        const data = res || []
        const listRoute = []
        data.filter(item => item.isShow !== '0').map(el => {
          listRoute.push({
            path: `alarmDevice${el.deviceId}`,
            component: () => import('@/views/alarm/device'),
            name: `AlarmDevice${el.deviceId}`,
            meta: { title: el.deviceName, affix: true }
          })
        })
        const accessedRoutes = [
          {
            path: '/',
            component: Layout,
            redirect: '/alarm',
            meta: { title: '集团告警列表', icon: 'el-icon-message-solid', affix: true },
            children: [...listRoute,
              {
                path: 'alarm',
                component: () => import('@/views/alarm/index'),
                name: 'Alarm',
                meta: { title: '全部', affix: true }
              }
            ]
          },
          {
            path: '/device',
            component: Layout,
            redirect: '/device/index',
            children: [
              {
                path: 'index',
                component: () => import('@/views/device/index'),
                name: 'Device',
                meta: { title: '设备管理', affix: true, icon: 'el-icon-setting', }
              }
            ]
          },
          {
            path: '/alarmSub',
            component: Layout,
            redirect: '/alarmSub',
            meta: { title: '子公司告警列表', icon: 'el-icon-bell', affix: true },
            children: [{
              path: `subAlarmDeviceYh`,
              component: () => import('@/views/alarmSub/device'),
              name: `SubAlarmDeviceYh`,
              meta: { title: '光大银行', key: 'YH', affix: true }
            }, {
              path: `subAlarmDeviceZq`,
              component: () => import('@/views/alarmSub/device'),
              name: `SubAlarmDeviceZq`,
              meta: { title: '光大证券', key: 'ZQ', affix: true }
            }, {
              path: `subAlarmDeviceBx`,
              component: () => import('@/views/alarmSub/device'),
              name: `SubAlarmDeviceBx`,
              meta: { title: '光大保险', key: 'BX', affix: true }
            }, {
              path: `subAlarmDeviceXt`,
              component: () => import('@/views/alarmSub/device'),
              name: `SubAlarmDeviceXt`,
              meta: { title: '光大信托', key: 'XT', affix: true }
            },
            {
              path: 'alarmSub',
              component: () => import('@/views/alarmSub/index'),
              name: 'AlarmSub',
              meta: { title: '全部', affix: true }
            }
            ]
          },
        ]
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
