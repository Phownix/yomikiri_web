const Route = require("express").Router()
const Mangas = require('../scheme/manga')
const Comments = require('../scheme/comment');

Route.get('/:id', async (req, res, next) => {
    try {
        let manga = await Mangas.findOneAndUpdate({'idv4': req.params.id}, { $inc: { visits: 3 } }, {upsert: true}).exec()

        let comments = await Comments.aggregate([
            { $match: {in: "manga", content: manga.idv4} },
            { $lookup: {from: 'users', localField:'author', foreignField:'idv4', as:'User'}},
            { $sort: {date: -1} },
        ]).exec()

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
            created: new Date(manga.created).getFullYear(),
            idv4: manga.idv4,
            in: "manga",
            comments: comments
        })
    } catch (error) {
        next(error)
    }
})


module.exports = Route