# Metodologia da LIO-C

Este documento explica por que existe uma LIO para ciências e como cada etapa trabalha o que é próprio de Matemática, Física e Química: fórmulas, figuras e resolução de problemas.

## 1. Uma LIO para ciências, e não uma por disciplina

O que justificou criar a LIO-L foi a **estrutura do texto**: na lei não há parágrafo denso, tudo é importante. Com ciências acontece algo parecido, mas Matemática, Física e Química escrevem do mesmo jeito: definição, enunciado (lei, teorema, princípio), fórmula, dedução ou demonstração, exemplo resolvido, exercício. A forma de ler e de treinar é a mesma; muda o vocabulário e alguns detalhes.

Por isso a LIO-C tem **um núcleo comum e um perfil por disciplina**, escolhido ao criar o estudo:

| Perfil | Atenção especial dos pedidos à IA |
|---|---|
| Matemática | definições, teoremas e suas hipóteses, propriedades, gráficos de funções, procedimentos de resolução |
| Física | grandezas e unidades, leis e condições de validade dos modelos, gráficos e diagramas de forças |
| Química | equações químicas e balanceamento, fórmulas e nomenclatura, mol, massa molar e concentração |

Há também uma razão prática: a família LIO terá versões para Claude, ChatGPT e Gemini. Com uma LIO por disciplina, seriam nove páginas para manter; com a LIO-C, são três. E muitos textos misturam as áreas (a Física usa cálculo; a Físico-Química é as duas coisas). Uma disciplina pode ser separada mais tarde, se o uso mostrar que ela precisa de treinos muito próprios.

## 2. O problema das fórmulas e figuras

Nos livros de ciências, parte do conteúdo não está nos parágrafos. Está nas fórmulas, nas figuras e nos gráficos. E é justamente essa parte que a extração de texto de um PDF perde:

- **Fórmulas se desmancham.** Num livro de Física, "v₂² = v₁² + 2·a·d" foi extraído como "v 22 = v 21 + 2 · a · d"; frações perdem a barra; setas de vetor vão para outra linha.
- **Fontes de símbolos trocam caracteres.** Num livro de Matemática, "x² − 2x − 8 = 0" foi extraído como "x2 2 2x 2 8 5 0": o "5" é o "=", o "2" é o "−". O texto parece válido, e nenhum estudante perceberia o erro.
- **Figuras somem.** Gráficos e diagramas não têm texto.
- **Colunas se misturam.** Boxes laterais e páginas de duas colunas viram uma mistura de frases.

A LIO-C trata isso em três camadas:

1. **Detecção.** Ao extrair o texto, a LIO-C marca as páginas com sinais de fórmula: caracteres de fontes de símbolos, linhas feitas de pedaços curtos, muitos operadores, letras coladas a números. Páginas sem texto (escaneadas) também entram.
2. **Leitura por imagem.** Essas páginas vão como imagem ao Claude, até três por vez, que devolve o texto com as fórmulas em LaTeX, os títulos e boxes marcados e cada figura com uma descrição e a posição na página. Se um lote falha por ser grande demais, a LIO-C lê página por página.
3. **Conferência pelo estudante.** A LIO-C recorta as figuras e mostra tudo antes de salvar. O estudante pode ajustar recortes, recortar outra figura e corrigir o texto. Conferir uma fórmula contra a página já é estudar.

As fórmulas aparecem na tela como no livro (MathJax), inclusive na leitura ativa, nos exercícios e nos cartões de revisão. Na leitura em voz alta, cada fórmula é lida por extenso ("E C igual a m vezes v ao quadrado sobre 2").

## 3. As etapas

A LIO-C mantém o ciclo da LIO-E (ver antes, ler ativamente, recuperar, revisar) e troca as etapas pensadas para ciências humanas (Vozes, Argumento, Cronologia) por etapas de ciências.

**Mapa.** Além do esqueleto da seção, mostra a lista de fórmulas: o estudante sabe de antemão quais relações vai encontrar.

**Leitura ativa.** Como na LIO-E: o estudante escreve a ideia de cada parágrafo, com as próprias palavras, e depois a recupera com o parágrafo escondido. As figuras da página aparecem junto, abertas quando o parágrafo as cita ou está ao lado delas. Uma fórmula conta como uma palavra para o marcador.

**Fórmulas.** Uma fórmula decorada sem significado não serve na prova. Para cada fórmula do trecho:
- o estudante diz o que significa cada símbolo (e vê a unidade no SI);
- responde como a fórmula se comporta: o que acontece com uma grandeza quando outra dobra, cai à metade ou muda de sinal;
- vê quando a fórmula vale (hipóteses, condições, limites do modelo).

**Simulador da fórmula.** Na ficha de cada fórmula, o botão "Brincar com a fórmula" abre um simulador: um controle deslizante para cada grandeza, o resultado calculado na hora e um gráfico do resultado em função da grandeza escolhida, com as outras fixas. Antes de mexer, o estudante faz uma **previsão** ("se a velocidade dobrar, a energia cinética…") e só depois confere. É o ciclo prever–observar–explicar: a previsão errada, seguida da observação, é o momento em que a ideia muda. Em Matemática, o mesmo simulador mostra funções: com controles para a, b e c, a parábola abre, fecha e se desloca. O Claude descreve a fórmula (grandezas, faixas realistas, expressão); a página calcula com um avaliador próprio e nunca executa código vindo da IA. Fórmulas que não se calculam assim (vetores, derivadas, equações químicas) ficam sem simulador, e a LIO-C diz por quê. A descrição fica guardada: o simulador abre de novo sem nova chamada à IA.

