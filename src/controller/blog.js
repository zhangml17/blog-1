const { exec } = require('../db/mysql')

const getList = (author,keyword) => {
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author = '${author}' `
    }

    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += 'order by createtime desc;'

    return exec(sql)
}

const getDetail = (id) => {
    let sql =  `select * from blogs where id = ${id}; `
    // 因为返回的是blog对象的数组，且该数组只有一个元素，我们只要该元素就行了
    return exec(sql).then(blogsArr=>{
        return blogsArr[0]
    })
}

const newBlog = (blogData) => {
    const {title, content, author} = blogData
    const createtime = Date.now()
    let sql = `insert into blogs(title,content,createtime,author) values('${title}',
            '${content}',${createtime},'${author}')`
    return exec(sql).then(insertData=>{
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id,blogData) => {
    const { title, content } = blogData
    let sql = `update blogs set title = '${title}', content = '${content}' where id = ${id}; `
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const deleteBlog = (id, author) => {
    let  sql = `delete from blogs where id=${id} and author = ${author}; `

    return exec(sql).then(delData=>{
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}