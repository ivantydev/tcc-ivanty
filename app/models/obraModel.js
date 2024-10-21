const db = require('../../config/pool_conexoes');

const ObraModel = {
  getAllObras: async () => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE status_obra = 1');
    return rows;
  },  

  getObrasByClienteId: async (id_cliente) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_cliente = ? AND status_obra = 1', [id_cliente]);
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

  async updateObra(obraId, updateData) {
    const { titulo_obra, descricao_obra, ano_criacao, categorias, preco, quantidade_em_estoque } = updateData;
    
    const sql = 'UPDATE Obras SET titulo_obra = ?, descricao_obra = ?, ano_criacao = ?, categorias = ?, preco = ?, quantidade_em_estoque = ? WHERE id_obra = ?';
    const values = [titulo_obra, descricao_obra, ano_criacao, categorias, preco, quantidade_em_estoque, obraId];

    const [result] = await db.query(sql, values);
    return result.affectedRows; // Retorna o número de linhas afetadas
  },

  deleteObra: async (id) => {
    // Definindo a obra como inativa ao invés de deletar
    const [result] = await db.query('UPDATE Obras SET status_obra = 0 WHERE id_obra = ?', [id]);
    return result.affectedRows;
  },

  getObrasByClienteId: async (id_cliente) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_cliente = ? AND status_obra = 1', [id_cliente]);
    return rows;
  },

  getObrasVendidasPorArtista: async (id_cliente) => {
    const query = `
      SELECT 
        O.id_obra,                      
        O.titulo_obra,                  
        O.imagem_obra,                  
        O.preco AS preco_obra,          
        PO.quantidade                   
      FROM 
        Obras O
      JOIN 
        Pedidos_obras PO ON O.id_obra = PO.id_obra  
      JOIN 
        Pedidos P ON PO.id_pedido = P.id_pedido     
      WHERE 
        O.id_cliente = ? 
        AND P.status_pagamento = 'approved';  
    `;

    const [rows] = await db.query(query, [id_cliente]);
    return rows.map(obra => ({
        ...obra,
        faturamento: (obra.preco_obra * obra.quantidade * 0.85).toFixed(2) // 15% de desconto
    }));
},


  getObraById: async (id_obra) => {
    const query = 'SELECT * FROM Obras WHERE id_obra = ?';
    const [rows] = await db.query(query, [id_obra]);
    return rows[0];
  },

  getObrasByCategoria: async (categoria) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE categorias = ? AND status_obra = 1', [categoria]);
    return rows;
  },

  getObraWithArtista: async (obraId) => {
    const query = `
        SELECT 
            o.id_obra, 
            o.titulo_obra, 
            o.descricao_obra, 
            o.ano_criacao, 
            o.preco, 
            o.imagem_obra, 
            c.nome_cliente AS nome_artista,
            c.perfil_cliente  -- Adicionando perfil_cliente
        FROM 
            Obras o 
        JOIN 
            Clientes c ON o.id_cliente = c.id_cliente
        WHERE 
            o.id_obra = ? AND 
            o.status_obra = 1`; // Filtra pelo ID da obra e pelo status

    try {
        const [rows] = await db.query(query, [obraId]);
        return rows[0]; // Retorna a primeira obra encontrada
    } catch (error) {
        console.error('Erro ao buscar obra com artista:', error);
        throw error; // Lança o erro para ser tratado pelo controlador
    }
  },
};

module.exports = ObraModel;
