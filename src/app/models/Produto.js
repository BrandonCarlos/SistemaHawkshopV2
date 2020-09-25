const db = require('../../config/db')

module.exports = {
  all() {
    return db.query(`
      SELECT * FROM produtos 
      ORDER BY atualizado_em DESC
    `)
  },
  criar(data){

    const query = `
      INSERT INTO produtos (
        categoria_id,
        usuario_id,
        nome,
        descricao,
        antigo_preco,
        preco,
        quantidade,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `
  
    //Como nosso BANCO DE DADOS só aceita INTEGER, na linha abaixo RESOLVE pois exemplo: 1,23 no BANCO DE DADOS: 123
    data.preco = data.preco.replace(/\D/g, "") //D = somente números,  g = global, o usuário só podera digitar NÚMEROS
    const values = [
      data.categoria_id,
      data.usuario_id || 30,
      data.nome,
      data.descricao,
      data.antigo_preco || data.preco,
      data.preco,
      data.quantidade,
      data.status || 1 //1 = PRODUTO DISPONIVEL, 0 = PRODUTO INDISPONIVEL

    ]
  
    return db.query(query, values)
  
  },
  buscar(id) {
    return db.query('SELECT * FROM produtos WHERE id = $1', [id])
  },
  atualizar(data) {
    const query = `
      UPDATE produtos SET
        categoria_id=($1),
        usuario_id=($2),
        nome=($3),
        descricao=($4),
        antigo_preco=($5),
        preco=($6),
        quantidade=($7),
        status=($8)
      WHERE id = $9
    `

    const values = [
      data.categoria_id,
      data.usuario_id,
      data.nome,
      data.descricao,
      data.antigo_preco,
      data.preco,
      data.quantidade,
      data.status,
      data.id
    ]

    return db.query(query, values)
  },
  deletar(id) {
    return db.query('DELETE FROM produtos WHERE id = $1', [id])
  },
  arquivos(id) {
    return db.query(`
      SELECT * FROM arquivos WHERE produto_id = $1
    `, [id])   
  },
  buscando(params) { //ERRO tive que mudar para "buscando" pois estava "buscar" que é a mesma de acima
    const { filter, categoria } = params
    let query = "",
      filterQuery = `WHERE`

      if(categoria) {
        filterQuery = `${filterQuery}
        produtos.categoria_id = ${categoria}
        AND`
      }

      filterQuery = `
        ${filterQuery}
        produtos.nome ilike '%${filter}%'
        OR produtos.descricao ilike '%${filter}'
      `

      query = `
        SELECT produtos.*,
        categorias.nome AS categoria_nome
        FROM produtos 
        LEFT JOIN categorias ON (categorias.id = produtos.categoria_id)
        ${filterQuery}
      `
      return db.query(query)
  }

  }