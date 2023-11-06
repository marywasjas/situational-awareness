import request from '@/utils/request'

export function getAlarmType() {
  return request({
    url: '/deviceLog/getAllAlarmType',
    method: 'get'
  })
}

export function getAlarmDevice() {
  return request({
    url: '/device/getAllDeviceName',
    method: 'get'
  })
}

export function getAlarmList(params) {
  return request({
    url: '/deviceLog/queryAlarmLogList',
    method: 'get',
    params
  })
}

export function deleteAlarm(params) {
  return request({
    url: '/deviceLog/deleteAlarmLogById',
    method: 'get',
    params
  })
}

export function batchDeleteAlarm(params) {
  return request({
    url: '/deviceLog/deleteAlarmLogBatch',
    method: 'get',
    params
  })
}

export function exportAlarm(params) {
  return request({
    url: '/deviceLog/exportExcel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getAlarmDeviceAll() {
  return request({
    url: '/device/getAllDevice',
    method: 'get'
  })
}

export function deleteAlarmDevice(params) {
  return request({
    url: `/device/delete/id`,
    method: 'get',
    params
  })
}
export function addAlarmDevice(data) {
  return request({
    url: `/device/add`,
    method: 'post',
    data
  })
}
export function updateAlarmDevice(data) {
  return request({
    url: `/device/update`,
    method: 'post',
    data
  })
}

