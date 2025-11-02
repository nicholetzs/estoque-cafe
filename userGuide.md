# Sistema de Controle de Estoque - Guia do Usuário

## Bem-vindo ao seu Sistema de Controle de Estoque

**Propósito:** Gerencie seu inventário de Café, Pimenta, Cacau e outros produtos com dashboards profissionais de análise mensal e anual.

**Acesso:** Público - Sem login necessário (dados salvos localmente no seu navegador)

---

## Powered by Manus

Este sistema foi desenvolvido com as tecnologias mais modernas:

**Frontend:** React 19 + TypeScript + Shadcn UI + Tailwind CSS 4  
**Gráficos:** Recharts para visualizações interativas  
**Estado:** Zustand com persistência em localStorage  
**Build:** Vite.js para performance otimizada  
**Deployment:** Auto-scaling infrastructure com global CDN

---

## Usando seu Sistema

### Dashboard - Visão Geral

Ao acessar o sistema, você verá o **Dashboard** com quatro métricas principais:

- **Total de Produtos:** Quantidade de itens cadastrados no seu estoque
- **Valor Total:** Investimento total em estoque (quantidade × preço unitário)
- **Movimentações:** Número de entradas e saídas registradas
- **Estoque Baixo:** Produtos com quantidade abaixo do mínimo configurado

Abaixo, você encontrará quatro abas de análise:

1. **Análise Mensal:** Gráfico de barras mostrando entradas e saídas por mês
2. **Análise Anual:** Gráfico de linhas com tendência de movimentação
3. **Por Categoria:** Gráfico de pizza com distribuição por Café, Pimenta, Cacau e Outros
4. **Estoque por Produto:** Top 8 produtos em quantidade

### Gerenciar Produtos

Clique em **"Produtos"** no menu lateral. Aqui você pode:

- **Buscar produtos** usando a barra de pesquisa
- **Filtrar por categoria** (Café, Pimenta, Cacau, Outros)
- **Adicionar novo produto** clicando em "Novo Produto"
- **Editar produto** clicando no ícone de lápis
- **Deletar produto** clicando no ícone de lixeira

Ao criar um produto, preencha: Nome, Categoria, Quantidade inicial, Preço unitário e Estoque mínimo para alertas.

### Registrar Movimentações

Acesse **"Movimentações"** para registrar entradas e saídas:

- Clique em **"Nova Movimentação"**
- Selecione o produto
- Escolha o tipo: **Entrada** (compra) ou **Saída** (venda)
- Insira a quantidade e observações (opcional)
- Clique em "Registrar"

O sistema atualiza automaticamente o estoque do produto. Todas as movimentações ficam registradas no histórico.

### Análises Detalhadas

Visite **"Relatórios"** para análises avançadas:

- **Vendas por Categoria:** Valor total investido em cada categoria
- **Movimentação Mensal:** Gráfico de área com entradas e saídas
- **Estoque Baixo:** Tabela com produtos que precisam reposição
- **Top Produtos:** Produtos com maior valor em estoque
- **Rotatividade:** Análise de quais produtos se movem mais

Clique em **"Exportar Relatório"** para baixar um arquivo JSON com todos os dados.

---

## Gerenciando seu Sistema

### Navegação

Use a **barra lateral** para acessar as diferentes seções. O ícone de menu permite expandir/recolher a sidebar para mais espaço.

O **cabeçalho** exibe o título do sistema e informações do usuário.

### Dados Locais

Todos os seus dados são salvos automaticamente no navegador (localStorage). Seus produtos e movimentações persistem mesmo após fechar o navegador.

### Design Responsivo

O sistema funciona perfeitamente em desktop, tablet e mobile. A interface se adapta automaticamente ao tamanho da tela.

---

## Próximos Passos

Comece cadastrando seus produtos principais em **"Produtos"**. Depois, registre as movimentações diárias em **"Movimentações"**. Use o **Dashboard** e **Relatórios** para acompanhar seu estoque e tomar decisões informadas.

Fale com Manus AI a qualquer momento para solicitar mudanças, adicionar novos recursos ou melhorar o sistema conforme suas necessidades evoluem.
