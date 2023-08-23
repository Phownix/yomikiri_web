const Route = require("express").Router()
const Blog = require('../scheme/blog')
const Comments = require('../scheme/comment');

const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

Route.get('/', async (req, res, next) => {
    let entries = await Blog.find({}).sort({date: -1}).exec();

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

    let comments = await Comments.aggregate([
        { $match: {in: "blog", content: post.idv4} },
        { $lookup: {from: 'users', localField:'author', foreignField:'idv4', as:'User'}},
        { $sort: {date: -1} },
    ]).exec()

    res.render("pages/Blog/entry", { 
        title: "Entradas del Blog",
        post: post,
        date: date,
        idv4: post.idv4,
        in: "blog",
        comments: comments
    })
})


module.exports = Route