Cada fórmula vira uma ficha na revisão espaçada: dias depois, o estudante escreve a fórmula de memória, diz os símbolos e quando ela vale.

**Figuras.** Perguntas que só se respondem lendo a figura: valores, inclinação, área sob a curva, sentido das setas, tendência. A descrição fica escondida até o estudante pedir, para que ele leia a figura primeiro.

**Passo a passo.** As deduções e os exercícios resolvidos do livro, com os passos embaralhados, para reordenar. Treina o encadeamento: cada passo precisa de um motivo (uma lei, uma definição, a conta do passo anterior). Os passos viram cartões de revisão.

**Compreensão.** Os três níveis da LIO-E, com o terceiro adaptado: em vez de avaliar o argumento do autor, o estudante **aplica** o conceito a uma situação nova ou explica um fenômeno do cotidiano.

**Resolver junto.** O diferencial da LIO-C diante de "colar a questão na IA e receber a resposta". Princípios:
- **O estudante faz cada etapa.** A resolução é dividida em 3 a 6 etapas pequenas, na ordem em que um bom estudante pensaria: dados e o que se pede, com unidades; a lei ou propriedade; a equação; a conta; a resposta com unidade.
- **Ajuda graduada, só quando pedida.** Cada etapa tem três dicas: a primeira só aponta a direção, a terceira quase entrega a etapa. Ver a etapa resolvida é possível, e fica registrado.
- **Retorno sem entregar.** O Claude confere a resposta de cada etapa, diz o que está certo e onde olhar, e classifica o tipo de erro (unidade, sinal, conta, conceito, leitura do enunciado).
- **Conferência como hábito de cientista.** Ao fim, a resposta é conferida pela unidade, pela ordem de grandeza e por um caso limite.
- **Ligação com o livro.** A questão aponta o parágrafo do trecho que dá a base teórica.

**Mais uma igual.** Ao concluir uma questão, o estudante pode pedir uma parecida, em três níveis: outros números (confirma o procedimento), outro contexto (confirma que ele reconhece quando usar o conceito) e pergunta invertida (o que era dado vira o que se pede; confirma que ele entende a relação nos dois sentidos). A parecida começa **sem dicas**: o estudante escreve só a resposta final, e o Claude a confere sem revelar o valor se estiver errada. Se travar, ela vira uma resolução por etapas, com dicas. Resolver a parecida direto é a evidência de **transferência**: o estudante aprendeu o caminho, e não só seguiu os passos. Depois de um acerto direto, a LIO-C sugere o nível seguinte.

**Mapa de erros.** Cada resposta conferida no Resolver junto, nas etapas ou na tentativa direta de uma parecida, guarda o tipo do erro: unidade, sinal, conta, conceito, leitura do enunciado ou resposta incompleta. O mapa junta esses registros no estudo inteiro e mostra quais tipos mais se repetem. Ele só aparece depois de 8 respostas conferidas, e mostra números absolutos ("5 de 8"), porque com poucos dados uma porcentagem engana. Para cada tipo, um treino de 5 itens rápidos de múltipla escolha, no assunto do estudo, em que as alternativas erradas são justamente os erros típicos daquele tipo. A ideia é tratar o erro recorrente diretamente, em vez de esperar que ele desapareça com mais questões inteiras.

O resumo mostra as etapas certas sem ajuda, as dicas usadas e as etapas vistas resolvidas, e entra no índice de compreensão da rodada (uma etapa certa com dica vale meio ponto; vista resolvida, zero; uma parecida resolvida direto vale todas as suas etapas).

**Véspera de prova.** Na página do estudo, o estudante escolhe quanto tempo tem (15, 30 ou 60 minutos) e quais seções caem. A sessão tem quatro partes, todas apoiadas no que a LIO-C já sabe sobre ele: (1) fórmulas de memória, ordenadas pelas que ele mais esqueceu na revisão espaçada; ele escreve num papel, confere e diz se lembrou; (2) um treino do erro mais frequente no mapa de erros; (3) um simulado curto no estilo da prova, com alternativas erradas que representam erros típicos; (4) uma folha de revisão de uma página para baixar: as fórmulas (as esquecidas no dia primeiro, destacadas), as armadilhas pessoais e as questões erradas com a resolução, mais três lembretes para a hora da prova. O resultado da sessão fica guardado no estudo.

## 4. Verificação do que a IA gera

Como na LIO-E, a página confere o que o Claude gera antes de mostrar: cada item precisa apontar um parágrafo existente do trecho; perguntas de figura precisam apontar uma figura; deduções precisam ter ao menos três passos; termos do glossário precisam aparecer no texto. Itens que não conferem são descartados, e a contagem aparece ao estudante.

## 5. Limites desta versão (beta 6)

- A leitura por imagem consome mais uso da conta do Claude que a extração de texto. Por isso o estudo é limitado a 40 páginas, e o recomendado é estudar um tópico por vez.
- O Claude pode errar ao transcrever uma fórmula ou ao marcar a posição de uma figura. A conferência pelo estudante antes de salvar é parte do método.
- As figuras ficam guardadas só na conta de quem criou o estudo. Atividades enviadas a um grupo levam a descrição das figuras, não as imagens.
- Ainda não há versão independente (navegador) da LIO-C.
- A véspera de prova vale para um estudo de cada vez (um capítulo ou tópico). Juntar vários estudos numa sessão fica para uma próxima versão.
