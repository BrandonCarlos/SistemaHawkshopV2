const Usuario = require('../models/Usuario')
const { formatarCep, formatarCpfCnpj } = require('../../lib/utils')

module.exports = {
  registrarForm(req, res) {

    return res.render("usuario/registrar")
  },
  async mostrar(req, res) {

    const { usuario } = req

    usuario.cpf_cnpj = formatarCpfCnpj(usuario.cpf_cnpj)
    usuario.cep = formatarCep(usuario.cep)

    return res.render('usuario/index', { usuario })
  },
  async salvar(req, res) {

    const usuarioId = await Usuario.criar(req.body)

    req.session.usuarioId = usuarioId
    
    return res.redirect('/usuarios')
  },
  async atualizar(req, res) {
    // todos os campos
    try {
      const { usuario } = req
      let { nome, email, cpf_cnpj, cep, endereco } = req.body
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      await Usuario.atualizar(usuario.id, {
        nome,
        email,
        cpf_cnpj,
        cep,
        endereco

      })

      return res.render("usuario/index", {
        usuario: req.body,
        success: "Conta atualizada com sucesso!"
      })

    }catch(err) {
      console.error(err)
      return res.render("usuario/index", {
        erro: "Algum erro aconteceu!"
      })
    }
    // se preencheu a senha

    // se a senha são iguais
  },
  async deletar(req, res) {
    try {
      await Usuario.deletar(req.body.id)
      req.session.destroy()

      return res.render("session/login", {
        success: "Conta deletada com sucesso!"
      })

    }catch(err) {
      console.error(err)
      return res.render("usuario/index", {
        usuario: req.body,
        erro: "Erro ao tentar deletar sua conta!"
      })
    }
  }
}