# 📝 ManagerTask

<p align="center">
  <strong>Aplicação web para gerenciamento e organização de tarefas</strong>
</p>

<p align="center">
  Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento de Software Visual.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/C%23-.NET-blue" alt="C#">
  <img src="https://img.shields.io/badge/ASP.NET%20Core-API-purple" alt="ASP.NET Core">
  <img src="https://img.shields.io/badge/Entity%20Framework%20Core-orange" alt="Entity Framework Core">
  <img src="https://img.shields.io/badge/React-TypeScript-blue" alt="React TypeScript">
  <img src="https://img.shields.io/badge/Material%20UI-MUI-blueviolet" alt="Material UI">
  <img src="https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow" alt="Status">
</p>

---

## 📚 Menu

- [👥 Identificação do projeto](#-identificação-do-projeto)
- [📌 Resumo](#-resumo)
- [🎯 Objetivo](#-objetivo)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [📖 Descrição das funcionalidades](#-descrição-das-funcionalidades)
- [🛠️ Tecnologias utilizadas](#️-tecnologias-utilizadas)
- [🔗 Principais endpoints](#-principais-endpoints)
- [🗂️ Estrutura conceitual](#️-estrutura-conceitual)
- [▶️ Como executar](#️-como-executar)
- [🧪 Testando a aplicação](#-testando-a-aplicação)
- [🤖 Uso de IA](#-uso-de-ia)
- [📚 Considerações finais](#-considerações-finais)

---

## 👥 Identificação do projeto

**Nome:** ManagerTask  
**Curso:** Ciência da Computação  
**Disciplina:** Desenvolvimento de Software Visual

### Integrantes

- `Luiz André Hoffmann Leineker`
- `Matheus Henrique Urban`

---

## 📌 Resumo

O **ManagerTask** é uma aplicação web desenvolvida para auxiliar no gerenciamento e organização de tarefas. O sistema permite que usuários se cadastrem, realizem login e gerenciem suas atividades, possibilitando a criação, consulta, atualização e exclusão de tarefas.

Para facilitar a organização, as tarefas podem ser associadas a rótulos criados pelos próprios usuários.

A aplicação é composta por um backend desenvolvido utilizando **C#, .NET, ASP.NET Core e Entity Framework Core**, responsável pelas regras de negócio, comunicação com o banco de dados e disponibilização dos endpoints, e um frontend desenvolvido com **React e TypeScript**, responsável pela interface e interação com o usuário.

---

## 🎯 Objetivo

O projeto foi desenvolvido como uma atividade acadêmica da disciplina de **Desenvolvimento de Software Visual**, com o objetivo de aplicar na prática conceitos relacionados ao desenvolvimento de aplicações web, utilizando tecnologias voltadas ao backend e frontend.

Através do ManagerTask, são trabalhados conceitos como:

- Desenvolvimento de APIs;
- Desenvolvimento de interfaces web;
- Operações CRUD;
- Persistência de dados;
- Relacionamento entre entidades;
- Validação de informações;
- Consumo de APIs REST;
- Utilização do Entity Framework Core;
- Organização e manipulação de dados;
- Separação entre frontend e backend.

---

## ⚙️ Funcionalidades

### 👤 Usuários

- Cadastro de usuários;
- Login utilizando nome de usuário ou e-mail;
- Consulta de usuários;
- Atualização de usuários;
- Exclusão de usuários;
- Validação de nome de usuário e e-mail.

### 📋 Tarefas

- Criação de tarefas;
- Consulta de uma tarefa específica;
- Listagem das tarefas de um usuário;
- Atualização de tarefas;
- Alteração do status de conclusão;
- Exclusão de tarefas;
- Associação de rótulos às tarefas;
- Definição de descrição e data de vencimento.

### 🏷️ Rótulos

- Criação de rótulos;
- Listagem dos rótulos de um usuário;
- Atualização de rótulos;
- Exclusão de rótulos;
- Associação de rótulos às tarefas;
- Validação de rótulos pertencentes ao usuário.

### 🖥️ Interface

- Página inicial;
- Tela de cadastro;
- Tela de login;
- Dashboard para gerenciamento de tarefas;
- Listagem e pesquisa de tarefas;
- Criação e edição de tarefas;
- Gerenciamento de rótulos;
- Navegação entre as páginas da aplicação.

---

## 📖 Descrição das funcionalidades

### 👤 Gerenciamento de usuários

O ManagerTask possui funcionalidades para realizar o gerenciamento dos usuários cadastrados no sistema.

Um usuário pode criar uma conta informando nome de usuário, e-mail e senha, além de poder consultar, atualizar ou excluir seu cadastro.

A aplicação também possui uma funcionalidade de login, permitindo que o usuário acesse o sistema utilizando seu nome de usuário ou e-mail e senha.

Durante o cadastro e atualização, o sistema verifica se o nome de usuário ou e-mail já estão sendo utilizados, evitando registros duplicados.

---

### 📋 Gerenciamento de tarefas

As tarefas representam as atividades que serão gerenciadas pelo usuário.

Ao criar uma tarefa, é necessário vinculá-la a um usuário existente. Uma tarefa pode possuir informações como:

- Nome;
- Descrição;
- Data de vencimento;
- Status de conclusão;
- Rótulo.

O sistema permite consultar todas as tarefas pertencentes a um usuário ou consultar uma tarefa específica.

Também é possível atualizar os dados de uma tarefa, alterar seu status entre concluída e não concluída e excluir uma tarefa.

---

### 🏷️ Gerenciamento de rótulos

Os rótulos são utilizados para auxiliar na organização das tarefas.

Cada rótulo pertence a um usuário e pode ser associado às tarefas desse mesmo usuário.

O sistema verifica essa relação para impedir que uma tarefa utilize um rótulo pertencente a outro usuário.

---

### 🖥️ Interface web

O frontend do ManagerTask foi desenvolvido utilizando React e TypeScript, proporcionando uma interface para interação com as funcionalidades disponibilizadas pela API.

A interface permite realizar o cadastro e login, visualizar tarefas, pesquisar atividades, criar, atualizar e excluir tarefas, além de gerenciar os rótulos.

A comunicação entre frontend e backend é realizada por meio de requisições HTTP, utilizando a biblioteca Axios.

---

## 🔄 Operações CRUD

O projeto utiliza o conceito de **CRUD**, que representa as quatro principais operações realizadas sobre os dados:

| Operação | Significado | Utilização |
|---|---|---|
| **Create** | Criar | Cadastro de usuários, tarefas e rótulos |
| **Read** | Consultar | Consulta de usuários, tarefas e rótulos |
| **Update** | Atualizar | Alteração dos dados cadastrados |
| **Delete** | Excluir | Remoção dos registros |

Além das operações CRUD, a API possui uma operação específica para alteração do status de conclusão das tarefas.

---

## 🛠️ Tecnologias utilizadas

### Backend

#### C#

Linguagem utilizada no desenvolvimento da aplicação e implementação das regras da API.

#### .NET / ASP.NET Core

Framework utilizado para criação, execução e disponibilização dos endpoints da API.

#### Entity Framework Core

Utilizado para realizar a comunicação entre a aplicação e o banco de dados, permitindo trabalhar com as entidades do sistema através de código C#.

#### Banco de dados

Utilizado para armazenar os dados dos usuários, tarefas e rótulos.

---

### Frontend

#### React

Biblioteca utilizada para construção da interface web através de componentes, permitindo organizar e reutilizar elementos da aplicação.

#### TypeScript

Superset do JavaScript utilizado para adicionar tipagem estática ao frontend, facilitando a organização e identificação de erros durante o desenvolvimento.

#### Create React App

Ferramenta utilizada para inicialização e estruturação do projeto React com TypeScript.

---

### Bibliotecas do frontend

| Biblioteca | Utilização |
|---|---|
| **React Router DOM** | Gerenciamento de rotas e navegação entre as páginas da aplicação. |
| **Axios** | Realização de requisições HTTP para comunicação com o backend. |
| **Material UI (MUI)** | Componentes visuais para construção da interface. |
| **MUI Icons** | Ícones utilizados nos componentes e na interface. |
| **Emotion** | Biblioteca utilizada pelo Material UI para estilização e gerenciamento de estilos. |
| **TanStack Query** | Biblioteca para gerenciamento de requisições, cache e estado de dados provenientes de APIs. |
| **React Hook Form** | Gerenciamento de formulários e controle de dados inseridos pelo usuário. |
| **Zod** | Validação e definição de estruturas de dados. |
| **Hook Form Resolver** | Integração entre bibliotecas de validação, como Zod, e React Hook Form. |
| **Day.js** | Biblioteca para manipulação e formatação de datas. |

---

## 🔗 Principais endpoints

### Usuários

| Método | Endpoint | Função |
|---|---|---|
| `POST` | `/user/create` | Criar usuário |
| `POST` | `/user/login` | Realizar login |
| `GET` | `/user/{id}` | Consultar usuário |
| `PUT` | `/user/update/{id}` | Atualizar usuário |
| `DELETE` | `/user/delete/{id}` | Excluir usuário |

### Tarefas

| Método | Endpoint | Função |
|---|---|---|
| `POST` | `/tasks/create` | Criar tarefa |
| `GET` | `/tasks/list/{userId}` | Listar tarefas do usuário |
| `GET` | `/tasks/{id}` | Consultar tarefa |
| `PUT` | `/tasks/update/{id}` | Atualizar tarefa |
| `PATCH` | `/tasks/status/{id}` | Alterar status |
| `DELETE` | `/tasks/delete/{id}` | Excluir tarefa |

### Rótulos

| Método | Endpoint | Função |
|---|---|---|
| `POST` | `/label/create` | Criar rótulo |
| `GET` | `/label/list/{userId}` | Listar rótulos |
| `PUT` | `/label/update/{id}` | Atualizar rótulo |
| `DELETE` | `/label/delete/{id}` | Excluir rótulo |

---

## 🗂️ Estrutura conceitual

O sistema possui três entidades principais:

```text
                   ┌──────────────┐
                   │     User     │
                   │   Usuário    │
                   └──────┬───────┘
                          │
                 possui   │
                          │
             ┌────────────▼────────────┐
             │          Task           │
             │         Tarefa          │
             └────────────┬────────────┘
                          │
                   possui │
                          │
             ┌────────────▼────────────┐
             │         Label           │
             │         Rótulo          │
             └─────────────────────────┘
```

A relação principal do sistema ocorre entre usuários e tarefas, enquanto os rótulos podem ser utilizados para organizar as tarefas de cada usuário.

---

## ▶️ Como executar

### Pré-requisitos

Para executar o projeto, é necessário possuir:

- [.NET SDK](https://dotnet.microsoft.com/download);
- [Node.js e npm](https://nodejs.org/);
- Git;
- Banco de dados configurado para a aplicação.

### 📥 Clonando o repositório

Clone o repositório:

```bash
git clone https://github.com/LuizLeineker/ManagerTask.git
```

Acesse a pasta do projeto:

```bash
ManagerTask
```

---

### 🚀 Executando o backend

Acesse a pasta do backend, API`.

Restaure as dependências:

```bash
dotnet restore
```

Atualize o banco de dados:

```bash
dotnet ef database update
```

Execute a API:

```bash
dotnet run
```

Após a execução, o terminal informará o endereço em que a API estará disponível.

---

### 🖥️ Executando o frontend

Acesse a pasta do frontend:

```bash
cd my-app
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm start
```

O frontend será iniciado no ambiente de desenvolvimento, normalmente disponibilizado em:

```text
http://localhost:3000
```

---

## 🧪 Testando a aplicação

Após iniciar o backend e frontend, a aplicação poderá ser acessada pelo navegador.

O frontend realizará as requisições para a API, permitindo utilizar as funcionalidades disponíveis na interface.

Os endpoints do backend também podem ser testados utilizando ferramentas de requisições HTTP, como **Postman**, **Insomnia** ou outra ferramenta compatível.

Exemplo de criação de usuário:

```http
POST /user/create
```

```json
{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "123456"
}
```

A API realizará as validações necessárias, caso os dados sejam válidos, o usuário será cadastrado no banco de dados.

---

## 🤖 IA

A documentação do projeto foi desenvolvida com o auxílio de Inteligência Artificial, conforme solicitado na proposta da atividade.

### Ferramentas utilizadas

- ChatGPT;

### Forma de utilização

A ferramenta foi utilizada durante a elaboração do README para auxiliar na:

Organização da estrutura da documentação;
Criação e revisão do resumo do projeto;
Descrição das funcionalidades;
Organização dos endpoints;
Correção gramatical e ortográfica;
Padronização da linguagem utilizada na documentação.

### Revisões realizadas pela equipe

As sugestões geradas pelas ferramentas foram analisadas pelos integrantes da equipe, que realizaram ajustes de acordo com a estrutura, os requisitos e o funcionamento do projeto.

---

## 📚 Considerações finais

O **ManagerTask** permitiu à equipe aplicar conceitos de desenvolvimento de software na construção de uma aplicação web para gerenciamento de tarefas, integrando backend e frontend.

O projeto também possibilitou a prática de conceitos relacionados a **C#, .NET, ASP.NET Core, Entity Framework Core, React, TypeScript, consumo de APIs, banco de dados e operações CRUD**, contribuindo para o desenvolvimento das habilidades técnicas trabalhadas durante a disciplina.

---

<p align="center">
  <strong>ManagerTask</strong><br>
  Projeto acadêmico — Desenvolvimento de Software Visual
</p>
