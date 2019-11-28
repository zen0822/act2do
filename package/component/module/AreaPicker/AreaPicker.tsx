/**
 * AreaPicker 组件
 *
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {array} value - 初始化下拉菜单值，多选下拉框则为数组
 * @prop {string} param - 表单控件的形参名
 * @prop {array} filter - 过滤不需要的省份
 * @prop {array} notFilter - 只保留这些省份
 * @prop {boolean} required - 必须要选择
 * @prop {boolean} defaultTextProvince - 省默認值
 * @prop {boolean} defaultTextCity - 省默認值
 * @prop {boolean} defaultTextArea - 省默認值
 *
 * @event onChange - 选择框的状态发生改变事件
 */

import './AreaPicker.scss'

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  RefForwardingComponent
} from 'react'
import { defineMessages, useIntl } from 'react-intl'
import Col from '../Col/Col'
import Row from '../Row/Row'
import { xclass } from '../../util/comp'
import config from '../../config.json'

import Select from '../Select'
import pickerDataTmp from './data.json'

type TId = string | number
type TItem = Array<{
  value: string | number
  text: string
}>
type TValue = {
  province: TId
  city: TId
  area: TId
}
type TText = {
  province: string
  city: string
  area: string
}

type TProp = {
  className?: string
  defaultTextProvince?: string
  defaultTextCity?: string
  defaultTextArea?: string
  filter?: Array<string>
  multiple?: boolean
  onChange?: (value: TValue, text: TValue) => void
  param?: string
  notFilter?: Array<string>
  required?: boolean
  theme?: string
  value: TValue
}
interface Api {
  compName: string
  param: string
  txt: () => TText
  val: () => TValue
  verify: () => boolean
}

type TPickerData = {
  provinces: {
    [key: string]: {
      name: string
      citys: {
        [key: string]: {
          name: string
          districts: {
            [key: string]: {
              name: string
            }
          }
        }
      }
    }
  }
}

const pickerData: TPickerData = pickerDataTmp
const compPrefix = config.prefix
const compName = 'input'
const _xclass = (className?: string | Array<string>): string => {
  return xclass(compName, className)
}

const language = defineMessages({
  defaultSelected: {
    id: `${compPrefix}.defaultSelected`
  },
  complete: {
    id: `${compPrefix}.complete`
  }
})

