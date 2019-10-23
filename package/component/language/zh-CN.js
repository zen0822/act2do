import {
  multiToOne
} from '../util/data/object'

export default multiToOne({
  rc: {
    modal: {
      okBtn: '确定',
      noBtn: '取消'
    },
    input: {
      wrongFormat: '格式错误',
      noEmptyData: '不能为空',
      inputNum: '请输入数字类型',
      noLessNum: '不能小于 {num}',
      noMoreNum: '不能大于 {num}',
      noLessLength: '长度不能小于 {length} 个字符',
      noMoreLength: '长度不能大于 {length} 个字符'
    },
    areaPicker: {
      defaultSelected: '请选择',
      complete: '请完善地区选择'
    }
  }
})
