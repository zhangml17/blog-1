const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = (author,keyword) => {
    author = escape(author)
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author = ${author} `
    }

    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += 'order by createtime desc;'

    return exec(sql)
}

const getDetail = (id) => {
    id = escape(id)
    let sql =  `select * from blogs where id = ${id}; `
    // 因为返回的是blog对象的数组，且该数组只有一个元素，我们只要该元素就行了
    return exec(sql).then(blogsArr=>{
        return blogsArr[0]
    })
}

const newBlog = (blogData) => {
    let {title, content, author} = blogData
    // 先xss后escape
    title = escape(xss(title))
    content = escape(xss(content))
    author = escape(author)

    const createtime = Date.now()
    let sql = `insert into blogs(title,content,createtime,author) values(${title},
            ${content}, ${createtime}, ${author})`
    return exec(sql).then(insertData=>{
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id,blogData) => {
    let { title, content } = blogData
    title = escape(title)
    content = escape(content)
    id = escape(id)

    let sql = `update blogs set title = ${title}, content = ${content} where id = ${id}; `
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const deleteBlog = (id, author) => {
    id = escape(id)
    author = escape(author)

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