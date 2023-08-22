const Route = require("express").Router()
const Mangas = require('../scheme/manga')

Route.get('/:id', async (req, res, next) => {
    let created;
    let manga = await Mangas.findOneAndUpdate({'idv4': req.params.id}, { $inc: { visits: 3 } }, {upsert: true}).exec()

    manga.images = manga.images.sort(
        (a, b) => {
            if (a.name.toUpperCase() < b.name.toUpperCase()) {
                return -1;
            }
            if (a.name.toUpperCase() > b.name.toUpperCase()) {
                return 1;
            }

            return 0;
        }
    );

    res.render("pages/Manga/index", { 
        title: manga.name,
        manga: manga,
        created: new Date(manga.created).getFullYear()
    })
})


module.exports = Route