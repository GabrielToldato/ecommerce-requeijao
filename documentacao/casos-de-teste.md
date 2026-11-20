
# Plano de Testes — E-commerce Requeijão & Cia

## 1. Identificação do Projeto

**Projeto:** E-commerce Requeijão & Cia  
**Tipo de teste:** Testes funcionais manuais  
**Abordagem:** Testes baseados em heurísticas  
**Responsável pela execução:** Gabriel Teles Toldato

## 2. Objetivo

Validar as principais funcionalidades do sistema, verificando se os comportamentos implementados atendem aos requisitos funcionais e às regras de negócio.

## 3. Escopo dos Testes

- Cadastro de usuários
- Login
- Consulta de produtos
- Adição de produtos ao carrinho
- Remoção de produtos do carrinho
- Cálculo de valores
- Aplicação de descontos
- Cálculo de frete
- Identificação de clientes VIP
- Finalização de compras
- Validação de estoque

## 4. Casos de Teste


### CT001 — Login com credenciais válidas

**Objetivo:** Validar o acesso de um usuário cadastrado.

**Heurística aplicada:** Caminho positivo e validação de autenticação.

**Pré-condições:**
- Backend em execução.
- Usuário cadastrado no sistema.

**Dados de teste:**
- E-mail: cliente1@email.com
- Senha: 123456

**Passos:**
1. Acessar a tela de login.
2. Informar o e-mail.
3. Informar a senha.
4. Clicar em Entrar.

**Resultado esperado:**
- Login realizado com sucesso.
- Usuário autenticado.
- Token de acesso gerado.
- Área da loja apresentada.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT002 — Login com senha incorreta

**Objetivo:** Verificar se o sistema impede o acesso com senha inválida.

**Heurística aplicada:** Teste negativo e validação de condições inválidas.

**Pré-condições:**
- Usuário previamente cadastrado.

**Dados de teste:**
- E-mail: cliente1@email.com
- Senha: senhaerrada

**Passos:**
1. Acessar a tela de login.
2. Informar o e-mail cadastrado.
3. Informar uma senha incorreta.
4. Clicar em Entrar.

**Resultado esperado:**
- Login recusado.
- Mensagem de credenciais inválidas.
- Usuário permanece na tela de autenticação.
- Nenhum token de acesso é concedido.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT003 — Cadastro com e-mail já existente

**Objetivo:** Validar se o sistema impede o cadastro de e-mail duplicado.

**Heurística aplicada:** Teste negativo e validação de dados duplicados.

**Pré-condições:**
- Usuário cliente1@email.com já cadastrado.

**Dados de teste:**
- Nome: Cliente Teste
- E-mail: cliente1@email.com
- Senha: 123456

**Passos:**
1. Acessar a opção de cadastro.
2. Preencher os campos obrigatórios.
3. Informar o e-mail já cadastrado.
4. Enviar o formulário.

**Resultado esperado:**
- Cadastro recusado.
- Mensagem informando que o e-mail já está em uso.
- Nenhum usuário duplicado criado.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT004 — Adicionar produto respeitando o estoque

**Objetivo:** Verificar se o sistema permite adicionar produtos respeitando a quantidade disponível.

**Heurística aplicada:** Análise de valores-limite e validação de estoque.

**Pré-condições:**
- Usuário autenticado.
- Variação do produto com estoque inicial de 15 unidades.
- Carrinho vazio.

**Dados de teste:**
- Produto: Requeijão em Barra.
- Variação: 500g.
- Quantidade válida: 15.
- Quantidade inválida: 16.

**Passos:**
1. Adicionar 15 unidades ao carrinho.
2. Consultar o carrinho.
3. Tentar adicionar mais 1 unidade.

**Resultado esperado:**
- A primeira operação deve ser aceita.
- A segunda operação deve ser recusada.
- O sistema deve informar estoque insuficiente.
- O estoque não deve ser descontado definitivamente antes da confirmação da compra.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT005 — Adicionar o mesmo produto repetidamente

**Objetivo:** Validar se o sistema soma as quantidades quando o mesmo produto e variação são adicionados novamente.

**Heurística aplicada:** Teste de estado e repetição de operações.

**Pré-condições:**
- Usuário autenticado.
- Carrinho vazio.
- Estoque suficiente.

**Dados de teste:**
- Produto: Requeijão em Barra.
- Variação: 500g.
- Preço unitário: R$ 35,00.
- Primeira quantidade: 2.
- Segunda quantidade: 3.

**Passos:**
1. Adicionar 2 unidades ao carrinho.
2. Adicionar mais 3 unidades da mesma variação.
3. Consultar o carrinho.

**Resultado esperado:**
- Apenas uma linha para a mesma variação.
- Quantidade total de 5 unidades.
- Subtotal de R$ 175,00.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT006 — Remover produto do carrinho

**Objetivo:** Verificar se o usuário consegue remover um item selecionado do carrinho.

**Heurística aplicada:** Teste de interação e alteração de estado.

**Pré-condições:**
- Usuário autenticado.
- Carrinho contendo pelo menos um produto.

**Dados de teste:**
- Produto: Requeijão em Barra.
- Variação: 500g.

**Passos:**
1. Abrir o carrinho.
2. Localizar o produto.
3. Clicar em Remover.
4. Confirmar a remoção, caso solicitado.
5. Consultar novamente o carrinho.