const AreaPicker: RefForwardingComponent<Api, TProp> = ({
  className = '',
  defaultTextProvince = '',
  defaultTextCity = '',
  defaultTextArea = '',
  onChange,
  param = '',
  filter = [],
  notFilter = [],
  required = false,
  value
}, ref): React.ReactElement => {
  const intl = useIntl()
  const preValueRef = useRef<TValue>()

  const [stateValue, setStateValue] = useState<{
    province: TId
    city: TId
    area: TId
  }>({
    province: '',
    city: '',
    area: ''
  })
  const [stateText, setStateText] = useState()
  const [verified, setVerified] = useState(false)
  const [errorTip, setErrorTip] = useState('')
  const [provinceItem, setProvinceItem] = useState<TItem>([])
  const [cityItem, setCityItem] = useState<TItem>([])
  const [areaItem, setAreaItem] = useState<TItem>([])

  function _getLanguage(config: { id: string }, opt?: any): string {
    return intl.formatMessage(config, opt)
  }

  /**
   * 联动数据变化
   */
  function _changeData(provinceId: TId, cityId?: TId): { province: TItem, city: TItem, area: TItem } {
    const provinceData: TItem = defaultTextProvince === '' ? [] : [{
      value: -1,
      text: defaultTextProvince || _getLanguage(language.defaultSelected)
    }]
    const cityData: TItem = defaultTextCity === '' ? [] : [{
      value: -1,
      text: defaultTextCity || _getLanguage(language.defaultSelected)
    }]
    const areaData: TItem = defaultTextArea === '' ? [] : [{
      value: -1,
      text: defaultTextArea || _getLanguage(language.defaultSelected)
    }]

    const provinceListKeys = Object.keys(pickerData.provinces)
    const provinceListValues = Object.values(pickerData.provinces)

    provinceListKeys.forEach((itemProvinceId, provinceIndex) => {
      const provinceName = provinceListValues[provinceIndex].name
      const cityList = provinceListValues[provinceIndex].citys
      let filterProvinceFlat = false

      if (filter.length > 0) {
        filter.every((filterCity) => {
          if (provinceName.includes(filterCity)) {
            filterProvinceFlat = true

            return false
          }

          return true
        })
      } else {
        notFilter.every((filterCity) => {
          if (!provinceName.includes(filterCity)) {
            filterProvinceFlat = true

            return false
          }

          return true
        })
      }

      if (filterProvinceFlat) {
        return false
      }

      provinceData.push({
        text: provinceName,
        value: itemProvinceId
      })

      if ((provinceId === -2 && provinceData.length === 1) || (provinceId === itemProvinceId)) {
        const cityListKeys = Object.keys(cityList)
        const cityListValues = Object.values(cityList)

        cityListKeys.forEach((itemCityId, cityIndex) => {
          const cityInfo = cityListValues[cityIndex]
          const cityName = cityInfo.name
          const areaList = cityInfo.districts

          cityData.push({
            text: cityName,
            value: itemCityId
          })

          if (cityId !== -1 && ((cityId === -2 && cityIndex === 0) || (cityId === itemCityId))) {
            const areaListKeys = Object.keys(areaList)
            const areaListValues = Object.values(areaList)

            areaListKeys.forEach((itemAreaId, areaIndex) => {
              const areaName = areaListValues[areaIndex].name

              areaData.push({
                value: itemAreaId,
                text: areaName
              })
            })
          }
        })
      }
    })

    return {
      province: provinceData,
      city: cityData,
      area: areaData
    }
  }

  /**
   * 获取 province, city, area 名字
   */
  function _getAreaText(provinceId: TId, cityId: TId, areaId: TId): TValue {
    let provinceName = ''
    let cityName = ''
    let areaName = ''

    let province = null
    let city = null
    let area = null

    if (provinceId === -1) {
      provinceName = defaultTextProvince
    } else {
      province = pickerData.provinces[provinceId]
      provinceName = province.name
    }

    if (cityId === -1) {
      cityName = defaultTextCity
    } else if (province) {
      city = province.citys[cityId]
      cityName = city.name
    }

    if (areaId === -1) {
      areaName = defaultTextArea
    } else if (city) {
      area = city.districts[areaId]
      areaName = area.name
    }

    return {
      province: provinceName,
      city: cityName,
      area: areaName
    }
  }

  /**
     * 根据传进来的 props 生成数据
     *
     * @param {*} props
     */
  function initData(): void {
    // 省市區等於 -1 表示展示默認值
    // 省市區等於 -2 表示展示省市區數據的第一個值

    let provinceId = value.province === undefined
      ? defaultTextProvince === '' ? -2 : -1
      : value.province
    let cityId = value.city === undefined
      ? defaultTextCity === '' ? -2 : -1
      : value.city
    let areaId = value.area === undefined
      ? defaultTextArea === '' ? -2 : -1
      : value.area
    const areaPickerData = _changeData(provinceId, cityId)

    provinceId = provinceId === -2
      ? areaPickerData.province[0].value
      : provinceId
    cityId = cityId === -2
      ? Object.keys(pickerData.provinces[provinceId].citys)[0]
      : cityId
    areaId = areaId === -2
      ? Object.keys(pickerData.provinces[provinceId].citys[cityId].districts)[0]
      : areaId

    setStateValue({
      province: provinceId,
      city: cityId,
      area: areaId
    })
    setStateText(_getAreaText(provinceId, cityId, areaId))
    setProvinceItem(areaPickerData.province)
    setCityItem(areaPickerData.city)
    setAreaItem(areaPickerData.area)
  }

  function _compClass(): string {
    return _xclass([
      ''
    ])
  }

  /**
     * 获取 value
     */
  function val(): TValue {
    return stateValue
  }

  /**
     * 获取 value
     */
  function txt(): TText {
    return stateText
  }

  /**
     * 验证
     */
  function verify(): boolean {
    if (required
      && stateValue
      && (stateValue.province === -1 || stateValue.city === -1 || stateValue.area === -1)
    ) {
      setVerified(false)
      setErrorTip(_getLanguage(language.complete))

      return false
    }

    setVerified(true)
    setErrorTip('')

    return true
  }

  /**
     * 选择框的状态改变
     *
     * @param {object} event
     * @param {string, number} value
     */
  function changeHandler(value: TId, text: string, type: 'province' | 'city' | 'area'): void {
    const triggerChange = (value: TValue, text: TValue): void => {
      onChange && onChange(value, text)
    }
    let valueTmp: TValue = stateValue
    let textTmp: TValue = stateText

    if (value === '-1') {
      value = -1
    }

    if (type === 'province') {
      valueTmp = {
        province: value,
        city: -1,
        area: -1
      }
      textTmp = {
        province: text,
        city: -1,
        area: -1
      }

      setVerified(true)
      setStateValue(valueTmp)
      setStateText(textTmp)
      triggerChange(valueTmp, textTmp)
    }

    if (type === 'city') {
      valueTmp = {
        ...stateValue,
        city: value,
        area: -1
      }
      textTmp = {
        ...stateText,
        city: text,
        area: -1
      }

      setStateValue(valueTmp)
      setStateText(textTmp)
      setVerified(false)
      triggerChange(valueTmp, textTmp)
    }

    if (type === 'area') {
      valueTmp = {
        ...stateValue,
        area: value
      }
      textTmp = {
        ...stateText,
        area: text
      }

      setStateValue(valueTmp)
      setStateText(textTmp)
      setVerified(true)
      triggerChange(valueTmp, textTmp)
    }

    if (type === 'area') {
      return
    }

    let areaPickerData = null

    if (type === 'province') {
      areaPickerData = _changeData(value)

      setStateValue({
        ...valueTmp,
        'city': areaPickerData.city[0].value
      })
      setStateText({
        ...textTmp,
        'city': areaPickerData.city[0].text
      })
    } else if (type === 'city') {
      areaPickerData = _changeData(stateValue.province, value)
    }

    if (areaPickerData) {
      setProvinceItem(areaPickerData.province)
      setCityItem(areaPickerData.city)
      setAreaItem(areaPickerData.area)
    }
  }

  if (value.province !== (preValueRef.current && preValueRef.current.province)) {
    preValueRef.current = {
      ...value
    }

    initData()
  }

  useImperativeHandle(ref, () => ({
    compName: 'areaPicker',
    param,
    txt,
    verify,
    val
  }))

  return (
    <div className={`${_compClass()} ${className}`}>
      <Row>
        <Col span={4} className='z-css-p-r'>
          <Select
            disabled={provinceItem.length <= 1}
            value={stateValue.province}
            item={provinceItem}
            onChange={(value, text): void => changeHandler(value, text, 'province')}
          />
        </Col>
        <Col span={4} className='z-css-p-r'>
          <Select
            disabled={cityItem.length <= 1}
            value={stateValue.city}
            item={cityItem}
            onChange={(value, text): void => changeHandler(value, text, 'city')}
          />
        </Col>
        <Col span={4}>
          <Select
            disabled={areaItem.length <= 1}
            value={stateValue.area}
            item={areaItem}
            onChange={(value, text): void => changeHandler(value, text, 'area')}
          />
        </Col>
      </Row>

      <div
        className={_xclass('error-hint')}
        style={{
          display: verified ? 'none' : ''
        }}
      >{errorTip}</div>
    </div>
  )
}

const Comp = forwardRef(AreaPicker)

export default Comp

export {
  Comp,
  Api
}
