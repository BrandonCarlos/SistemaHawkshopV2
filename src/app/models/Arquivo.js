const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  criar({ filename, path, produto_id }) {

    const query = `
      INSERT INTO arquivos (
        nome,
        caminho,
        produto_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `
    const values = [
      filename,
      path,
      produto_id

    ]

    return db.query(query, values)

  },

  async deletar(id) {

    try {
      const result = await db.query(`SELECT * FROM arquivos WHERE id = $1`, [id])
      const arquivo = result.rows[0]
      fs.unlinkSync(arquivo.caminho)

      return db.query(`
      DELETE FROM arquivos WHERE id = $1 
    `, [id])

    } catch (err) {
      console.error(err)
    }

  }
}