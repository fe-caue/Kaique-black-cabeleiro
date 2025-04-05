const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Criando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // seu usuário do MySQL
  password: '',  // sua senha do MySQL
  database: 'cadastro_servicos'  // nome do banco de dados
});

// Verificando a conexão
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

const app = express();

// Middleware para processar o corpo das requisições (formulários)
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para obter todos os serviços
app.get('/servicos', (req, res) => {
  const sql = 'SELECT * FROM servicos';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Rota para cadastrar um cliente
app.post('/cadastrar', (req, res) => {
  const { nome, email, telefone, servico } = req.body;

  // Verifica se o serviço existe no banco de dados
  const sql = 'SELECT * FROM servicos WHERE id = ?';
  db.query(sql, [servico], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao consultar o banco de dados.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
    }

    // Inserir os dados do cliente no banco de dados
    const insertSql = 'INSERT INTO clientes (nome, email, telefone, servico_id) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [nome, email, telefone, servico], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar o cliente.' });
      }
      res.status(200).json({ success: true, message: 'Cadastro realizado com sucesso!' });
    });
  });
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});