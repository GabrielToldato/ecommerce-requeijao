
# E-commerce Requeijão & Cia

## Sobre o projeto

Projeto de desenvolvimento de uma aplicação de comércio eletrônico para venda de produtos alimentícios, com funcionalidades de cadastro, autenticação, carrinho de compras e finalização de pedidos.

O projeto também possui documentação de testes funcionais manuais, aplicando conceitos e técnicas de qualidade de software (QA).

## Objetivo

Desenvolver uma aplicação funcional e aplicar conhecimentos de Engenharia de Software e Quality Assurance, contemplando regras de negócio, validações e testes manuais.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- MongoDB Memory Server
- Mongoose
- JWT
- BcryptJS
- Swagger / OpenAPI

### Frontend
- HTML5
- CSS3
- JavaScript

### Qualidade de Software
- Testes funcionais manuais
- Heurísticas de teste
- Particionamento de equivalência
- Análise de valores-limite
- Validação de regras de negócio
- Registro de evidências e resultados

## Funcionalidades

- Cadastro de usuários
- Login e autenticação
- Consulta de produtos
- Adição e remoção de produtos do carrinho
- Cálculo de subtotal e total
- Desconto de 10% para pagamento em dinheiro
- Frete fixo de R$ 45,00 para clientes não VIP
- Frete grátis para clientes VIP
- Classificação VIP após R$ 300,00 em compras confirmadas
- Validação de estoque na inclusão no carrinho e na finalização da compra

## Estrutura do projeto

```text
ecommerce-requeijao/
├── backend/
│   ├── src/
│   ├── swagger/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
├── frontend/
├── documentacao/
│   └── casos-de-teste.md
├── .gitignore
└── README.md
```

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acessar o backend

```bash
cd ecommerce-requeijao/backend
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Copiar `.env.example` para `.env` e configurar as variáveis necessárias.

### 5. Executar o servidor

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

### 6. Acessar a aplicação

Backend:

http://localhost:3000

Frontend:

Abrir `frontend/index.html` no navegador ou utilizar uma extensão como Live Server no VS Code.

## Documentação de QA

Os casos de teste funcionais manuais estão disponíveis em:

`documentacao/casos-de-teste.md`

Os resultados e evidências serão registrados durante a execução dos cenários.

## Observação

O banco de dados utilizado é o MongoDB Memory Server. Os dados são mantidos em memória e reiniciados quando o backend é encerrado.

## Autor

Gabriel Teles Toldato

Projeto desenvolvido para estudos e construção de portfólio em desenvolvimento de software e Quality Assurance.
