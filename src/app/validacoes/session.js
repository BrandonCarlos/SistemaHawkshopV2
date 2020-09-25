const Usuario = require('../models/Usuario')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
  const { email, senha } = req.body

  const usuario = await Usuario.buscarUm({ where: { email } })

  if (!usuario) return res.render("session/login", {
    usuario: req.body,
    erro: "Usuário não cadastrado!"
  })

  const passou = await compare(senha, usuario.senha)

  if(!passou) return res.render("session/login", {
    usuario: req.body,
    erro: "Senha incorreta."
  })

  req.usuario = usuario
  
  next()
}


module.exports = {
  login
}