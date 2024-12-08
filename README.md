# T1-Sistemas-Distribuidos-

1 - Instalar o banco de dados MongoDB.  
  1.1 - No Linux precisa instalar o mongodb-compass para usar a interface gráfica.            
  1.2 - Usar o arquivo "popular_banco_de_dados.js" para popular as tabelas do banco de dados criado.             
  1.3 - A conexão do banco estará no arquivo "server.js" , linha 5 à 9.  
  1.4 - Ao rodar o programa server.js, poderá acessar na web pelo localhost:3000  

2 - Instalar o aplicativo JMeter para realizar os testes.  
  2.1 - Passo a passo de como criar os testes no JMeter.  
    2.1.1 - Criar um plano de teste (test plan)         
    2.1.2 - Criar uma Thread Group (botão direto em test plan -> add -> Thread(users)  
      - Number of Thread (Users) -> número de usuários realizando a operação. 
      - Ramp-up period (seconds) -> tempo entre cada operaçao.  
    2.1.3 - Criar um Sampler HTTP Request (botão direto em Thread Group -> add -> sampler -> HTTP Request) 
      - protocol [http] -> http                  
      - server name or IP -> localhost  
      - port number -> 3000         
      - HTTP Request -> GET (depende da operação que deseja realizar)    
      - Path: /pedido   
    2.1.4 - Criar uma forma de acompanahr a operação (botão direto em HTTP Request -> selecionado -> add -> listener -> View Results Tree, Summary Report, Aggregate Report, Graph Results, View Results in Table)      
                   
3 - Passo a passo no terminal   

- Inicia o mongoDB -> sudo systemctl start mongod      
- Abre a interface gŕafica do mongoDB -> mongodb-compass      
- Inicia o servidor -> /Downloads/JMeter/Tdistribuidos node server.js
- Inicia o JMeter -> /Downloads/JMeter/apache-jmeter-5.6.3/ ./jmeter.sh
- Para abrir o mongoDB -> mongosh     
- Link para acessar na WEB -> http://localhost:3000/    

Obs: Baixar o arquivo ZIP e extrair em Downloads     
