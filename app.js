const express = require('express');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');

const passport = require('./scripts/passport');
const mongoDB = require('./db.js')
const Users = require('./scheme/user')

const app = express();

// Configurar Nunjucks
nunjucks.configure(["template/"], {
  autoescape: true,
  express: app
});

// Middlewares
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(cookieParser());
app.use(fileUpload());

app.use(async (req, res, next) => {
    await mongoDB();
    
    if (req.cookies?.jwt) {
        let jwt_user = await Users.findByIdv4(jwt.verify(req.cookies.jwt, process.env.TOKEN_SECRET).id);
        app.locals.user = jwt_user;
        req.user = jwt_user;
    }else{
        app.locals.user = null;
        req.user = null;
    }
    
    next()
})

require('./scripts/passport.js');

const authenticateJWT = passport.authenticate('jwt', { session: false });

// Rutas
app.use('/', require('./routes/Home'));
app.use('/', require('./routes/Search'));
app.use('/', require('./routes/Other'));
app.use('/', require('./routes/Login'));
app.use('/blog', require('./routes/Blog'));
app.use('/forum', require('./routes/Forum'));

app.use('/dash', authenticateJWT, require('./routes/Dashboard'));

app.use('/account', authenticateJWT, require('./routes/Account'));

app.use('/comment', require('./routes/Comments'));

app.use('/manga', require('./routes/Manga'));
app.use('/manga', require('./routes/Viewer'));

// custom error handler
app.use((req, res, next) => {
    res.status(404).render('404',{
        css: 'Other.css',
        err_title: 'No encontramos la pagina',
        err_flash: ['Unknown error or Page not found'],
    });
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).render('500',{
        css: 'Other.css',
        err_title: err.name ?? 'Error en la pagina',
        err_flash: ['This error usually appears when the template is poorly developed'],
        err: err
    });
})
  

// Iniciar el servidor
module.exports = app