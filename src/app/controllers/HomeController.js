const { formatarPreco } = require('../../lib/utils')
//Vamos chamar o PRODUTO
const Produto = require('../models/Produto')

module.exports = {
  async index(req, res) {
    let results = await Produto.all()
    const produtos = results.rows

    if(!produtos) return res.send("Produtos não encontrados")

    async function getImage(produtoId) {
      let results = await Produto.arquivos(produtoId)
      const arquivos = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.caminho.replace("public", "")}`)

      return arquivos[0]
    }

    const produtosPromise = produtos.map(async produto => {
      produto.img = await getImage(produto.id)
      produto.antigoPreco = formatarPreco(produto.antigo_preco)
      produto.preco = formatarPreco(produto.preco)
      return produto
    }).filter((produto, index) => index > 2 ? false : true)

    const ultimoAdd = await Promise.all(produtosPromise)

    return res.render("home/index", {produtos: ultimoAdd})

  }
}