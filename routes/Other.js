const Route = require("express").Router()

Route.get('/dmca', async (req, res, next) => {
    res.render("pages/Others/dmca", { 
        title: "Politica de DMCA",
        page: "dmca"
    })
})

Route.get('/terms-and-conditions', async (req, res, next) => {
    res.render("pages/Others/terms-and-conditions", { 
        title: "Términos y condiciones",
        page: "tac"
    })
})

Route.get('/privacy-policies', async (req, res, next) => {
    res.render("pages/Others/privacy-policies", { 
        title: "Políticas de privacidad",
        page: "pop"
    })
})

Route.get('/contact', async (req, res, next) => {
    res.render("pages/Others/contact", { 
        title: "Contacta con nosotros",
        page: "cont"
    })
})

module.exports = Route