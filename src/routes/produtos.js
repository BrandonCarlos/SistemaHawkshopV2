//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const ProdutoController = require('../app/controllers/ProdutoController')
const BuscarController = require('../app/controllers/BuscarController')
const { soUsuarios } = require('../app/middlewares/session')

//Buscar
routes.get('/buscar', BuscarController.index)

// Produtos
routes.get('/criar', soUsuarios,  ProdutoController.criar)

routes.get('/:id', ProdutoController.mostrar)
//Atualizar - UPDATE
routes.get('/:id/editar', soUsuarios, ProdutoController.editar)

routes.post('/', soUsuarios, multer.array("fotos", 6), ProdutoController.salvar)

//Atualizar o produto
routes.put('/', soUsuarios, multer.array("fotos", 6), ProdutoController.atualizar)

//Excluindo o produto
routes.delete('/', soUsuarios, ProdutoController.deletar)


module.exports = routes