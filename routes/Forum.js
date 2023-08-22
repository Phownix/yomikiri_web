const Route = require("express").Router()

Route.get('/', async (req, res, next) => {
    res.render("pages/Forum/index", { 
        title: "Foro"
    })
})


module.exports = Route