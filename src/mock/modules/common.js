import Mock from 'mockjs'

// 登录
export function login () {
  return {
    url: '/auth/token',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'data': {
        'expire': Mock.Random.natural(60 * 60 * 1, 60 * 60 * 12),
        'token': Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 32)
      }
    }
  }
}
// 获得用户信息
export function getInfo () {
  return {
    url: '/user/info',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'data': {
        'roles': ['test'],
        'name': 'test',
        'avatar': 'avatar'
      }
    }
  }
}

// 退出
export function logout () {
  return {
    url: '/auth/logout',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200
    }
  }
}
