// import commonLangs from './common'
import compareVersions from 'compare-versions'
const FOREIGN_LANGS = ['en']

export default class Lang {
    constructor(langData) {
        this.data = langData
        this.language = this._getLanguage()
        this.currData = this._getCurrData()
    }

    // 语言包文件的命名取 Language Code 的前两个字符，参考：https://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
    _getLanguage() {
        let browserLang = navigator.language || navigator.userLanguage
        let lang = browserLang.toLowerCase()
        console.log(lang)
        let appversion = window.APP_VERSION
        if ((appversion && compareVersions(appversion, '1.4.15') < 0) || (appversion && compareVersions(appversion, '1.5.0') === 0)) {
            return 'zh'
        }
        return lang === 'zh-cn' ? 'zh' : 'en'
    }

    _getCurrData() {
        console.log(this.language)
        let localLang = this.data[this.language] || {}
        let commonLang = {} // commonLangs[this.language] || {}
        return Object.assign({}, commonLang, localLang)
    }

    getText(key, params = {}) {
        let text = this.currData[key] || ''
        if (typeof (text) === 'string' || typeof (text) === 'number') {
            for (let i in params) {
                text = text.replace(`:${i}`, params[i])
            }
        }
        return text
    }
}

// module.exports = Lang
