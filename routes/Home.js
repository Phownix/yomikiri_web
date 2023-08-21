const Route = require("express").Router()
const Mangas = require('../scheme/manga')

Route.get('/', async (req, res, next) => {
    let trending = await Mangas.find().limit(5).sort({visits : -1}).select("idv4 name type artist visits categorie url_img").exec()
    let mangas = await Mangas.find().limit(24).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("pages/Home/index", { 
        title: "Inicio",
        trending: trending,
        mangas: mangas,
        page: "home"
    })
})

module.exports = Route