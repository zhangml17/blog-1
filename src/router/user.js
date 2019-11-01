const { SuccessModel,ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const { set } = require('../db/redis')


const handleUserRouter = (req,res) =>{
    // const method = req.method
    // const url = req.url
    // const path = url.split('?')[0]

    // 用户登陆
    if(req.method === 'POST' && req.path === '/api/user/login'){
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(userData=>{
            if(userData.username){
                // 设置session
                req.session.username = userData.username
                req.session.realname = userData.realname
                // 设置redis
                set(req.sessionId, req.session)
                console.log('req.session', req.session)
                return new SuccessModel('登陆成功')
            }
            return new ErrorModel('用户名或密码不正确')
        })
    }

    // 登陆验证测试
    // if(req.method === 'GET' && req.path === '/api/user/login-test') {
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel(req.session,'登陆成功'))
    //     }
    //     return Promise.resolve(new ErrorModel('用户名或密码不正确'))
    // }

    
}

module.exports = handleUserRouter