const express = require("express");
const router = express.Router();
//FROM AUTH.JS//
// var express = require('express');
// var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
dotenv.config();
/// FROM USERS .JS //////////
var secured = require('../lib/middleware/secured');
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////EVENTUALLY REQUIRE MODEL HERE FOR DB FUNCTIONS ///////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/* GET index page. */
router.get('/', function (req, res, next) {
    console.log(req.user)
    res.render('index', { title: 'Welcome to Passport' });
    });


/* GET about page. */
router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About Passport'
    });
});

/* GET services page. */
router.get('/services', function (req, res, next) {
    res.render('services', { title: 'Passport Services' });
    });


/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.render('user', {
      title: 'Dashboard',
      userProfile: JSON.stringify(userProfile, null, 2)
      
    });
  });

///// FROM AUTH.JS////////////   

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    //////////database query for user email or nickname here 
//  if (if req.user.trip )
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        console.log(user)
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
        });
    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();

    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }

    var logoutURL = new url.URL(
        util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
    );
    var searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});


/* GET contact page. */
router.get('/contact', function (req, res, next) {
    res.render('contact', {
        title: 'Contact our Team'
    });
});

module.exports = router;