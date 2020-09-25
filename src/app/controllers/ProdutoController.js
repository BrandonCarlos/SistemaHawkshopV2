const { formatarPreco, date } = require('../../lib/utils')
const Categoria = require('../models/Categoria')
//Vamos chamar o PRODUTO
const Produto = require('../models/Produto')
const Arquivo = require('../models/Arquivo')

module.exports = {
  criar(req, res) {
    //Pegar categorias
    Categoria.all()
    .then(function(results){
      
      const categorias = results.rows
      return res.render("produtos/criar.njk", { categorias })

    }).catch(function(err) {
      throw new Error(err)
    })

  },
  async salvar(req, res) {
    //Lógica de salvar
    const keys = Object.keys(req.body)

    //Verificando se todos os CAMPOS estão PREENCHIDOS!
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send("Por favor preencha todos os campos!")
      }
    }

    if(req.files.length == 0)
    return res.send('Por favor, envie pelo menos 1 imagem')

    let results = await Produto.criar(req.body)
    const produtoId = results.rows[0].id

    const arquivosPromise = req.files.map(file => Arquivo.criar({ ...file, produto_id: produtoId }))

    await Promise.all(arquivosPromise)

    return res.redirect(`/produtos/${produtoId}/editar`)



  },
  async mostrar(req, res) {

    let results = await Produto.buscar(req.params.id)
    const produto = results.rows[0]

    if(!produto) return res.send("Produto não encontrado!")  

    const { day, hour, minutes, month } = date(produto.atualizado_em)

    produto.publicar = {
      day: `${day}/${month}`,
      hour: `${hour}h${minutes}`,
    }

    produto.antigoPreco = formatarPreco(produto.antigo_preco)
    produto.preco = formatarPreco(produto.preco)

    results = await Produto.arquivos(produto.id)
    const arquivos = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.caminho.replace("public", "")}`
    }))


    return res.render("produtos/mostrar", { produto, arquivos })
  },
  async editar(req, res) {
    let results = await Produto.buscar(req.params.id)
    const produto = results.rows[0]

    if(!produto) return res.send("Produto não encontrado!")

    produto.antigo_preco = formatarPreco(produto.antigo_preco)
    produto.preco = formatarPreco(produto.preco)

    //get categorias
    results = await Categoria.all()
    const categorias = results.rows

    //get imagens
    results = await Produto.arquivos(produto.id)
    let arquivos = results.rows
    arquivos = arquivos.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.caminho.replace("public", "")}`
    }))

    return res.render("produtos/editar.njk", { produto, categorias, arquivos })
  },
  async atualizar(req, res) {
    //Lógica de salvar
    const keys = Object.keys(req.body)

    //Verificando se todos os CAMPOS estão PREENCHIDOS!
    for(key of keys) {
      if(req.body[key] == "" && key != "remover_arquivos") {
        return res.send("Por favor preencha todos os campos!")
      }
    }

    if (req.files.length != 0) {
      const novosArquivosPromise = req.files.map(file => 
        Arquivo.criar({...file, produto_id: req.body.id}))

        await Promise.all(novosArquivosPromise)
    }

    if (req.body.remover_arquivos) {
      const removerArquivos = req.body.remover_arquivos.split(",")
      const ultimoIndex = removerArquivos.length - 1
      removerArquivos.splice(ultimoIndex, 1)

      const removerArquivosPromise = removerArquivos.map(id => Arquivo.deletar(id))

      await Promise.all(removerArquivosPromise)

    }



    //Formatando o preço novamente
    req.body.preco = req.body.preco.replace(/\D/g, "")
    if (req.body.antigo_preco != req.body.preco) {
      const antigoProduto = await Produto.buscar(req.body.id)

      req.body.antigo_preco = antigoProduto.rows[0].preco
    }

    await Produto.atualizar(req.body)

    return res.redirect(`/produtos/${req.body.id}`)

  },
  async deletar(req, res) {
    await Produto.deletar(req.body.id)
    
    return res.redirect('/produtos/criar')
  }
}
