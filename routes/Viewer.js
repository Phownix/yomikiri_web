const Route = require("express").Router()
const Mangas = require('../scheme/manga')

Route.get('/:id/view', async (req, res, next) => {
    try {
        let manga = await Mangas.findOne({'idv4': req.params.id}).exec()

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

        res.render("pages/Viewer/index", { 
            title: manga.name,
            manga: manga,
        })
    } catch (error) {
        next(error)
    }
})


module.exports = Route