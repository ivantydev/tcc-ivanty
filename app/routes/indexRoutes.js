const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/index");
});

router.get("/home", function (req, res) {
    res.render("pages/home");
});

router.get("/artists", function (req, res) {
    res.render("pages/artists");
});

router.get("/about", function (req, res) {
    res.render("pages/about");
});

router.get("/profile", function (req, res) {
    res.render("pages/profile");
});

router.get('/adm', function (req, res) {
    res.render("pages/admin/index_adm.ejs")
});

router.get('/register', function (req, res) {
    res.render("pages/cadastro.ejs")
});

router.get('/login', function (req, res) {
    res.render("pages/login.ejs")
});

router.get('/buyitem', function (req, res) {
    res.render("pages/buyitem.ejs")
});

router.get('/card', function (req, res) {
    res.render("pages/card.ejs")
});

router.get('/artist_painel', function (req, res) {
    res.render("pages/artistPainel.ejs")
});

router.get('/artist', function (req, res) {
    res.render("pages/artist.ejs")
});

router.get('/requests', function (req, res) {
    res.render("pages/requests.ejs")
});

module.exports = router;
