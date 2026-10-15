# LIO-C · Documentação técnica

**Leitura Inteligente Orientada de Ciências** · versão do documento 1.0 · 15/10/2026 · Autor: Joacy Raimundo França

Este documento descreve como a LIO-C funciona por dentro, na **beta 6** (gerada a partir da LIO-E versão 29). É para quem vai manter, auditar ou adaptar o código.

## 1. Visão geral

A LIO-C é uma página HTML única, sem servidor próprio. Há duas formas:

| Forma | Arquivo | Dados | IA |
|---|---|---|---|
| Versão para Claude | `lio-c.html` | Banco do artefato no claude.ai (área privada de cada usuário) | `sample` do artefato, com a conta de quem usa |
| Versão para navegador | `index.html` | IndexedDB do navegador | API da Anthropic com chave, ou modo copiar e colar |

Bibliotecas carregadas da rede, só quando usadas: **pdf.js** 3.11.174 (leitura de PDF e renderização de páginas) e **MathJax** 3.2.2 (exibição de fórmulas em SVG), ambas do cdnjs.

## 2. De onde vem o código: geração a partir da LIO-E

A LIO-C não é escrita do zero. O script `fonte/gerar_lio_c.py` lê `fonte/base/lio-e.html` (a LIO-E v29) e:

1. troca trechos exatos do código da LIO-E (identidade, armazenamento, extração, etapas, pedidos à IA, índices, revisão);
2. injeta, por último, o módulo de ciências: `fonte/ciencias.js` (funções) e `fonte/ciencias.css` (estilos).

Cada troca exige que o trecho exista exatamente uma vez; se a LIO-E mudar naquele ponto, o script para e mostra o início do trecho. Assim, nenhuma mudança da LIO-E passa despercebida, e as melhorias dela chegam à LIO-C na geração seguinte. O `fonte/build.py` monta a versão para navegador a partir de `lio-c.html`, com `local_parts.js` (banco local, chave da API, modo copiar e colar, downloads) e `local_config.js` (aba Ajustes).

```
cd fonte
python3 gerar_lio_c.py     # gera ../lio-c.html
python3 build.py           # gera lio-c-local.html (renomeie para ../index.html)
```

## 3. Texto com fórmulas

### 3.1 Representação

Fórmulas são guardadas no próprio texto, em LaTeX: `\( … \)` dentro do texto e `\[ … \]` em destaque. Nunca `$`, para não confundir com valores em reais.

### 3.2 Exibição

Um `MutationObserver` no corpo da página percebe qualquer mudança de tela. Se a área principal tiver texto com `\(` ou `\[` (fora de campos de texto e de `<option>`), a LIO-C carrega o MathJax (uma vez) e tipografa só aquela área. Depois de tipografar, insere ao lado de cada fórmula um `<span class="fala">` invisível com a versão falada.

### 3.3 Leitura em voz alta

`falaTex()` converte LaTeX em português: frações ("sobre"), potências ("ao quadrado", "ao cubo", "elevado a"), índices, raízes, vetores ("vetor F"), letras gregas, operadores e relações, vírgula decimal ("0 vírgula 8") e separador de milhar. O leitor da LIO-E ignora o conteúdo do `mjx-container` e lê o `span.fala`.

### 3.4 Marcador e cortes

- O marcador da leitura ativa divide o texto em palavras com `tokTex()`, que trata cada fórmula como uma palavra.
- `fecharTex()` impede que um corte de texto (primeira frase, prévia) termine no meio de uma fórmula.
- `partirLongoTex()` divide parágrafos longos sem cortar fórmulas.

## 4. Extração e leitura por imagem

### 4.1 Extração de texto

A extração da LIO-E (pdf.js, linhas por posição, parágrafos, notas, títulos) é mantida, com duas mudanças:

- texto girado (avisos verticais como "Reprodução proibida", créditos de ilustração) e o próprio aviso do art. 184 do Código Penal são descartados;
- `analisar()` passa a marcar as **páginas com fórmulas** (`ext.formulas`).

