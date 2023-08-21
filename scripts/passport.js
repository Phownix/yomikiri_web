const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const env = require("dotenv").config();

const Users = require('../scheme/user')
const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};


const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await Users.findByIdv4(jwtPayload.id);
        if (!user) throw new Error("No se encontro el usuario");
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;