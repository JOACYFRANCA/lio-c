# LIO-C · Manual de utilização

**Leitura Inteligente Orientada de Ciências** · versão do manual 1.0 · 15/10/2026 · Autor: Joacy Raimundo França

Este manual explica como usar a LIO-C. Ele descreve a **beta 6** da LIO-C (até a beta 5, chamada LIO-S), gerada a partir da versão 29 da LIO-E. Telas e nomes de botões podem mudar em versões futuras.

## 1. Apresentação

A LIO-C ajuda estudantes do ensino médio e do superior a estudar **Matemática, Física e Química pelo livro didático**. Ela lê o capítulo com as fórmulas legíveis e as figuras recortadas, treina o que cada fórmula significa e quando vale, faz você reconstruir deduções passo a passo e **resolve questões junto com você**, sem entregar a resposta pronta. Na véspera da prova, monta uma sessão de revisão e uma folha de uma página.

A LIO-C é da família **LIO**. A LIO-E (Educacional) serve para textos densos; a LIO-L, para leis; a LIO-C é derivada da LIO-E para textos de ciências, em que boa parte do conteúdo está em fórmulas, figuras e gráficos. O método está explicado em `METODOLOGIA.md`.

**O que é preciso para usar:**

- Uma conta no Claude (claude.ai), gratuita ou paga, e uma LIO-C para abrir: a sua, instalada na sua conta (veja `INSTALAR.md`), ou a de outra pessoa que convidou você. Ou a versão para navegador (seção 9).
- Um navegador atualizado (Chrome, Edge, Firefox ou Safari) e conexão com a internet.
- O material: um capítulo do livro em PDF (digital ou escaneado) ou em Word, ou um texto colado.

**Sobre a IA:** a leitura das páginas, os exercícios, as perguntas, as etapas do Resolver junto e os retornos são preparados pelo Claude da conta de quem clica no botão. Na primeira vez, o Claude pede autorização para a página usar a conta. O uso conta no limite do plano de cada pessoa; não há chave nem cobrança à parte. A leitura de páginas por imagem consome mais uso que o resto: estude um tópico por vez.

## 2. Escolha o seu caminho

| Forma de uso | Para quem | O que você vê | Seções do manual |
|---|---|---|---|
| Estudar por conta própria | O uso principal: cada estudante com o seu livro | Início, Estudar, Revisar, Treino, Progresso | 3 e 4 |
| Participar de um grupo | Quem foi convidado para a LIO-C de outra pessoa | As mesmas abas, mais atividades do grupo, mensagens e aula ao vivo | 3, 4 e 5 |
| Mediar um grupo | Professor, monitor ou colega que organiza o estudo | As abas de estudo, mais a aba Mediador | 3, 4 e 6 |

Na primeira vez que você abre a sua própria LIO-C, a tela Início pergunta **Como você vai usar a LIO?**. Para mudar depois, use **Mudar**, no fim da tela Início.

## 3. Primeiros passos

1. Abra a sua LIO-C (pela barra lateral do Claude) ou o link para o qual você foi convidado.
2. Na tela Início, responda **Como você vai usar a LIO?**, se for a sua LIO-C.
3. Clique em **Aa Leitura**, no topo, e ajuste a leitura ao seu conforto: tamanho da letra, entrelinhas, espaço entre letras, largura da linha, fonte, cores, velocidade da voz e modo foco. Os ajustes ficam salvos neste navegador.
4. Escolha por onde começar: **Continuar de onde parei**, **Novo estudo**, **Revisar hoje** ou **Treino de memória**. No celular, as abas ficam numa barra na parte de baixo.

Em todo texto aparece o botão **▶ Ouvir**, que lê em voz alta e destaca a frase lida. As fórmulas são lidas por extenso: "E C igual a m vezes v ao quadrado sobre 2".

## 4. Estudar

### 4.1 Começar um estudo com um capítulo do livro

