const db = require('../../config/pool_conexoes');

const ObraModel = {
  getAllObras: async () => {
    const [rows] = await db.query('SELECT * FROM Obras');
    return rows;
  },

  getObraById: async (id) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_obra = ?', [id]);
    return rows[0];
  },

  createObra: async (obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente, categorias, preco, quantidade_em_estoque } = obraData; 
    const query = `
      INSERT INTO Obras (titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente, categorias, preco, quantidade_em_estoque)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente, categorias, preco, quantidade_em_estoque]; 

    const [result] = await db.execute(query, values);
    return result.insertId;
  },

  updateObra: async (id, obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra, categorias, preco, quantidade_em_estoque } = obraData; 
    const query = `
      UPDATE Obras
      SET titulo_obra = ?, descricao_obra = ?, ano_criacao = ?, imagem_obra = ?, categorias = ?, preco = ?, quantidade_em_estoque = ?
      WHERE id_obra = ?
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, categorias, preco, quantidade_em_estoque, id]; 

    const [result] = await db.execute(query, values);
    return result.affectedRows;
  },

  deleteObra: async (id) => {
    const [result] = await db.query('DELETE FROM Obras WHERE id_obra = ?', [id]);
    return result.affectedRows;
  },

  getObrasByClienteId: async (id_cliente) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_cliente = ?', [id_cliente]);
    return rows;
  },

  getObrasVendidasPorArtista: async (id_cliente) => {
    const query = `
      SELECT 
        O.id_obra,              -- Certifique-se de selecionar o id_obra
        O.titulo_obra,
        O.descricao_obra,
        O.ano_criacao,
        O.categorias,
        O.preco,
        PO.quantidade,
        PO.preco_unitario,
        P.id_pedido,
        P.status_pagamento,
        C.id_cliente AS cliente_id,  -- id_cliente do cliente que comprou
        C.nome_cliente,
        C.email_cliente
      FROM 
        Obras O
      INNER JOIN 
        Pedidos_obras PO ON O.id_obra = PO.id_obra
      INNER JOIN 
        Pedidos P ON PO.id_pedido = P.id_pedido
      INNER JOIN 
        Clientes C ON P.id_cliente = C.id_cliente
      WHERE 
        O.id_cliente = ?;
    `;
    
    const [rows] = await db.query(query, [id_cliente]);
    return rows;
  },
};

module.exports = ObraModel;
