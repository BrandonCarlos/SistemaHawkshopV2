//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UsuarioController = require('../app/controllers/UsuarioController')
const UsuarioValidar = require('../app/validacoes/usuario')
const SessionValidar = require('../app/validacoes/session')
const { logadoRedirecionarParaUsuarios, soUsuarios } = require('../app/middlewares/session')




//Login/logout
routes.get('/login', logadoRedirecionarParaUsuarios, SessionController.loginForm)
routes.post('/login', SessionValidar.login, SessionController.login)
routes.post('/logout', SessionController.logout)


//reset password / esqueceu senha
//routes.get('/forgot-password', SessaoController.forgotForm)
//routes.get('/resetar-senha', SessaoController.resetarForm)
//routes.post('/forgot-password', SessaoController.forgot)
//routes.post('/resetar-senha', SessaoController.resetar)


//registro de usuario
routes.get('/registrar', UsuarioController.registrarForm)
routes.post('/registrar', UsuarioValidar.salvar, UsuarioController.salvar)//post

routes.get('/', soUsuarios, UsuarioValidar.mostrar, UsuarioController.mostrar)//show
routes.put('/', UsuarioValidar.atualizar, UsuarioController.atualizar)//show
//routes.delete('/', UserController.deletar)//show




//criação
//atualização
//remoção


module.exports = routes