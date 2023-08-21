const Route = require("express").Router()
const Mangas = require('../scheme/manga')

let data = process.env.ON_SERVER=="true" ? {'helper': 'no-chapters'} : {}

Route.get('/', async (req, res, next) => {
    let trending = await Mangas.find(data).limit(5).sort({visits : -1}).select("idv4 name type artist visits categorie url_img").exec()
    let mangas = await Mangas.find(data).limit(24).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("pages/Home/index", { 
        title: "Inicio",
        trending: trending,
        mangas: mangas,
        page: "home"
    })
})

module.exports = Route