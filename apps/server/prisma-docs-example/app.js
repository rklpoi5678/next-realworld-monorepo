const express =  require('express')
const path = require('path')

const app = express()

app.use('/' , express.static(path.join(__dirname, 'public')))

app.listen(3000,  () => {
    console.log("DB 문서 사이트가 3000번  포트에서 실행중.")
})