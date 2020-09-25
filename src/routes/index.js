//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const produtos = require('./produtos')
const usuarios = require('./usuarios')


//Home
routes.get('/', HomeController.index)

routes.use('/produtos', produtos)
routes.use('/usuarios', usuarios)


//Atalhos
routes.get('/ads/criar', function (req, res) {
  return res.redirect("/produtos/criar")
})

routes.get('/contas', function (req, res) {
  return res.redirect("/usuarios/login")
})









module.exports = routes