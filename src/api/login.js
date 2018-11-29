import request from '@/utils/request'

export function login(username, password) {
  return request({
    method: 'post',
    url: '/api/auth/token',
    params: {
      account: username,
      password: password
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}
