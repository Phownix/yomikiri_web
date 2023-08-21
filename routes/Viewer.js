const Route = require("express").Router()
const Mangas = require('../scheme/manga')

Route.get('/:id/view', async (req, res, next) => {
    let manga = await Mangas.findOne({'idv4': req.params.id}).exec()

    manga.images = JSON.parse(JSON.stringify(manga)).images;

    if(manga.images){
        manga.images = typeof(manga.images) == 'string' ? [manga.images] : manga.images;
        manga.images.join();
        manga.images.sort();
    }else{
        manga.images = [];
    }

    let images = manga.images.map((e) => {
        return e.split(",");
    })

    res.render("pages/Viewer/index", { 
        title: manga.name,
        manga: manga,
        files: images,
    })
})


module.exports = Route