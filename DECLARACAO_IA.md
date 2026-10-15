# Declaração de autoria e de uso de IA

**Projeto:** LIO-C · Leitura Inteligente Orientada de Ciências (família LIO)
**Autor:** Joacy Raimundo França
**Modelo de desenvolvimento:** co-desenvolvimento humano–IA

## Resumo

A LIO-C foi concebida, especificada e validada por **Joacy Raimundo França**. O código é gerado por um agente de IA, no ambiente da própria plataforma, sob a direção do autor.

A LIO-C é a terceira ferramenta da **família LIO**, depois da LIO-E (Educacional, para textos densos, [github.com/JOACYFRANCA/lio](https://github.com/JOACYFRANCA/lio)) e da LIO-L (leis, [github.com/JOACYFRANCA/lio-l](https://github.com/JOACYFRANCA/lio-l)). A LIO-C não é escrita do zero: o script `fonte/gerar_lio_c.py` gera a LIO-C a partir do código da LIO-E, acrescentando o módulo de ciências (`fonte/ciencias.js` e `fonte/ciencias.css`) e trocando as etapas de estudo, os pedidos à IA e os textos da interface. Assim, cada melhoria da LIO-E chega à LIO-C na geração seguinte.

O projeto não reivindica programação manual do autor. A autoria está na concepção, no desenho pedagógico, na especificação, nas decisões de cada versão, nos testes e na curadoria do resultado. O autor responde pelo projeto como um todo, inclusive pela segurança e pela exatidão do conteúdo.

## Objetivos do projeto

1. **Ferramenta de estudo:** um método de estudo ativo de Matemática, Física e Química pelo livro didático, com a IA que o usuário já tem, que entregue mais do que colar uma questão na IA e receber a resposta.
2. **Demonstração:** mostrar que é possível construir uma família de ferramentas educacionais em co-desenvolvimento humano–IA, derivando uma da outra de forma registrada e reproduzível.

## Papéis

| Atividade | Autor | Agente de IA |
|---|---|---|
| Ideia de uma LIO para ciências; decisão por uma LIO-C (Matemática, Física e Química) em vez de uma LIO por disciplina | Levantou a questão e decidiu | Analisou as duas opções e recomendou |
| Exigência de não perder o conteúdo das figuras e fórmulas dos livros | Levantou o problema | Propôs a leitura por imagem, o recorte de figuras e a transcrição em LaTeX |
| Público principal (estudantes) e diferencial ("entregar mais" que a resposta da IA) | Definiu | Propôs as etapas Fórmulas, Figuras, Passo a passo e Resolver junto |
| Livros de teste (Física e Matemática do ensino médio) | Forneceu | Analisou a extração e encontrou os dois tipos de falha nas fórmulas |
| Código da LIO-C (gerador, módulo de ciências, etapas, pedidos à IA) | Não escreveu | Escreveu, testou e corrigiu |
| Nome LIO-C (antes LIO-S) | Decidiu a troca | Concordou e aplicou em código e documentação |
| Mascote da família LIO | Criou o desenho | Recortou o fundo, definiu onde usar e aplicou |
| Logo LIO-C (provisório) | A aprovar | Gerou a partir do logo da LIO-L |
| Testes automáticos (navegador sem interface, respostas simuladas da IA) | Definiu o que precisava funcionar | Escreveu e executou |
| Testes de uso e aceitação na conta do Claude | Executa e decide | Apoia com relatórios |
| Documentação (README, metodologia, manual de utilização, documentação técnica) | Revisa e aprova | Redigiu |
| Decisões de publicação, licença e privacidade | Decide | Informou opções e riscos |

## Situação das versões

| Versão | Situação | Base |
|---|---|---|
| Claude | Beta 6 (15/10/2026) | LIO-E versão 29 |
| Navegador (independente) | Beta 6 (15/10/2026) | Versão para Claude, pelo `build.py` |
| ChatGPT | Planejada: segue a versão da LIO-E para ChatGPT | — |
| Gemini | Planejada: segue a versão da LIO-E para Gemini | — |

## Versão para Claude

- **Plataforma:** claude.ai (artefatos e sessão com ferramentas de código), da Anthropic
- **Modelo:** Claude Opus 5.5 (família Claude 5)
- **Conta usada:** conta pessoal do autor no claude.ai (plano Pro)
- **Período:** 15 de outubro de 2026
- **Versão:** beta 6, gerada da LIO-E versão 29 (até a beta 5, com o nome LIO-S)
- **Registro do processo:** `REGISTRO_DESENVOLVIMENTO.md`

## Como a LIO-C é gerada e conferida

- O código da LIO-E usado como base está em `fonte/base/lio-e.html`. Rodar `python3 gerar_lio_c.py` na pasta `fonte` produz exatamente o `lio-c.html` publicado. Qualquer pessoa pode conferir que o arquivo publicado sai do código-fonte.
- O gerador troca trechos exatos e para com erro se um trecho esperado não existir na base, para que uma mudança na LIO-E nunca passe despercebida.
- O cabeçalho do `lio-c.html` informa a versão da LIO-E de que ele foi gerado.
- Rodar `python3 build.py` produz a versão para navegador (`index.html`).

## Uso de IA dentro da LIO-C

Além de ter sido feita com IA, a LIO-C usa IA durante o estudo:

- lê páginas do livro como imagem, transcrevendo o texto, as fórmulas em LaTeX e a descrição e posição das figuras;
- prepara exercícios (ideias, fórmulas, figuras, passos de deduções, termos) e perguntas de compreensão;
- divide questões em etapas, com dicas graduais, e confere a resposta de cada etapa;
- cria questões parecidas e confere a resposta final sem revelar o valor;
- classifica o tipo de cada erro e prepara treinos curtos para os erros que mais se repetem;
- monta o simulado da véspera de prova;
- descreve cada fórmula para o simulador (grandezas, faixas e expressão); o cálculo é feito pela própria página, que nunca executa código vindo da IA;
- dá retorno sobre as respostas abertas e explica trechos difíceis.

A IA é sempre chamada por um botão do usuário. Cada pedido envia só as páginas ou o trecho necessários. O que a IA gera é conferido antes de ser usado (cada item precisa apontar um parágrafo ou uma figura existente do trecho; termos precisam aparecer no texto), e a LIO-C informa quantos itens descartou. A transcrição por imagem é mostrada ao estudante, que a confere e corrige antes de salvar.

## Uso acadêmico

A LIO-C é um projeto independente. Se vier a ser objeto ou ferramenta de um trabalho acadêmico, esta declaração serve como registro público e datado do uso de IA no desenvolvimento.

## Observação sobre direitos

A autoria aqui declarada é a do projeto: concepção, especificação, desenho pedagógico e curadoria. A situação jurídica de código gerado por IA ainda não está pacificada. Por isso, a origem do código é informada de forma explícita, e o uso do projeto segue as licenças indicadas nos arquivos LICENSE (código: GNU AGPL 3.0 ou posterior) e LICENSE-TEXTOS (textos e documentação: CC BY 4.0).

## Histórico desta declaração

| Data | Mudança |
|---|---|
| 2026-10-15 | Primeira versão, com a LIO-C beta 1 (versão para Claude, gerada da LIO-E v29) |
| 2026-10-15 | Beta 2: questões parecidas no Resolver junto |
| 2026-10-15 | Beta 3: mapa de erros e treino por tipo de erro |
| 2026-10-15 | Beta 4: simulador da fórmula |
| 2026-10-15 | Beta 5: modo véspera de prova; versão para navegador; manual e documentação técnica |
| 2026-10-15 | Beta 6: nome LIO-C (antes LIO-S) e mascote |
