const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')
const Produto = require('../models/Produto')


module.exports = {
  async buscarUm(filters) {
    let query = "SELECT * FROM usuarios"

    Object.keys(filters).map(key => {
      // WHERE | OR | AND
      query = `${query} 
      ${key}
      `

      Object.keys(filters[key]).map(campo => { //field
        query = `${query} ${campo} = '${filters[key][campo]}'`
      })
    })

    const results = await db.query(query)
    return results.rows[0]
  },

  async criar(data) {
    try {
      const query = `
      INSERT INTO usuarios (
        nome,
        email,
        senha,
        cpf_cnpj,
        cep,
        endereco
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

      //Hash da senha, iremos fazer uma CRIPTOGRAFIA DE SENHA


      //Como nosso BANCO DE DADOS só aceita INTEGER, na linha abaixo RESOLVE pois exemplo: 1,23 no BANCO DE DADOS: 123
      //D = somente números,  g = global, o usuário só podera digitar NÚMEROS
      const senhaHash = await hash(data.senha, 8)

      const values = [
        data.nome,
        data.email || 30,
        senhaHash,
        data.cpf_cnpj.replace(/\D/g, ""),
        data.cep.replace(/\D/g, ""),
        data.endereco
      ]

      const results = await db.query(query, values)

      return results.rows[0].id
    } catch (err) {
      console.error(err)
    }

  },
  async atualizar(id, campos) {
    let query = "UPDATE usuarios SET"

    Object.keys(campos).map((key, index, array) => {
      if ((index + 1) < array.length) {
        query = `${query}
          ${key} = '${campos[key]}',
        `
      } else {
        //ultima iteração
        query = `${query}
          ${key} = '${campos[key]}'
          WHERE id = ${id}
        `
      }
    })

    await db.query(query)
    return
  },
  async deletar(id) {
    //Pegar todos os produtos
    let results = await db.query("SELECT * FROM produtos WHERE usuario_id = $1", [id])
    const produtos = results.rows

    //dos produtos, pegar todas as imagens
    const todosArquivosPromise = produtos.map(produto =>
      Produto.arquivos(produto.id))

    let promiseResults = await Promise.all(todosArquivosPromise)

    //rodas a remoção do usuário
    await db.query('DELETE FROM usuarios WHERE id = $1', [id])

    //remover as imagens da pasta public
    promiseResults.map(results => {
      results.rows.map(arquivo => {
        try {
          fs.unlinkSync(arquivo.caminho)
        } catch(err) {
          console.error(err)
        }

      })
    })


  }
}