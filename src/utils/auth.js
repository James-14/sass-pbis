import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AppID = 'APP-ID'
const AppName='APP-NAME'
const CustomerID ="Customer_ID"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAPPID() {
  return Cookies.get(AppID)
}

export function setAPPID(appID) {
  return Cookies.set(AppID, appID)
}

export function removeAPPID() {
  return Cookies.remove(AppID)
}

export function getCustomerID() {
  return Cookies.get(CustomerID)
}

export function setCustomerID(customerID) {
  return Cookies.set(CustomerID, customerID)
}

export function removeCustomerID() {
  return Cookies.remove(CustomerID)
}

export function getAppName() {
  return Cookies.get(AppName)
}

export function setAppName(appName) {
  return Cookies.set(AppName, appName)
}

export function removeAppName() {
  return Cookies.remove(AppName)
}
