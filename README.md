# 📝 ManagerTask

<p align="center">
  <strong>API para gerenciamento e organização de tarefas</strong>
</p>

<p align="center">
  Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento de Software Visual.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/C%23-.NET-blue" alt="C#">
  <img src="https://img.shields.io/badge/ASP.NET%20Core-API-purple" alt="ASP.NET Core">
  <img src="https://img.shields.io/badge/Entity%20Framework%20Core-orange" alt="Entity Framework Core">
  <img src="https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow" alt="Status">
</p>

---

## 📚 Menu

- [👥 Identificação](#-identificação-do-projeto)
- [📌 Resumo](#-resumo)
- [🎯 Objetivo](#-objetivo)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [📖 Descrição das funcionalidades](#-descrição-das-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias-utilizadas)
- [🔗 Endpoints](#-principais-endpoints)
- [▶️ Como executar](#️-como-executar)
- [🤖 Uso de IA](#-uso-de-ia)

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

O **ManagerTask** é uma API desenvolvida para auxiliar no gerenciamento e organização de tarefas. O sistema permite que usuários sejam cadastrados e gerenciados, além de possibilitar a criação, consulta, atualização e exclusão de tarefas. Para facilitar a organização das atividades, as tarefas podem ser associadas a rótulos criados pelos próprios usuários. A aplicação foi desenvolvida utilizando **C#, .NET, ASP.NET Core e Entity Framework Core**, aplicando conceitos de desenvolvimento de APIs, persistência de dados e operações CRUD.

---

## 🎯 Objetivo

O projeto foi desenvolvido como uma atividade acadêmica da disciplina de **Desenvolvimento de Software Visual**, com o objetivo de aplicar na prática conceitos relacionados ao desenvolvimento de aplicações utilizando **C# e .NET**.

Através do ManagerTask, são trabalhados conceitos como:

- Desenvolvimento de uma API;
- Operações CRUD;
- Persistência de dados;
- Relacionamento entre entidades;
- Validação de informações;
- Utilização do Entity Framework Core;
- Organização e manipulação de dados.

---

## ⚙️ Funcionalidades

### 👤 Usuários

- Cadastro de usuários;
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
- Associação de rótulos às tarefas.

### 🏷️ Rótulos

- Criação de rótulos;
- Listagem dos rótulos de um usuário;
- Atualização de rótulos;
- Exclusão de rótulos;
- Associação dos rótulos às tarefas;
- Validação de rótulos pertencentes ao usuário.

---

## 📖 Descrição das funcionalidades

### 👤 Gerenciamento de usuários

O ManagerTask possui funcionalidades para realizar o gerenciamento dos usuários cadastrados no sistema.

Um usuário pode ser criado informando seus dados, além de poder consultar, atualizar ou excluir seu cadastro.

Durante o cadastro e atualização, o sistema verifica se o **nome de usuário ou e-mail já estão sendo utilizados**, evitando registros duplicados.

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

## 🔄 Operações CRUD

O projeto utiliza o conceito de **CRUD**, que representa as quatro principais operações realizadas sobre os dados:

| Operação | Significado | Utilização |
|---|---|---|
| **Create** | Criar | Cadastro de usuários, tarefas e rótulos |
| **Read** | Consultar | Consulta de usuários, tarefas e rótulos |
| **Update** | Atualizar | Alteração dos dados cadastrados |
| **Delete** | Excluir | Remoção dos registros |

Além das operações CRUD, a API possui uma operação específica para alteração do **status de conclusão das tarefas**.

---

## 🛠️ Tecnologias utilizadas

### C#

Linguagem utilizada no desenvolvimento da aplicação e implementação das regras da API.

### .NET / ASP.NET Core

Framework utilizado para criação e execução da API.

### Entity Framework Core

Utilizado para realizar a comunicação entre a aplicação e o banco de dados, permitindo trabalhar com as entidades do sistema através de código C#.

### Banco de dados

Utilizado para armazenar os dados dos usuários, tarefas e rótulos.

---

## 🔗 Principais endpoints

### Usuários

| Método | Endpoint | Função |
|---|---|---|
| `POST` | `/user/create` | Criar usuário |
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

A relação principal do sistema ocorre entre **usuários e tarefas**, enquanto os **rótulos** podem ser utilizados para organizar as tarefas de cada usuário.

---

## ▶️ Como executar

### Pré-requisitos

Para executar o projeto, é necessário possuir o **.NET SDK** instalado.

### Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd NOME_DO_PROJETO
```

Restaure as dependências:

```bash
dotnet restore
```

Atualize o banco de dados:

```bash
dotnet ef database update
```

Execute a aplicação:

```bash
dotnet run
```

Após a execução, o terminal informará o endereço em que a API estará disponível.

---

## 🧪 Testando a API

Após iniciar o projeto, os endpoints podem ser testados utilizando ferramentas de requisições HTTP, como **Postman**, **Insomnia** ou outra ferramenta compatível.

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

A API realizará as validações necessárias e, caso os dados sejam válidos, o usuário será cadastrado no banco de dados.

---

## 🤖 Uso de IA

A documentação do projeto foi desenvolvida com o auxílio de **Inteligência Artificial**, conforme solicitado na proposta da atividade.

### Ferramenta utilizada

- **ChatGPT**

### Forma de utilização

A ferramenta foi utilizada durante a elaboração do README para auxiliar na:

- Organização da estrutura da documentação;
- Criação e revisão do resumo do projeto;
- Descrição das funcionalidades;
- Organização dos endpoints;
- Correção gramatical e ortográfica;
- Padronização da linguagem utilizada na documentação.

Foram fornecidas informações sobre o funcionamento do projeto, suas funcionalidades, tecnologias utilizadas e estrutura da API. A partir dessas informações, foram utilizados prompts para gerar e aprimorar os textos presentes nesta documentação.

### Revisões realizadas pela equipe

O conteudo gerado pelo gpt corresponde ao conteudo do projeto.

Foram realizados alguns pequenos ajustes no conteúdo, para que a documentação ficasse totalmente correta.

---

## 📚 Considerações finais

O **ManagerTask** permitiu à equipe aplicar conceitos de desenvolvimento de software na construção de uma API funcional para gerenciamento de tarefas.

O projeto também possibilitou a prática de conceitos relacionados a **C#, .NET, APIs, banco de dados, Entity Framework Core e operações CRUD**, contribuindo para o desenvolvimento das habilidades técnicas trabalhadas durante a disciplina.

---

<p align="center">
  <strong>ManagerTask</strong><br>
  Projeto acadêmico — Desenvolvimento de Software Visual
</p>
