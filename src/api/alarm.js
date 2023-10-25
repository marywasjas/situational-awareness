import request from '@/utils/request'

export function getAlarmType() {
  return request({
    url: '/deviceLog/getAllAlarmType',
    method: 'get'
  })
}

export function getAlarmDevice() {
  return request({
    url: '/deviceLog/getAllDeviceName',
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

export function exportAlarm() {
  return request({
    url: '/deviceLog/exportExcel',
    method: 'get',
    responseType: 'blob'
  })
}

