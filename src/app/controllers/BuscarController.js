const { formatarPreco } = require('../../lib/utils')
//Vamos chamar o PRODUTO
const Produto = require('../models/Produto')

module.exports = {
  async index(req, res) {

    try {
      let results, 
        params = {}
        
      const { filter, categoria } = req.query

      if(!filter) return res.redirect("/")

      params.filter = filter

      if(categoria) {
        params.categoria = categoria
      }

      results = await Produto.buscando(params)

      async function getImage(produtoId) {
        let results = await Produto.arquivos(produtoId)
        const arquivos = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.caminho.replace("public", "")}`)
  
        return arquivos[0]
      }

      const produtosPromise = results.rows.map(async produto => {
        produto.img = await getImage(produto.id)
        produto.antigoPreco = formatarPreco(produto.antigo_preco)
        produto.preco = formatarPreco(produto.preco)
        return produto
      })

      const produtos = await Promise.all(produtosPromise)

      const buscar = {
        term: req.query.filter,
        total: produtos.length
      }

      const categorias = produtos.map(produto => ({
        id: produto.categoria_id,
        nome: produto.categoria_nome
      })).reduce((categoriasFiltrado, categoria) => {

        const encontrar = categoriasFiltrado.some(cat => cat.id == categoria.id)

        if(!encontrar) 
        categoriasFiltrado.push(categoria)

        return categoriasFiltrado
      }, [])

      return res.render("buscar/index", { produtos, buscar, categorias })

    }
    catch (err) {
      console.error(err)
    }
  }
}