const Route = require("express").Router()

Route.get('/', async (req, res, next) => {
    res.render("pages/Account/index", {
        title: "Inicio",
        page: "dash"
    })
})

module.exports = Route