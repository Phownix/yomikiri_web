const Route = require("express").Router()
const Mangas = require('../scheme/manga')

Route.get('/:id', async (req, res, next) => {
    let created;
    let manga = await Mangas.findOneAndUpdate({'idv4': req.params.id}, { $inc: { visits: 3 } }, {upsert: true}).exec()

    manga.images = JSON.parse(JSON.stringify(manga)).images;

    if(manga.images){
        manga.images = typeof(manga.images) == 'string' ? [manga.images] : manga.images;
        manga.images.join();
        manga.images.sort();
    }else{
        manga.images = [];
    }

    if(!manga.createDoujin){
        created = new Date().getFullYear()
    }else{
        created = new Date(manga.createDoujin).getFullYear()
    }

    let images = manga.images.map((e) => {
        return e.split(",");
    })

    res.render("pages/Manga/index", { 
        title: manga.name,
        manga: manga,
        createDoujin: created,
        files: images,
    })
})


module.exports = Route