### 4.2 Detecção de páginas com fórmulas

`formulaNaPagina()` marca a página se houver qualquer um destes sinais: caracteres de fontes de símbolos (área de uso privado do Unicode ou o caractere de substituição); duas ou mais linhas feitas de pedaços de até 2 caracteres; quatro ou mais operadores (=, ⇒, ∴, ·, √, Δ…); três ou mais letras coladas a números ("v 22", "x2"). Páginas escaneadas (pouco texto) também entram na leitura por imagem.

### 4.3 Leitura por imagem

`lerPorImagem()` começa sozinha depois da extração (`autoLer()`), em lotes de até 3 páginas. Cada página é renderizada a até 1500 px de largura, enviada como JPEG, e o pedido (`promptPaginas()`) devolve itens por página: `titulo`, `texto`, `formula` (LaTeX em destaque) e `figura` (descrição e `caixa` em frações da página). Se um lote falha por resposta incompleta ou grande demais, a LIO-C lê página por página.

- Uma `formula` é anexada ao parágrafo anterior da mesma página.
- Uma `figura` vira um parágrafo próprio com `fig` (a chave da figura); a imagem é recortada da página renderizada (`recortar()`, até 900 px, JPEG 0,8).
- Recortes podem ser ajustados ou feitos à mão (`abrirRecorte()`), arrastando sobre a página.

## 5. Pedidos à IA e verificação

| Pedido | Função | Retorno principal |
|---|---|---|
| Leitura de páginas | `promptPaginas` | itens por página |
| Exercícios da seção | `promptSecaoS` / `validarS` | ideias, fórmulas (símbolos, unidades, quando vale, teste), figuras, deduções, termos |
| Perguntas de compreensão | `promptPerg` (da LIO-E, adaptado) | literal, inferencial, aplicação |
| Plano do Resolver junto | `promptPlano` / `validarPlano` | enunciado, etapas com 3 dicas, resposta, conferência |
| Conferir uma etapa | `promptEtapa` | avaliação, retorno, tipo de erro |
| Questão parecida | `promptVariacao` | um novo plano, no nível pedido |
| Conferir resposta final | `promptFinal` | avaliação sem revelar o valor |
| Treino de erro | `promptTreinoErro` | 5 itens de múltipla escolha |
| Simulador | `promptSim` / `validarSim` | grandezas, faixas, expressão, previsão |
| Simulado da véspera | `promptVespera` | questões de múltipla escolha |

Todo pedido inclui o perfil da disciplina (`PERFIL_FOCO`) e a regra de LaTeX. A verificação descarta itens que não apontam um parágrafo existente do trecho, perguntas de figura que não apontam uma figura, deduções com menos de três passos e termos que não aparecem no texto; a contagem de descartes aparece ao estudante.

## 6. Simulador da fórmula

O Claude só descreve a fórmula. A expressão é compilada por `compilarExpr()`, um avaliador próprio por descida recursiva que aceita apenas números, os identificadores declarados, `+ - * / ^`, parênteses, `pi` e as funções `sqrt`, `abs`, `exp`, `ln`, `log`, `sen`/`sin`, `cos`, `tan` (ângulos em graus). Qualquer outro símbolo, função ou variável desconhecida rejeita a descrição. Código vindo da IA nunca é executado. O gráfico é um SVG desenhado pela página (120 pontos, eixos com valores arredondados, o ponto atual destacado). A descrição validada fica em `gen.formulas[k].sim`.

## 7. Resolver junto, parecidas e mapa de erros

Cada questão fica em `resp.resolv[]`: o plano, a etapa atual (`k`), o estado de cada etapa (`et[]`: resposta, avaliação, retorno, dicas, vista resolvida, tentativas, histórico `hist[]` com o tipo de erro) e, nas parecidas, `var` (origem e nível) e `direta` (a tentativa sem dicas). O índice do Resolver junto conta uma etapa certa sem ajuda como 1, com dica como 0,5 e vista resolvida como 0; uma parecida resolvida direto vale todas as suas etapas. O mapa de erros (`errosDoEstudo()`) soma os históricos de todas as seções do estudo e só aparece a partir de 8 respostas conferidas.

