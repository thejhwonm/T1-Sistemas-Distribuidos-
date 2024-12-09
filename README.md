# T1-Sistemas-Distribuidos-

1 - Instalar o banco de dados MongoDB.  
  - No Linux precisa instalar o mongodb-compass para usar a interface gráfica.            
  - Usar o arquivo "popular_banco_de_dados.js" para popular as tabelas do banco de dados criado.             
  - A conexão do banco estará no arquivo "server.js" , linha 5 à 9.  
  - Ao rodar o programa server.js, poderá acessar na web pelo localhost:3000  

2 - Instalar o aplicativo JMeter para realizar os testes.  
  - Ir no caminho: JMeter/apache-jmeter-5.6.3/bin/T1 sistemas distribuidos   
  - Adicionar nessa pasta o arquivo disponível Thread Group 100 users.jmx substituíndo o atual arquivo encontrado na pasta. 
  - Após abrir o JMeter, escolher a opção para abrir um arquivo.           
  - O arquivo escolhido deve ser o Thread Group 100 users.jmx  
                   
3 - Passo a passo no terminal   

- Inicia o mongoDB -> sudo systemctl start mongod      
- Abre a interface gŕafica do mongoDB -> ~/Downloads/JMeter/apache-jmeter-5.6.3/bin mongodb-compass      
- Inicia o servidor -> /Downloads/JMeter/Tdistribuidos node server.js
- Inicia o JMeter -> /Downloads/JMeter/apache-jmeter-5.6.3/bin/ ./jmeter.sh
- Para abrir o mongoDB -> mongosh     
- Link para acessar na WEB -> http://localhost:3000/    

Obs: Baixar o arquivo ZIP e extrair em Downloads     
