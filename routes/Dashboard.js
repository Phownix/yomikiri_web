const Route = require("express").Router()
const Mangas = require('../scheme/manga')
const Categories = require('../scheme/categories')
const Blog = require('../scheme/blog')
const { v4: uuidv4 } = require('uuid');

const { Queue, UploadClient, uploadFile } = require('@uploadcare/upload-client')
const client = new UploadClient({ publicKey: process.env.SERVER })

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

Route.get('/blog/add', async (req, res, next) => {
    res.render("Dash/add_blog", { 
        title: "Agregar Entrada",
        date: new Date()
    })
})

Route.get('/blog/edit/:id', async (req, res, next) => {
    let edit = await Blog.findOne({idv4: req.params.id}).exec();
    res.render("Dash/edit_blog", { 
        title: "Editar Entrada",
        edit: edit
    })
})


Route.post('/manga/add_manga', async (req, res, next) => {
    try {
        const queue = new Queue(10);
        let image_list = []
        req.body.idv4 = uuidv4();
        req.body.visible = true;
        req.body.nsfw = req.body.nsfw ? true : false;

        req.body.url_img = await client.uploadFile(req.files.url_img.data, {contentType: req.files.url_img.mimetype, fileName: req.files.url_img.name})
        req.body.url_img = req.body.url_img.cdnUrl
        req.files.images = req.files.images.length > 0 ? req.files.images : [req.files.images]

        const promises = req.files.images.map((file, idx) => {
            const fileName = file.name
            return queue
                .add(() =>
                    uploadFile(file.data, {
                    publicKey: process.env.SERVER,
                    contentType: file.mimetype,
                    fileName
                    })
                )
                .then((fileInfo) => {
                    console.log(fileInfo)
                    image_list.push({
                        uuid: fileInfo.uuid,
                        name: fileName,
                        mimeType: fileInfo.mimeType,
                        size: fileInfo.size,
                        idx: idx,
                        url:fileInfo.cdnUrl
                    })
                    }
                )
        })
        await Promise.all(promises) 

        req.body.images = image_list

        const _manga = new Mangas(req.body);
        await _manga.save();
    
        console.log(_manga)
    
        res.redirect('/dash/manga')
    } catch (error) {
        next(error)   
    }
})

Route.post('/manga/add_categorie', async (req, res, next) => {
    req.body.idv4 = uuidv4();
    req.body.visible = req.body.visible ? true : false;
    req.body.nsfw = req.body.nsfw ? true : false;

    const _categorie = new Categories(req.body);
    await _categorie.save();

    res.redirect('/dash/manga/add_categorie')
})

Route.post('/blog/add', async (req, res, next) => {
    try{
        req.body.idv4 = uuidv4();

        const _blog = new Blog(req.body);
        await _blog.save();

        res.redirect('/blog')
    } catch (Error){
        next(Error)
    }
})



Route.post('/blog/edit', async (req, res, next) => {
    try{
        await Blog.findOneAndUpdate({idv4: req.body.idv4}, req.body).exec();

        res.redirect('/blog/'+req.body.idv4)
    } catch (Error){
        next(Error)
    }
})


module.exports = Route