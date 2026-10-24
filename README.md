# Frontend Eventos da Fábrica

Frontend Angular standalone integrado ao backend Spring Boot `br.com.fabrica.eventos`.

## Requisitos
- 1. Instalar o Node.js
Baixe o instalador LTS em https://nodejs.org (pegue o 22.x) e instale com as opções padrão.
Feche e abra o terminal de novo, para ele reconhecer o comando.

2. Conferir a instalação
bash
node -v
npm -v

OBS: Backend Spring Boot rodando em `http://localhost:8080`

## Executar no Windows / Ide VsCode 
1. Abra a ide VsCode 
2. Clique no menu File -> Open Folder -> escolha a pasta do projeto frontend-eventos-fabrica
3. Abra um Terminal na menu Terminal
4. Execute `npm install`. para instalação das dependências
5. Execute `npm start`. para subir a aplicação
6. Acesse `http://localhost:4200`.

O `proxy.conf.json` encaminha chamadas `/api` para `http://localhost:8080`.

## Funcionalidades

- Cadastrar eventos.
- Consultar eventos.
- Excluir evento.
- Exibir mensagens de sucesso e erro.

## Arquitetura

- Frontend Angular.
- Backend Spring Boot.
- Comunicação via API REST.

## Endpoints utilizados

- `POST /api/events`: cadastra um evento e espera HTTP 201 em caso de sucesso.
- `GET /api/events`: consulta a lista de eventos.

O frontend solicita `eventId` manualmente (exatamente 8 caracteres) e gera automaticamente apenas `timestamp`; também envia `type` (`PRODUCTION` ou `QUALITY`) e `description`.
O backend continua responsável por duplicidade e auditoria dos eventos `QUALITY`.

A consulta GET deve estar no `EventController`. O método `listAllEvents()` fica no `EventService` sem `@GetMapping`, retornando `eventRepository.findAll()`.
