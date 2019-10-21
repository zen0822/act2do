const commonData = require('../apiData/common/common.json')

module.exports = function (server) {
    server.get('/api/common/token', function (req, res) {
        res.send(commonData)
    })
}
