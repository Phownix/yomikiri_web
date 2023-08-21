const Route = require("express").Router()

Route.get('/', (req, res) => {
    res.json({"hola":"mudo"})
})


module.exports = Route