1. Na aba **Estudar**, clique em **Novo estudo** e escolha o PDF (ou um Word, ou cole o texto).
2. Informe **Da página** e **Até a página** (no máximo 40; o melhor é um tópico de 2 a 10 páginas), o título, a **Disciplina** (Matemática, Física ou Química) e a referência. O número da página é o do arquivo PDF, que pode ser diferente do número impresso no livro.
3. Clique em **Extrair texto**.
4. A LIO-C procura as **páginas com fórmulas** e as páginas escaneadas. Em livros de ciências, a extração de texto estraga as fórmulas (índices, frações e símbolos se desmancham; em alguns livros, os símbolos trocam de caractere) e não traz as figuras. Por isso, a **leitura por imagem** começa sozinha: o Claude lê essas páginas como imagem, até 3 por vez, escreve as fórmulas de forma legível e recorta as figuras. Leva cerca de um minuto para cada três páginas. Você pode clicar em **Parar**; as páginas já lidas ficam.
5. Confira o resultado na tela de revisão:
   - **Figuras:** cada figura recortada aparece com a página e a descrição. **Ajustar** abre a página para você arrastar um novo recorte; **Tirar** remove a figura. Para incluir uma figura que faltou, informe a página em **Recortar uma figura da página** e arraste sobre ela.
   - **Seções:** a LIO-C divide o trecho pelos títulos do livro.
   - **Revisar o texto extraído:** corrija o que estiver errado. Fórmulas ficam entre `\(` e `\)` (no texto) ou `\[` e `\]` (em destaque), em LaTeX.
6. Clique em **Salvar e começar a estudar**. Se ainda houver páginas com fórmulas não lidas por imagem, a LIO-C avisa o que se perde e oferece **Ler agora com o Claude** ou **Salvar assim mesmo**.

Use a **edição do aluno** quando tiver. A LIO-C pede ao Claude para ignorar as orientações ao professor, mas algumas podem passar: apague-as na leitura (4.3).

### 4.2 As oito etapas de cada seção

Na página do estudo, clique em **Estudar** numa seção. No topo, a trilha mostra as etapas; dá para ir a qualquer uma. Antes de tudo, clique em **Preparar exercícios** (de 30 segundos a 2 minutos).

| | Etapa | O que você faz |
|---|---|---|
| 1 | Mapa | Vê a primeira frase de cada parágrafo e a lista de fórmulas da seção |
| 2 | Leitura ativa | Lê parágrafo a parágrafo, com as figuras da página, e escreve a ideia de cada um |
| 3 | Fórmulas | Diz o que significa cada símbolo, responde como a fórmula se comporta e vê quando vale; brinca com o simulador |
| 4 | Figuras | Responde perguntas que exigem ler o gráfico ou o diagrama |
| 5 | Passo a passo | Põe em ordem os passos de uma dedução ou de um exercício resolvido |
| 6 | Compreensão | Perguntas abertas: literal, inferencial e de aplicação |
| 7 | Resolver junto | Resolve uma questão em etapas, com dicas só quando pede |
| 8 | Glossário e notas | Termos técnicos e observações; conclui a seção |

### 4.3 Leitura ativa

1. Leia o parágrafo. As figuras da mesma página aparecem logo abaixo (abertas quando o parágrafo cita a figura ou está ao lado dela).
2. Se quiser, toque nas palavras de onde tirou a ideia (o **marcador**). Uma fórmula conta como uma palavra.
3. Escreva a **etiqueta**: a ideia do parágrafo em 3 a 8 palavras suas. Se o parágrafo for uma fórmula, descreva o que ela diz.
4. **Comparar com a IA** mostra a etiqueta do Claude e onde ele achou a ideia. **Explique de outro jeito** reexplica o parágrafo.
5. **Guardar e esconder**: com o parágrafo escondido, escolha a ideia central entre três opções.

**Apagar este trecho**, no alto, remove um trecho sem conteúdo (um aviso, um número de página, texto embaralhado). Toque duas vezes para confirmar. Para desfazer, abra **Ver a seção inteira** e clique em **Restaurar**.

### 4.4 Fórmulas e simulador

Para cada fórmula da seção:

1. **O que significa cada símbolo?** Escolha o significado de cada um e clique em **Conferir**. A unidade no SI aparece depois.
2. **Como a fórmula se comporta?** Uma pergunta sobre o que acontece quando uma grandeza dobra, cai à metade ou muda de sinal.
3. **A ficha:** a fórmula, os símbolos com as unidades e **quando vale**.

Na ficha, **Brincar com a fórmula** abre o simulador:

