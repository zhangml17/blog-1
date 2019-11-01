const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { SuccessModel,ErrorModel } = require('./src/model/resModel')
const { access } = require('./src/utils/log')

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime()+24*60*60*1000)
    return d.toUTCString()
}

// session数据
let SESSION_DATA = {}
// 处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve,reject)=>{
        if(req.method !== 'POST') {
            resolve({})
            return
        }
        console.log(req.headers)
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = ''
        req.on('data',(chunk)=>{
            postData += chunk.toString()
        })

        req.on('end',()=>{
            if(!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

// 每次请求都会执行该方法
const serverHandle = (req,res) => {
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`) 

    res.setHeader('Content-type','application/json')
    
    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])
 
    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item=>{
        if(!item) {
            return
        }
        let arr = item.split('=')
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key] = value
    })

    // 解析session
    let userId = req.cookie.userid
    let needSetCookie = false
    if(userId) {
        if(!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    }else{
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 处理postData
    getPostData(req).then(postData=>{
        req.body = postData

         // 处理blog路由数据
    const blogResult = handleBlogRouter(req,res)
    if(blogResult){
        blogResult.then(blogData => {
            if(needSetCookie){
                res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            res.end(
                JSON.stringify(blogData)
            )
        })
        return
    } 
    // 处理user路由数据
    const userResult = handleUserRouter(req,res) 
    if(userResult){
        userResult.then(userData => {
            if(needSetCookie){
                res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            res.end(
                JSON.stringify(userData)
            )
        })
        return
    }
    // 未命中任何路由，返回404
    res.writeHead(404,{'Content-type':'text/plain'}) 
    res.write('404 NOT Found\n')
    res.end()
    })
}

module.exports = serverHandle