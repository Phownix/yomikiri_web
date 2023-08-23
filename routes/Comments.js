const Route = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const Comments = require('../scheme/comment');

Route.post('/', async (req, res, next) => {
    try{
        req.body.idv4 = uuidv4();
        req.body.comm = req.body.comm.replaceAll(new RegExp('<[^>]+>', 'g'), '');


        const _comment = new Comments(req.body);
        await _comment.save();

        res.redirect(req.get('referer'))
    } catch (Error){
        next(Error)
    }
})


module.exports = Route