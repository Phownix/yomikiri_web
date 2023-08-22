const Route = require("express").Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Users = require('./../scheme/user')
const jwt = require('jsonwebtoken');
const env = require("dotenv").config();

Route.get('/login', isAuthenticated, (req, res, next) => {
    res.render('pages/Login/login', { 
        title: 'Iniciar Sesion',
        tk: req.query.fast ?? false
    });
});

Route.get('/signup', isAuthenticated, (req, res, next) => {
    res.render('pages/Login/signup', { title: 'Registrarse' });
});

Route.post('/login', async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await Users.findOne({ username: username });
        if (!user) return next({ type: 'authentication', message: 'Usuario no encontrado.', url: '/login' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return next({ type: 'authentication', message: 'Contraseña incorrecta.', url: '/login' });

        
        req.user = user

        req.login(user, {session: false}, async (err)=>{
            if(err) throw new Error(err);
            const token = jwt.sign({ id: user.idv4,}, process.env.TOKEN_SECRET);

            res.cookie('jwt', token, { httpOnly: false, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });

            return res.redirect('/')
        })
    } catch (error) {
        next(error)
    }
});

Route.post('/signup', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const existingUser = await Users.findOne({ username: username });
        if (existingUser) {
            return res.render('register', { error: 'El nombre de usuario ya está en uso.' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new Users({ 
            idv4: uuidv4(),
            username: username, 
            password: hashedPassword,
            
            image: "https://manganoyomu.org/images/profile/01.jpg",
            status: "Online",
 
            rol: ["Usuario"],
            addedManga: [],
            notifications: [{
                title: "Bienvenido",
                content: "Gracias por registrarte en Yomikiri, desde ahora puedes guardar mangas en tu lista, calificarlos y si quieres puedes agregar mas contenido a la pagina como one-shots, doujins, novelas y mas.",
                date: new Date().toISOString()
            }],

            verification_id: 0,
            verified:false
        });
        await newUser.save();

        res.redirect('/login')
    } catch (error) {
        console.log(error)
        next(error)
    }
});


Route.get('/logout', async (req, res, next) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.redirect('/')
})

function isAuthenticated(req, res, next) {
    if(req.user) throw new Error("User logged");
    next();
}

module.exports = Route