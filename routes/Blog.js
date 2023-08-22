const Route = require("express").Router()
const Blog = require('../scheme/blog')

const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

Route.get('/', async (req, res, next) => {
    let entries = await Blog.find({}).exec();

    entries = entries.map((x) => {
        return {...x._doc, format: new Date(x.date).getDate() + " " + month[new Date(x.date).getMonth()] + " del " + new Date(x.date).getFullYear() + " a las " + new Date(x.date).getHours() + ":" + new Date(x.date).getMinutes()}
    })
    
    res.render("pages/Blog/index", { 
        title: "Entradas del Blog",
        entries: entries
    })
})

Route.get('/:id', async (req, res, next) => {
    let post = await Blog.findOne({idv4: req.params.id}).exec();
    let rtn = new Date(post.date);
    let date = rtn.getDate() + " " + month[rtn.getMonth()] + " del " + rtn.getFullYear() + " a las " + rtn.getHours() + ":" + rtn.getMinutes()

    res.render("pages/Blog/entry", { 
        title: "Entradas del Blog",
        post: post,
        date: date
    })
})


module.exports = Route