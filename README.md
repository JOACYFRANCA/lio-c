<p align="center"><img src="docs/lio_c_logo.png" alt="LIO-C" width="300">&nbsp;&nbsp;<img src="docs/mascote.png" alt="Mascote da LIO: um robô que lê um livro e levanta o dedo, como quem teve uma ideia" width="150"></p>

# LIO-C · Leitura Inteligente Orientada de Ciências

> **Versão beta 6:** em teste. Sua opinião ajuda a definir a versão 1.0 — veja [Contribua](#contribua).

Ferramenta de estudo de **Matemática, Física e Química** pelo livro didático, para estudantes do ensino médio e do superior. A LIO-C lê o capítulo com as fórmulas legíveis e as figuras recortadas, treina o que cada fórmula significa e quando ela vale, faz você reconstruir deduções passo a passo e **resolve questões junto com você**, sem entregar a resposta pronta.

A LIO-C faz parte da família **LIO**. A [LIO-E](https://github.com/JOACYFRANCA/lio) (Educacional) é a ferramenta de leitura de textos densos; a [LIO-L](https://github.com/JOACYFRANCA/lio-l) é a de leis. A LIO-C é derivada da LIO-E e adaptada a textos de ciências, em que boa parte do conteúdo está em **fórmulas, figuras e gráficos**, e não só nos parágrafos. As razões de cada escolha estão em [METODOLOGIA.md](METODOLOGIA.md).

## O que a LIO-C faz

- **Lê as páginas com fórmulas por imagem.** Nos livros de ciências, a extração de texto do PDF estraga as fórmulas: índices, frações e setas de vetor se desmancham, e algumas fontes trocam os símbolos ("x² − 2x − 8 = 0" sai como "x2 2 2x 2 8 5 0"). A LIO-C detecta essas páginas e pede ao Claude que as leia como imagem, com as fórmulas em LaTeX, exibidas na tela como no livro.
- **Recorta as figuras.** Gráficos, diagramas e esquemas vêm recortados da página, com uma descrição. O estudante pode ajustar o recorte ou recortar outra figura à mão.
- **Oito etapas por seção:**

| | Etapa | O que você faz |
|---|---|---|
| 1 | Mapa | Vê o esqueleto da seção e a lista das fórmulas |
| 2 | Leitura ativa | Lê parágrafo a parágrafo, com as figuras da página ao lado, e escreve a ideia de cada um |
| 3 | Fórmulas | Diz o que significa cada símbolo, responde como a fórmula se comporta (o que acontece se uma grandeza dobra) e vê quando ela vale. No **simulador**, prevê o efeito de uma mudança e depois confere mexendo em controles deslizantes, com o resultado e o gráfico mudando na hora |
| 4 | Figuras | Responde perguntas que exigem ler o gráfico ou o diagrama |
| 5 | Passo a passo | Põe em ordem os passos de uma dedução ou de um exercício resolvido do livro |
| 6 | Compreensão | Perguntas abertas: literal, inferencial e de aplicação |
| 7 | **Resolver junto** | Traz uma questão (digitada ou em foto); o Claude divide a resolução em etapas, você faz cada uma, recebe dicas graduais só quando pede e confere a resposta (unidade, ordem de grandeza, caso limite). Ao terminar, **tenta uma parecida** (outros números, outro contexto ou pergunta invertida), primeiro direto e sem dicas. O **mapa de erros** mostra os tipos de erro que mais se repetem no estudo (unidades, sinais, contas, conceitos, leitura do enunciado) e oferece um treino curto para cada um |
| 8 | Glossário e notas | Termos técnicos e observações |

- **Véspera de prova:** escolha o tempo (15, 30 ou 60 minutos) e as seções que caem. A sessão junta fórmulas de memória (começando pelas que você mais esquece na revisão), um treino do seu erro mais frequente e um simulado no estilo da prova, e termina com uma **folha de revisão** de uma página para baixar e imprimir.
- **Perfis por disciplina:** Matemática, Física ou Química, escolhidos ao criar o estudo. O perfil ajusta os pedidos à IA.
- **Fórmulas e passos viram cartões de revisão espaçada**, ao lado das etiquetas, do glossário e das perguntas de compreensão.
- **Leitura em voz alta das fórmulas:** o botão Ouvir lê "E C igual a m vezes v ao quadrado sobre 2", e não os símbolos soltos.
- Mantém os recursos da LIO: fichamento e mapas, teste antes e depois, rodadas com índices, ajustes de leitura, mediação de grupos, aula ao vivo e mensagens.

## Nome e mascote

**LIO-C**: o C é de **Ciências**, no padrão da família (E de Educacional, L de Leis). Até a beta 5, chamava-se LIO-S.

O **mascote** da família LIO, criado pelo autor, aparece nos momentos de acolhida e de conquista: na tela Início, nas telas vazias, nas esperas pela IA, ao lado das dicas do Resolver junto e nas celebrações. Ele não aparece durante a leitura, os exercícios e os testes, para não disputar a atenção com o texto. É sempre decorativo: a mensagem está no texto ao lado.

## Como usar

| Forma | Arquivo | Como |
|---|---|---|
| **No Claude** | `lio-c.html` | Instale na sua conta do Claude: veja [INSTALAR.md](INSTALAR.md). A IA é a da sua conta. |
| **No navegador** (versão independente) | `index.html` | Abra o site do repositório no GitHub Pages ([https://joacyfranca.github.io/lio-c/](https://joacyfranca.github.io/lio-c/), depois de ativado). Os estudos ficam no navegador; a IA usa uma chave da API da Anthropic (modo automático) ou o modo **copiar e colar**, com a IA que você já usa. A leitura das páginas por imagem só funciona no modo automático. |

A LIO-C guarda seus dados **separados** dos da LIO-E e da LIO-L, mesmo no mesmo navegador.

## Cuidados

- **Confira as fórmulas transcritas** antes de salvar o estudo. A leitura por imagem é muito melhor que a extração de texto, mas o Claude pode errar um índice ou um sinal. Corrija em **Revisar o texto extraído**.
- Livros didáticos são protegidos por direitos autorais. Use a LIO-C com o material que você tem para estudo pessoal e **não coloque trechos, páginas ou figuras de livros neste repositório**.
- Use a edição do aluno, quando tiver. A LIO-C pede ao Claude para ignorar as anotações ao professor da edição do professor, mas algumas podem passar.

## Como foi feito

Co-desenvolvimento humano–IA: concebido, especificado e validado pelo autor; código gerado pelo Claude (Anthropic) sob a direção do autor. A LIO-C é gerada a partir do código da LIO-E por um script (`fonte/gerar_lio_c.py`), para que as melhorias da LIO-E cheguem também à LIO-C. Ver [DECLARACAO_IA.md](DECLARACAO_IA.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [INSTALAR.md](INSTALAR.md) | Instalar, atualizar e usar uma LIO-C compartilhada no Claude |
| [Manual de utilização](docs/Manual_de_Utilizacao_LIO-C.pdf) | Como estudar, participar e mediar, tela a tela |
| [Documentação técnica](docs/Documentacao_Tecnica_LIO-C.pdf) | Como a LIO-C funciona por dentro: geração, fórmulas, leitura por imagem, pedidos à IA, simulador, dados, testes |
| [METODOLOGIA.md](METODOLOGIA.md) | Por que uma LIO para ciências, e como cada etapa trabalha fórmulas, figuras e resolução de problemas |
| [fonte/LEIA-ME.md](fonte/LEIA-ME.md) | Como gerar a LIO-C e a versão para navegador a partir do código-fonte |
| [DECLARACAO_IA.md](DECLARACAO_IA.md) e [REGISTRO_DESENVOLVIMENTO.md](REGISTRO_DESENVOLVIMENTO.md) | Como a LIO-C foi feita |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Como relatar erros e sugerir melhorias |

## Licença

| O quê | Licença | Arquivo |
|---|---|---|
| Código: `lio-c.html`, `index.html` e, em `fonte/`, `gerar_lio_c.py`, `ciencias.js`, `ciencias.css`, `build.py`, `local_parts.js` e `local_config.js` | **GNU AGPL 3.0 ou posterior** (AGPL-3.0-or-later) | `LICENSE` |
| Textos e documentação | **Creative Commons Atribuição 4.0** (CC BY 4.0) | `LICENSE-TEXTOS` |

Copyright © 2026 Joacy Raimundo França. Código gerado por IA sob a direção do autor (ver `DECLARACAO_IA.md`).

Os livros e textos que cada pessoa estuda na LIO-C continuam sendo de seus autores e editoras: estas licenças não se aplicam a eles. Bibliotecas usadas pela página, carregadas da rede: [pdf.js](https://mozilla.github.io/pdf.js/) (Apache 2.0) e [MathJax](https://www.mathjax.org/) (Apache 2.0).

## Contribua

- **Encontrou um erro ou tem uma ideia?** Abra uma [Issue](https://github.com/JOACYFRANCA/lio-c/issues/new/choose) com o modelo **Erro** ou **Sugestão**.
- Veja como as contribuições são tratadas em [CONTRIBUTING.md](CONTRIBUTING.md).
