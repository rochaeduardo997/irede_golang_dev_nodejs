<!-- ABOUT THE PROJECT -->
## Sobre

Implementar uma API resful em Nodejs/Golang<br />
Pode ser utilizado uma arquitetura em camadas simples MVC<br />
A API deve ser possível gerenciar os filmes que passam em uma determinando sala de cinema
- Sala (Número da Sala, Descrição)
- Filme (Nome, diretor, duração)
- Uma sala pode ter vários filmes
- um filme pode existir sem uma sala
- Criação de testes unitários (Controller e camada de serviço)
- Utilização do banco mysql
- Configuração do swagger
- compartilhar no github
 
Plus
- docker
- docker-compose 
- paginação dinâmica das consultas
- Dica importante:
  - Obedecer http code


### Feito com

<img align="center" alt="golang" height="60" width="80" src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg" title="Selenium WebDriver">

<!-- USAGE EXAMPLES -->
## Uso
Necessário arquivo .env, .env de exemplo contido no projeto
<br />
Para iniciar o banco de dados:
   ```sh
      docker compose -f ./scripts/dev-docker-compose.yaml up -d
   ```
ou 
   ```sh
      docker-compose -f ./scripts/dev-docker-compose.yaml up -d
   ```
Para executar:
   ```sh
     yarn dev
   ```
