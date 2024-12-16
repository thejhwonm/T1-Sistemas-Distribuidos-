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


// CRUD para Usuários****************************************************************************

// GET para todos os Usuários
app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

// GET para usuários por ID/chave única                                                    
app.get('/busca/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }                                                                     
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Adiciona o Usuário caso não exista nenhum e-mail igual ao informado
app.post('/adiciona/usuarios', async (req, res) => {
    try {
        // Verifica se o e-mail já existe no banco
        const usuarioExistente = await Usuario.findOne({ email: req.body.email });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'Já existe um usuário com esse e-mail.' });
        }

        // Se o e-mail não existir, cria o novo usuário
        const usuario = new Usuario(req.body);
        await usuario.save();
        
        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

// PUT para atualizar um usuário por ID
app.put('/atualiza/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// DELETE para excluir um usuário por ID
app.delete('/remove/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
});



// CRUD para Produtos ****************************************************************************
app.get('/produtos', async (req, res) => {
    const produtos = await Produto.find();
    res.json(produtos);
});

// POST para adicionar produto caso não exista com o mesmo nome
app.post('/adiciona/produtos', async (req, res) => {
    try {
        const produtoExistente = await Produto.findOne({ nome: req.body.nome });
        if (produtoExistente) {
            return res.status(400).json({ error: 'Já existe um produto com esse nome.' });
        }
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).json(produto);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar produto.' });
    }
});

// PUT para atualizar um produto por ID
app.put('/atualiza/produtos/:id', async (req, res) => {
    try {
        const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto atualizado com sucesso!', produto });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
});

// DELETE para excluir um produto por ID
app.delete('/remove/produtos/:id', async (req, res) => {
    try {
        const produto = await Produto.findByIdAndDelete(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir produto.' });
    }
});


// CRUD para Pedidos ****************************************************************************
app.get('/pedidos', async (req, res) => {
    const pedidos = await Pedido.find().populate('usuario_id').populate('itens.produto_id');
    res.json(pedidos);
}); 

// POST para adicionar pedido, verifica se usuário existe
app.post('/adiciona/pedidos', async (req, res) => {
    try {
        const usuarioExistente = await Usuario.findById(req.body.usuario_id);
        if (!usuarioExistente) {
            return res.status(400).json({ error: 'Usuário não encontrado para o pedido.' });
        }
        const pedido = new Pedido(req.body);
        await pedido.save();
        res.status(201).json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
});

// PUT para atualizar um pedido por ID
app.put('/atualiza/pedidos/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido atualizado com sucesso!', pedido });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar pedido.' });
    }
});

// DELETE para excluir um pedido por ID
app.delete('/remove/pedidos/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir pedido.' });
    }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
