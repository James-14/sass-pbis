import request from '@/utils/request'

function formatRouterList(routerList) {
  var accessedRouters = []
  routerList.forEach(element => {
    accessedRouters.push(element)
    if (element.component && element.component !== '') {
      var componentPath = element.component
      element.component = () => import(`@/views/${componentPath}`)
      if (element.children && element.children.length > 0) {
        element.children = formatRouterList(element.children)
      }
    }
  })
  return accessedRouters
}

export function addRouter(router, routerList) {
  var accessedRouters = formatRouterList(routerList)
  router.addRoutes(accessedRouters)
  router.options.routes = router.options.routes.concat(accessedRouters)
}

export function getDnyChildRouter(router, moduleId) {
  request({
    url: request.adornUrl('/sys/module/getChild'),
    method: 'post',
    params: request.adornParams({
      'moduleId': moduleId
    })
  }).then(({ routerList }) => {
    if (routerList) {
      // if (path && params) {
      //   routerList.forEach(element => {
      //     const subRouterList = element.children
      //     if (subRouterList && subRouterList.length > 0) {
      //       subRouterList.forEach(subElement => {
      //         if (subElement.path === path) {
      //           subElement.props = params
      //         }
      //       })
      //     }
      //   })
      // }
      var accessedRouters = formatRouterList(routerList)
      router.addRoutes(accessedRouters)
      router.options.routes = router.options.routes.concat(accessedRouters)
    }
  })
}