- Primeiro, **preveja**: responda à pergunta antes de mexer. Os controles só liberam depois.
- Arraste os controles: o resultado muda na hora, com a unidade.
- O gráfico mostra o resultado em função da grandeza escolhida em **Gráfico em função de**, com as outras fixas. O ponto é o valor atual.
- Em Matemática, funciona com funções: na parábola, por exemplo, os controles a, b e c mostram a curva abrindo, fechando e se deslocando.

Fórmulas que não dá para calcular com controles (vetores, derivadas, equações químicas) mostram o motivo. Cada fórmula vira uma ficha na revisão espaçada.

### 4.5 Figuras e Passo a passo

- **Figuras:** a figura aparece sem a descrição, para você lê-la primeiro (**Ver a descrição da figura** abre o texto). Depois de cada resposta, vem a explicação.
- **Passo a passo:** os passos de uma dedução ou de um exercício resolvido do livro aparecem embaralhados. Use ↑ e ↓ para ordenar e clique em **Conferir**. **Dica: qual é o primeiro passo?** ajuda a começar. Os passos viram cartões de revisão.

### 4.6 Resolver junto

1. Em **Nova questão**, cole ou digite o enunciado (fórmulas do jeito que conseguir: v^2, raiz de 2, H2O) ou **Anexe uma foto ou print da questão**. Clique em **Começar a resolver**.
2. O Claude divide a resolução em 3 a 6 etapas. Para cada etapa, escreva a sua resposta e clique em **Conferir**. O retorno diz o que está certo e onde olhar, sem entregar a resposta.
3. Travou? **Pedir dica** mostra até três dicas, da mais leve à mais forte. **Não consegui: ver esta etapa resolvida** mostra a etapa (fica registrado).
4. No fim, a **Conferência**: a unidade faz sentido? O valor é razoável? Um teste rápido confirma? Clique em **Pensar e ver** em cada item e em **Concluir a questão**.
5. **Tentar uma parecida:** escolha **Outros números**, **Outro contexto** ou **Pergunta invertida**. A parecida começa **sem dicas**: escreva só a resposta final. Se travar, **Travei: resolver por etapas**. Acertar a parecida direto mostra que você aprendeu o caminho.

**Mapa de erros:** depois de 8 respostas conferidas no estudo, o topo do Resolver junto mostra os tipos de erro que mais se repetem (unidades, sinais, contas, conceitos, leitura do enunciado, respostas incompletas). **Treinar** monta 5 itens rápidos sobre aquele tipo de erro, no assunto do estudo.

### 4.7 Compreensão, teste e revisão

- **Compreensão:** responda com as suas palavras, diga quão seguro está e clique em **Enviar para retorno**. Os níveis são literal, inferencial e **aplicação** (usar o conceito numa situação nova).
- **Teste antes e depois:** na página do estudo, faça o pré-teste antes de estudar, o pós-teste depois e o pós-teste tardio 7 dias depois.
- **Revisar:** na aba **Revisar**, clique em **Revisar agora**. Os cartões trazem as suas etiquetas, o glossário, as **fórmulas** (escrever de memória, com símbolos e quando vale), os **passos** das deduções e as perguntas de compreensão. Tente lembrar, clique em **Mostrar resposta** e escolha **Não lembrei**, **Lembrei com esforço** ou **Lembrei bem**.

### 4.8 Véspera de prova

Na página do estudo, clique em **Véspera de prova**.

1. Escolha quanto tempo você tem (**15**, **30** ou **60 min**) e as seções que caem. A LIO-C mostra o plano da sessão.
2. **Fórmulas de memória:** começando pelas que você mais esquece na revisão. Escreva num papel, clique em **Conferir** e diga se lembrou.
3. **Seu erro mais frequente:** um treino curto do tipo de erro que mais aparece no mapa de erros (fica de fora nos 15 minutos).
4. **Simulado:** de 3 a 8 questões no estilo da prova.
5. No fim: o placar, a lista **Para revisar antes de dormir** e **Baixar a folha de revisão**, uma página com as fórmulas (as esquecidas destacadas), as suas armadilhas, as questões erradas com a resolução e lembretes para a hora da prova. Abra o arquivo baixado para imprimir ou salvar em PDF.

### 4.9 Fichamento, impressão, rodadas e treino de memória

