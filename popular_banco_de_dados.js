const { faker } = require('@faker-js/faker');
const { MongoClient } = require('mongodb');

faker.locale = 'pt_BR';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const nomeBanco = 'CRUD';

async function gerarDados() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    const db = client.db(nomeBanco);

    // Coleções que serão populadas
    const colecaoUsuarios = db.collection('Usuarios');
    const colecaoPedidos = db.collection('Pedidos');
    const colecaoProdutos = db.collection('Produtos');

    // Populando coleção Usuarios
    // i < 100 onde 1000 é o número de registros na coleção Usuários
    const usuarios = [];
    for (let i = 0; i < 1000; i++) {
      usuarios.push({
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        telefone: faker.phone.number(),
        endereco: {
          rua: faker.location.streetAddress(),
          cidade: faker.location.city(),
          cep: faker.location.zipCode(),
        },
      });
    }
    await colecaoUsuarios.insertMany(usuarios);
    console.log('Coleção Usuarios populada com sucesso!');

    // Populando coleção Produtos
    const produtos = [];
    for (let i = 0; i < 100; i++) {
      produtos.push({
        nome: faker.commerce.productName(),
        descricao: faker.commerce.productDescription(),
        preco: parseFloat(faker.commerce.price()),
        estoque: faker.number.int({ min: 0, max: 100 }),
      });
    }
    await colecaoProdutos.insertMany(produtos);
    console.log('Coleção Produtos populada com sucesso!');

    // Populando coleção Pedidos
    const pedidos = [];
    for (let i = 0; i < 1000; i++) {
      pedidos.push({
        usuario_id: usuarios[Math.floor(Math.random() * usuarios.length)]._id,
        itens: [
          {
            produto_id: produtos[Math.floor(Math.random() * produtos.length)]._id,
            quantidade: faker.number.int({ min: 1, max: 5 }),
          },
        ],
        valor_total: faker.finance.amount(10, 200, 2),
        status: faker.helpers.arrayElement(['em processamento', 'concluído', 'cancelado']),
      });
    }
    await colecaoPedidos.insertMany(pedidos);
    console.log('Coleção Pedidos populada com sucesso!');
  } finally {
    await client.close();
  }
}

gerarDados().catch(console.dir);