## 8. Dados

### 8.1 Versão para Claude

- `data/users/<id>/est_<estudo>`: o estudo (título, perfil, páginas, situação das seções, resultados, sessões de véspera em `vesperas`).
- `…/est_<estudo>/secoes/<n>`: cada seção (parágrafos, com `fig` e `del` quando for o caso; exercícios `gen`; respostas `resp`).
- `…/est_<estudo>/figs/<chave>`: a imagem de cada figura (JPEG em data URL). Apagar o estudo apaga as figuras.
- `…/rev_<estudo>`: o estado de cada cartão da revisão espaçada.
- No navegador: preferências com o prefixo `lis_`. Atividades, pacotes e backups usam o identificador `lio-ciencias`. Nada disso se mistura com a LIO-E ou a LIO-L.

### 8.2 Versão para navegador

O mesmo esquema de documentos, guardado no IndexedDB `lio-ciencias`. Backups em **Ajustes**. No modo copiar e colar não há envio de imagens: a leitura por imagem e a foto da questão ficam indisponíveis.

## 9. Mascote

A imagem (`fonte/mascote.webp`, 420 px, fundo transparente) é embutida pelo gerador na constante `MASCOTE`. A função `masc()` a insere como imagem decorativa (`alt=""`, `aria-hidden`), sempre ao lado de um texto que carrega a mensagem. Lugares: Início, telas vazias, esperas pela IA (com um balanço leve), dicas do Resolver junto, celebrações e folha de revisão. As animações só rodam quando o sistema não pede menos movimento.

## 10. Acessibilidade

Mantém os ajustes de leitura da LIO-E (fonte, tamanho, entrelinhas, largura, cores, modo foco). Fórmulas em SVG têm a descrição em MathML para leitores de tela e a versão falada para o botão Ouvir. Figuras têm texto alternativo e descrição. Controles do simulador têm rótulo.

## 11. Testes feitos nesta versão

Em navegador sem interface (Chromium), com respostas simuladas da IA e páginas reais de dois livros do ensino médio (Física e Matemática):

- extração: detecção de páginas com fórmulas nos dois livros, descarte do aviso vertical, leitura por imagem em lote e página a página, recorte automático e manual de figuras;
- etapas: Mapa, Leitura ativa (marcador com fórmulas, figuras da página, apagar e restaurar), Fórmulas, Figuras, Passo a passo, Compreensão, Resolver junto (etapas, dicas, vista resolvida, conferência), parecidas (acerto direto e passagem para etapas), mapa de erros e treino, simulador (previsão, controles, gráfico, fórmula não simulável, reabertura sem nova chamada), véspera de prova e folha de revisão;
- revisão espaçada com cartões de fórmula; mediação; versão para navegador com API simulada e modo copiar e colar;
- avaliador de expressões com casos de teste, incluindo a recusa de variáveis e funções desconhecidas.

A qualidade das respostas reais do Claude (transcrição de fórmulas, recortes, exercícios) é avaliada nos testes do autor.

## 12. Histórico

| Versão | Data | Mudanças |
|---|---|---|
| Beta 1 | 2026-10-15 | Primeira versão: leitura por imagem, fórmulas, figuras, perfis, etapas de ciências, Resolver junto; apagar trecho; leitura por imagem automática |
| Beta 2 | 2026-10-15 | Questões parecidas |
| Beta 3 | 2026-10-15 | Mapa de erros e treino por tipo de erro |
| Beta 4 | 2026-10-15 | Simulador da fórmula |
| Beta 5 | 2026-10-15 | Véspera de prova; versão para navegador; manuais |
| Beta 6 | 2026-10-15 | Nome LIO-C (antes LIO-S); mascote |

---

LIO-C · Leitura Inteligente Orientada de Ciências · © 2026 Joacy Raimundo França · Texto sob CC BY 4.0 · Co-desenvolvimento humano–IA (ver `DECLARACAO_IA.md`).
