const Route = require("express").Router()
const Mangas = require('../scheme/manga')
const Categories = require('../scheme/categories')

let data = process.env.ON_SERVER=="true" ? {'helper': 'no-chapters'} : {}

Route.get('/explore', async (req, res, next) => {
    let mangas = await Mangas.find(data).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("pages/Explore/index", { 
        title: "Explorar",
        mangas: mangas,
        page: "explore"
    })
})

Route.get('/search', async (req, res, next) => {
    let mangas = await Mangas.find({'name': new RegExp(req.query.q)}).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("pages/Search/index", { 
        title: "Buscaste \""+req.query.q+"\"",
        mangas: mangas,
        page: "",
        search_phrase: req.query.q
    })
})

Route.get('/genres', async (req, res, next) => {
    let genres = await Categories.find().exec()
    res.render("pages/Genres/index", { 
        title: "Generos",
        genres: genres,
        page: "genres"
    })
})

Route.get('/genres/:name', async (req, res, next) => {
    let genre = await Categories.findOne({'name': req.params.name}).exec()
    let mangas = await Mangas.find({'categorie': {$in: [req.params.name]}}).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    
    res.render("pages/Genres/Search", { 
        title: "Genero de "+req.params.name,
        mangas: mangas,
        page: "genres",
        genre: genre
    })
})

module.exports = Route