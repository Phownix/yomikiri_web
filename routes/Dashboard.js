const Route = require("express").Router()
const Mangas = require('../scheme/manga')
const Categories = require('../scheme/categories')
const { v4: uuidv4 } = require('uuid');

let data = process.env.ON_SERVER=="true" ? {'helper': 'no-chapters'} : {}

Route.get('/', async (req, res, next) => {
    res.render("Dash/index", { 
        title: "Dashboard"
    })
})

Route.get('/manga/', async (req, res, next) => {
    let mangas = await Mangas.find(data).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("Dash/all", { 
        title: "Ver Mangas Disponibles en el Sitio",
        mangas: mangas
    })
})

Route.get('/manga/add_manga', async (req, res, next) => {
    let genres = await Categories.find().exec()
    res.render("Dash/add_manga", { 
        title: "Agregar Manga",
        genres: genres,
    })
})

Route.get('/manga/add_categorie', async (req, res, next) => {
    res.render("Dash/add_categorie", { 
        title: "Agregar Manga",
    })
})

Route.get('/manga/:id', async (req, res, next) => {
    let manga = await Mangas.find({'idv4': req.params.id}).sort({$natural: 1}).select("idv4 name artist type helper url_img").exec()
    res.render("Dash/manga", { 
        title: "Inicio",
        manga: manga
    })
})


Route.post('/manga/add_manga', async (req, res, next) => {
    req.body.idv4 = uuidv4()
    req.body.nsfw = req.body.nsfw ? true : false;

    const _manga = new Mangas(req.body);
    await _manga.save();

    console.log(_manga)

    res.redirect('/dash/manga')
})

Route.post('/manga/add_categorie', async (req, res, next) => {
    req.body.idv4 = uuidv4();
    req.body.visible = req.body.visible ? true : false;
    req.body.nsfw = req.body.nsfw ? true : false;

    const _categorie = new Categories(req.body);
    await _categorie.save();

    res.redirect('/dash/manga/add_categorie')
})



module.exports = Route