**Resultado esperado:**
- Produto removido.
- Item não aparece mais no carrinho.
- Subtotal e total recalculados.
- Contador de itens atualizado.
- Estoque não é alterado pela simples remoção do carrinho.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT007 — Finalizar compra com pagamento em dinheiro

**Objetivo:** Validar a aplicação do desconto de 10% para pagamento em dinheiro.

**Heurística aplicada:** Teste de regras de negócio e validação de cálculos.

**Pré-condições:**
- Usuário autenticado não VIP.
- Carrinho contendo 2 unidades de Requeijão em Barra de 500g.

**Dados de teste:**
- Subtotal: R$ 70,00.
- Desconto: 10%.
- Frete: R$ 45,00.

**Passos:**
1. Adicionar 2 unidades ao carrinho.
2. Abrir o carrinho.
3. Selecionar pagamento em dinheiro.
4. Conferir os valores.
5. Finalizar a compra.

**Resultado esperado:**
- Subtotal: R$ 70,00.
- Desconto: R$ 7,00.
- Frete: R$ 45,00.
- Total: R$ 108,00.
- Pedido confirmado.
- Estoque atualizado após a confirmação.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT008 — Finalizar compra com pagamento em cartão

**Objetivo:** Validar o cálculo da compra sem desconto para pagamento em cartão.

**Heurística aplicada:** Teste de regras de negócio e comparação entre condições.

**Pré-condições:**
- Usuário autenticado não VIP.
- Carrinho contendo 2 unidades de Requeijão em Barra de 500g.

**Dados de teste:**
- Subtotal: R$ 70,00.
- Desconto: R$ 0,00.
- Frete: R$ 45,00.

**Passos:**
1. Adicionar 2 unidades ao carrinho.
2. Abrir o carrinho.
3. Selecionar pagamento em cartão.
4. Conferir os valores.
5. Finalizar a compra.

**Resultado esperado:**
- Subtotal: R$ 70,00.
- Desconto: R$ 0,00.
- Frete: R$ 45,00.
- Total: R$ 115,00.
- Pedido confirmado.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT009 — Cliente atinge a categoria VIP

**Objetivo:** Verificar a mudança de categoria quando o cliente alcança R$ 300,00 em compras confirmadas.

**Heurística aplicada:** Teste de transição de estado, regra de negócio e valores-limite.

**Pré-condições:**
- Cliente2 autenticado.
- Total acumulado inicial de R$ 100,00.
- Cliente ainda não VIP.
- Carrinho vazio.

**Dados de teste:**
- Requeijão em Barra 2kg: R$ 130,00.
- Doce de Abóbora 1kg: R$ 45,00.
- Doce de Leite 500g: R$ 50,00.
- Subtotal: R$ 225,00.
- Desconto em dinheiro: R$ 22,50.
- Frete: R$ 45,00.
- Total da compra: R$ 247,50.

**Passos:**
1. Autenticar o cliente2.
2. Adicionar os três produtos ao carrinho.
3. Selecionar pagamento em dinheiro.
4. Conferir os valores.
5. Finalizar a compra.
6. Consultar os dados atualizados do cliente.
7. Realizar uma próxima compra para verificar o benefício VIP.

**Resultado esperado:**
- A primeira compra deve cobrar frete de R$ 45,00.
- Total acumulado deve passar de R$ 100,00 para R$ 347,50.
- Cliente deve passar a ser VIP após a confirmação.
- Na próxima compra, o frete deve ser gratuito.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.

---

### CT010 — Revalidar estoque na finalização da compra

**Objetivo:** Verificar se o sistema revalida a disponibilidade do estoque no momento da confirmação do pedido.

**Heurística aplicada:** Teste de condição de corrida, integridade de dados e validação de estado.

**Pré-condições:**
- Usuário autenticado.
- Produto adicionado ao carrinho.
- Estoque reduzido por outra operação antes da finalização.

**Dados de teste:**
- Produto: Requeijão em Barra.
- Variação: 500g.
- Quantidade no carrinho: 5 unidades.
- Estoque disponível no momento da finalização: 3 unidades.

**Passos:**
1. Adicionar 5 unidades ao carrinho.
2. Simular uma redução do estoque por outra operação.
3. Deixar apenas 3 unidades disponíveis.
4. Tentar finalizar a compra.
5. Consultar novamente o estoque, o pedido e o carrinho.

**Resultado esperado:**
- Compra recusada por estoque insuficiente.
- Nenhum pedido confirmado.
- Estoque não pode ficar negativo.
- Carrinho deve permanecer disponível para ajuste.

**Resultado obtido:** Pendente de execução.

**Status:** Não executado.

**Evidências:** A registrar.
<!-- Insira aqui os 10 casos de teste do documento Word. -->

## 5. Controle de Execução

| Status | Significado |
|---|---|
| Aprovado | Resultado obtido conforme esperado |
| Reprovado | Resultado diferente do esperado |
| Bloqueado | Não foi possível executar o teste |

## 6. Evidências

As evidências serão registradas durante a execução dos testes, por meio de capturas de tela, respostas da API e observações.

## 7. Considerações Finais

Os resultados serão consolidados após a execução dos cenários, permitindo identificar falhas, registrar comportamentos inesperados e avaliar a qualidade do sistema.
