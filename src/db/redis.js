const { REDIS_CONF } = require('../conf/db')
const redis = require('redis')

// 创建客户端
const redisClent = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClent.on_connect('error', err=>{
    console.error(err)
})

function set(key, val) {
    if(typeof val === 'object'){
        val = JSON.stringify(val)
    }
    redisClent.set(key, val.toString(), redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject)=>{
        const res = redisClent.get(key,(err, val)=>{
            if(err){
                reject(err)
                return
            }
            if(val === null) {
                resolve(null)
                return
            }

            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (error) {
              resolve(val)  
            } 
         })
        
    })
    return promise
}

module.exports = {
    set,
    get
}