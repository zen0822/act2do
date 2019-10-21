import {
    multiToOne
} from '../util/data/object'

export default multiToOne({
    rc: {
        modal: {
            okBtn: '確定',
            noBtn: '取消'
        },
        input: {
            wrongFormat: '格式錯誤',
            noEmptyData: '不能爲空',
            inputNum: '請輸入數字類型',
            noLessNum: '不能小於 {num}',
            noMoreNum: '不能大於 {num}',
            noLessLength: '長度不能小於 {length} 個字符',
            noMoreLength: '長度不能大于 {length} 個字符'
        },
        areaPicker: {
            defaultSelected: '請選擇',
            complete: '請完善地區選擇'
        }
    }
})
