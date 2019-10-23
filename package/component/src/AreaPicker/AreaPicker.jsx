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

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { defineMessages, injectIntl, intlShape } from 'react-intl'
import Col from '../../component/Col/Col'
import Row from '../../component/Row/Row'
import { xclass } from '../../util/comp'

import Menu from '../../component/Menu/Menu'
import pickerData from './data.json'

const _xclass = (className) => {
  return xclass.call(this, 'area-picker', className)
}

const language = defineMessages({
  defaultSelected: {
    id: 'rc.areaPicker.defaultSelected'
  },
  complete: {
    id: 'rc.areaPicker.complete'
  }
})

class AreaPicker extends Component {
  constructor(props) {
    super(props)

    this.compName = 'areaPicker' // 组件名字

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      ...this._initData(props),
      verified: false,
      errorTip: ''
    }
  }

  _getLanguage(config, opt) {
    return this.props.intl.formatMessage(config, opt)
  }

  /**
     * 根据传进来的 props 生成数据
     *
     * @param {*} props
     */
  _initData(props) {
    // 省市區等於 -1 表示展示默認值
    // 省市區等於 -2 表示展示省市區數據的第一個值

    let provinceId = props.value.province === undefined
      ? this.props.defaultTextProvince === '' ? -2 : -1
      : props.value.province
    let cityId = props.value.city === undefined
      ? this.props.defaultTextCity === '' ? -2 : -1
      : props.value.city
    let areaId = props.value.area === undefined
      ? this.props.defaultTextArea === '' ? -2 : -1
      : props.value.area
    const areaPickerData = this._changeData(provinceId, cityId, areaId)

    provinceId = provinceId === -2
      ? areaPickerData.province[0].value
      : provinceId
    cityId = cityId === -2
      ? Object.keys(pickerData.provinces[provinceId].citys)[0]
      : cityId
    areaId = areaId === -2
      ? Object.keys(pickerData.provinces[provinceId].citys[cityId].districts)[0]
      : areaId

    return {
      value: Object.assign(props.value, {
        province: provinceId,
        city: cityId,
        area: areaId
      }),
      text: this._getAreaText(provinceId, cityId, areaId),
      provinceItem: areaPickerData.province,
      cityItem: areaPickerData.city,
      areaItem: areaPickerData.area
    }
  }

  _compClass() {
    return _xclass([
      ''
    ])
  }

  /**
     * 联动数据变化
     */
  _changeData(provinceId, cityId) {
    const provinceData = this.props.defaultTextProvince === '' ? [] : [{
      value: -1,
      text: this.props.defaultTextProvince || this._getLanguage(language.defaultSelected)
    }]
    const cityData = this.props.defaultTextCity === '' ? [] : [{
      value: -1,
      text: this.props.defaultTextCity || this._getLanguage(language.defaultSelected)
    }]
    const areaData = this.props.defaultTextArea === '' ? [] : [{
      value: -1,
      text: this.props.defaultTextArea || this._getLanguage(language.defaultSelected)
    }]

    const provinceListKeys = Object.keys(pickerData.provinces)
    const provinceListValues = Object.values(pickerData.provinces)

    provinceListKeys.forEach((itemProvinceId, provinceIndex) => {
      const provinceName = provinceListValues[provinceIndex].name
      const cityList = provinceListValues[provinceIndex].citys
      let filterProvinceFlat = false

      if (this.props.filter.length > 0) {
        this.props.filter.every((filterCity) => {
          if (provinceName.includes(filterCity)) {
            filterProvinceFlat = true

            return false
          }

          return true
        })
      } else {
        this.props.notFilter.every((filterCity) => {
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

          if (cityId !== -1 & ((cityId === -2 && cityIndex === 0) || (cityId === itemCityId))) {
            const areaListKeys = Object.keys(areaList)
            const areaListValues = Object.values(areaList)

            areaListKeys.forEach((itemAreaId, areaIndex) => {
              const areaInfo = areaListValues[areaIndex]
              const areaName = areaInfo.name

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
  _getAreaText(provinceId, cityId, areaId) {
    let provinceName = ''
    let cityName = ''
    let areaName = ''

    let province = null
    let city = null
    let area = null

    if (provinceId === -1) {
      provinceName = this.props.defaultTextProvince
    } else {
      province = pickerData.provinces[provinceId]
      provinceName = province.name
    }

    if (cityId === -1) {
      cityName = this.props.defaultTextCity
    } else {
      city = province.citys[cityId]
      cityName = city.name
    }

    if (areaId === -1) {
      areaName = this.props.defaultTextArea
    } else {
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
     * 获取 value
     */
  val() {
    return this.state.value
  }

  /**
     * 获取 value
     */
  text() {
    return this.state.text
  }

  /**
     * 验证
     */
  verify() {
    if (this.props.required
            && this.state.value
            && (this.state.value.province === -1 || this.state.value.city === -1 || this.state.value.area === -1)
    ) {
      this.setState({
        verified: false,
        errorTip: this._getLanguage(language.complete)
      })

      return false
    }

    this.setState({
      verified: true,
      errorTip: ''
    })

    return true
  }

  /**
     * 选择框的状态改变
     *
     * @param {object} event
     * @param {string, number} value
     */
  changeHandler({ value, text }, type) {
    const triggerChange = () => {
      this.props.onChange && this.props.onChange({
        emitter: this,
        text: this.state.text,
        value: this.state.value
      })
    }

    if (value === '-1') {
      value = -1
    }

    if (type === 'province') {
      this.setState({
        value: Object.assign(this.state.value, {
          province: value,
          city: -1,
          area: -1
        }),
        text: Object.assign(this.state.text, {
          province: text,
          city: -1,
          area: -1
        }),
        verified: true
      }, triggerChange)
    }

    if (type === 'city') {
      this.setState({
        value: Object.assign(this.state.value, {
          city: value,
          area: -1
        }),
        text: Object.assign(this.state.text, {
          city: text,
          area: -1
        }),
        verified: true
      }, triggerChange)
    }

    if (type === 'area') {
      this.setState({
        value: Object.assign(this.state.value, {
          area: value
        }),
        text: Object.assign(this.state.text, {
          area: text
        }),
        verified: true
      }, triggerChange)
    }

    if (type === 'area') {
      return false
    }

    let areaPickerData = null

    if (type === 'province') {
      areaPickerData = this._changeData(value)

      this.setState({
        value: Object.assign(this.state.value, {
          'city': areaPickerData.city[0].value
        }),
        text: Object.assign(this.state.text, {
          'city': areaPickerData.city[0].text
        })
      })
    } else if (type === 'city') {
      areaPickerData = this._changeData(this.state.value.province, value)
    }

    return this.setState({
      provinceItem: areaPickerData.province,
      cityItem: areaPickerData.city,
      areaItem: areaPickerData.area
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.province !== this.state.value.province ||
            nextProps.value.city !== this.state.value.city ||
            nextProps.value.area !== this.state.value.area
    ) {
      const initState = this._initData(nextProps)

      return this.setState({
        ...initState,
        value: {
          ...nextProps.value,
          ...initState.value
        }
      })
    }

    return this.setState({
      value: nextProps.value
    })
  }

  render() {
    return (
      <div
        className={`${this._compClass()} ${this.props.className}`}
        onClick={this.clickHandler}
      >
        <Row>
          <Col span={4} className='rc-css-p-r'>
            <Menu
              disabled={this.state.provinceItem.length <= 1}
              value={this.state.value.province}
              item={this.state.provinceItem}
              onChange={(opt) => this.changeHandler(opt, 'province')}
              ref='provinceMenu'
            />
          </Col>
          <Col span={4} className='rc-css-p-r'>
            <Menu
              disabled={this.state.cityItem.length <= 1}
              value={this.state.value.city}
              item={this.state.cityItem}
              onChange={(opt) => this.changeHandler(opt, 'city')}
              ref='cityMenu'
            />
          </Col>
          <Col span={4}>
            <Menu
              disabled={this.state.areaItem.length <= 1}
              value={this.state.value.area}
              item={this.state.areaItem}
              onChange={(opt) => this.changeHandler(opt, 'area')}
              ref='areaMenu'
            />
          </Col>
        </Row>
        <div
          className={
            _xclass('error-tip')
          }
          style={{
            display: this.state.verified ? 'none' : ''
          }}
        >{this.state.errorTip}</div>
      </div>
    )
  }
}

AreaPicker.defaultProps = {
  className: '',
  defaultTextProvince: '',
  defaultTextCity: '',
  defaultTextArea: '',
  value: {},
  theme: '',
  filter: [],
  notFilter: [],
  required: false
}

AreaPicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  param: PropTypes.string,
  filter: PropTypes.array,
  notFilter: PropTypes.array,
  multiple: PropTypes.bool,
  theme: PropTypes.string,
  defaultTextProvince: PropTypes.string,
  defaultTextCity: PropTypes.string,
  defaultTextArea: PropTypes.string
}

export default injectIntl(AreaPicker, {
  withRef: true
})
