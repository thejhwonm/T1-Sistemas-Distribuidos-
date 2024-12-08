const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conectar ao banco
mongoose.connect('mongodb://localhost:27017/CRUD', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Definir o modelo com o nome da coleção
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nome: String,
    email: String,
    telefone: String,
    endereco: {
        rua: String,
        cidade: String,
        cep: String,
    }
}), 'Usuarios');  

const Produto = mongoose.model('Produto', new mongoose.Schema({
    nome: String,
    descricao: String,
    preco: Number,
    estoque: Number
}), 'Produtos');  

const Pedido = mongoose.model('Pedido', new mongoose.Schema({
    usuario_id: mongoose.Schema.Types.ObjectId,
    itens: [{
        produto_id: mongoose.Schema.Types.ObjectId,
        quantidade: Number
    }],
    valor_total: String,
    status: String
}), 'Pedidos');  

// Configurar o servidor
const app = express();
app.use(bodyParser.json());

// Página inicial com os botões
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página Inicial</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin-top: 50px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    margin: 20px;
                    cursor: pointer;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                }
                button:hover {              
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>CRUD</h1>
            <p>Escolha uma opção abaixo:</p>
            <div>
                <button onclick="window.location.href='/usuarios'">Usuários</button>
                <button onclick="window.location.href='/produtos'">Produtos</button>
                <button onclick="window.location.href='/pedidos'">Pedidos</button>
            </div>
        </body>
        </html>
    `);
});


// CRUD para Usuários
app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

app.post('/usuarios', async (req, res) => {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
});


// CRUD para Produtos
app.get('/produtos', async (req, res) => {
    const produtos = await Produto.find();
    res.json(produtos);
});

app.post('/produtos', async (req, res) => {
    const produto = new Produto(req.body);
    await produto.save();
    res.status(201).json(produto);
});


// CRUD para Pedidos
app.get('/pedidos', async (req, res) => {
    const pedidos = await Pedido.find().populate('usuario_id').populate('itens.produto_id');
    res.json(pedidos);
});

app.post('/pedidos', async (req, res) => {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
