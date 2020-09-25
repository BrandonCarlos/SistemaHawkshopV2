module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    req.session.usuarioId = req.usuario.id
    return res.redirect("/usuarios")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  }
}