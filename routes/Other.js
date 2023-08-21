const Route = require("express").Router()

Route.get('/dmca', async (req, res, next) => {
    res.render("pages/Others/dmca", { 
        title: "Inicio",
        page: "dmca"
    })
})

Route.get('/terms-and-conditions', async (req, res, next) => {
    res.render("pages/Others/terms-and-conditions", { 
        title: "Inicio",
        page: "tac"
    })
})

Route.get('/privacy-policies', async (req, res, next) => {
    res.render("pages/Others/privacy-policies", { 
        title: "Inicio",
        page: "pop"
    })
})

Route.get('/contact', async (req, res, next) => {
    res.render("pages/Others/contact", { 
        title: "Inicio",
        page: "cont"
    })
})

Route.get('/faq', async (req, res, next) => {
    res.render("pages/Others/faq", { 
        title: "Inicio",
        page: "faq"
    })
})

module.exports = Route