Funcionam como na LIO-E: **Abrir o fichamento** reúne o estudo por seção; **Imprimir / salvar em PDF** gera um caderno; **Resultado da rodada** mostra os índices de **Compreensão** (que na LIO-C inclui Fórmulas, Figuras, Passo a passo e Resolver junto), **Calibração** e **Autonomia**; a aba **Treino** traz os exercícios de memória de trabalho.

## 5. Participar de um grupo

1. Na aba **Estudar**, informe **Seu nome para o mediador**.
2. Em **Atividades do grupo**, clique em **Começar**. A atividade vira um estudo seu, com os exercícios já revisados pelo mediador.
3. Na página do estudo, clique em **Compartilhar com o mediador** para que ele veja o seu progresso (só números).

**Aula ao vivo** e **✉ Mensagens** funcionam como na LIO-E. Nas atividades do grupo, as figuras chegam só com a descrição, sem a imagem recortada.

## 6. Mediar um grupo

A aba **Mediador** aparece para quem escolheu **Mediar um grupo** na própria LIO-C. O fluxo é o da LIO-E: crie um estudo com o capítulo, crie a atividade, revise os exercícios de cada seção, prepare o teste e publique (ou exporte o arquivo). Para convidar: no botão **Compartilhar** da sua LIO-C, convide cada pessoa pelo e-mail da conta Claude com o nível **Colaborador** (nunca **Editor**).

Não distribua páginas de livros didáticos a quem não tem o livro: eles são protegidos por direitos autorais.

## 7. Privacidade e cuidados

- Cada pedido à IA envia só as páginas ou o trecho necessários.
- O registro de uso para pesquisa começa desligado e só registra com o seu consentimento (aba Progresso).
- Os dados da LIO-C ficam separados dos da LIO-E e da LIO-L.
- Livros didáticos são protegidos por direitos autorais: use a LIO-C com o material que você tem, para estudo pessoal.

## 8. Limitações desta beta

- O Claude pode errar ao transcrever uma fórmula ou ao marcar a posição de uma figura. Confira antes de salvar.
- A leitura por imagem consome mais uso da conta. Estude um tópico por vez.
- A véspera de prova vale para um estudo de cada vez.
- Nas atividades de grupo, as figuras vão só com a descrição.
- Os textos de exemplo do treino de memória ainda são os da LIO-E.

## 9. Versão para navegador

O arquivo `index.html` é a versão independente, sem instalar no Claude. Os estudos ficam no navegador (faça backups em **Ajustes**), e a IA vem de uma chave da API da Anthropic (modo **Automático**) ou do modo **Copiar e colar**, em que você leva o pedido à IA que já usa (ChatGPT, Gemini, Claude) e traz a resposta de volta. **No modo copiar e colar não dá para enviar imagens**: a leitura das páginas por imagem e a foto da questão no Resolver junto só funcionam no modo automático.

## 10. Problemas comuns

| O que aconteceu | O que fazer |
|---|---|
| Fórmulas aparecem como texto com barras, como `\frac{m v^2}{2}` | O leitor de fórmulas não carregou. Verifique a conexão e recarregue a página. |
| Fórmulas embaralhadas ("v = _Δs m Δt") e figuras faltando | As páginas ficaram sem a leitura por imagem. Crie o estudo de novo e deixe a leitura terminar antes de salvar. |
| Um exercício de duas colunas virou dois quadros cortados | Mesmo caso acima: a leitura por imagem lê coluna por coluna. |
| Não aparece **Ler … páginas com o Claude** | A LIO-C foi publicada sem a permissão de imagens. Veja `INSTALAR.md`. |
| Um recorte de figura saiu errado | Na revisão, **Ajustar** e arraste um novo recorte. |
| "A última tentativa falhou: …" | Leia o motivo. Pedido interrompido: mantenha a página aberta e em primeiro plano. Limite de uso: tente mais tarde. Resposta incompleta: tente de novo. |
| Uma questão ou fórmula está errada | **Esta questão está errada**, e relate numa Issue com a disciplina, o livro e a página. |

---

LIO-C · Leitura Inteligente Orientada de Ciências · © 2026 Joacy Raimundo França · Texto sob CC BY 4.0 · Co-desenvolvimento humano–IA (ver `DECLARACAO_IA.md`).
