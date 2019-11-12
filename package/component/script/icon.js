const path = require('path')
const fs = require('fs')
const download = require('download')

module.exports = {
  setCompIcon: function (filePath) {
    download(`https://at.alicdn.com/t/${filePath}.js`).then((data) => {
      fs.writeFileSync(path.resolve(__dirname, `../src/Icon/iconfont.svg.js`), data)

      console.log(`iconfont download success`)
    })
  }
}
