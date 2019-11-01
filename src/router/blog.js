const { SuccessModel,ErrorModel } = require('../model/resModel')
const { getList ,getDetail, newBlog, updateBlog, deleteBlog }  = require('../controller/blog')

const handleBlogRouter = (req,res) =>{
    // const method = req.method 
    // const url = req.url
    // const path = url.split('?')[0] 
    
    // 获取博客列表  http://localhost:3000/api/blog/list?keyword=A&author=zhangsan
    if(req.method === 'GET' && req.path === '/api/blog/list'){

        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const result =  getList(author,keyword)

        return result.then(listData=>{
            if(listData){
                return new SuccessModel(listData,'获取博客列表成功')
            }
        })
    }
    // 获取博客详情 
    if(req.method === 'GET' && req.path === '/api/blog/detail'){
        const id = req.query.id
        const result = getDetail(id)
        return result.then(detailData=>{
            return new SuccessModel(detailData,'获取博客详情成功')
        })
        
    }
    // 新建博客
    if(req.method === 'POST' && req.path === '/api/blog/new'){
        req.body.author = 'zhangsan'
        const result = newBlog(req.body)
        
        return result.then(data => {
            return new SuccessModel(data,'新建博客成功')
        })
    } 
    // 更新博客
    if(req.method === 'POST' && req.path === '/api/blog/update'){
        const id  = req.query.id
        const result = updateBlog(id,req.body)
        return result.then(flag=>{
            if(flag) {
                return new SuccessModel('更新博客成功')
            }else {
                return new ErrorModel('更新博客失败')
            }
        })
        
        
    }
    // 删除博客
    if(req.method === 'POST' && req.path === '/api/blog/delete'){
        const result = deleteBlog(req.query.id)
        return result.then(flag=>{
            if(flag) {
                return new SuccessModel('删除博客成功')
            }else {
                return new ErrorModel('删除博客失败')
            }
        })
        
    }
}

module.exports = handleBlogRouter 