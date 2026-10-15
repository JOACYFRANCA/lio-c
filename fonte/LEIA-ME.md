# Código-fonte da LIO-C

A LIO-C é **gerada** a partir do código da LIO-E (a LIO original, para textos densos), para que toda melhoria feita na LIO-E chegue também à LIO-C. Os dois arquivos publicados na raiz do repositório (`lio-c.html` e `index.html`) saem desta pasta.

| Arquivo | O que é |
|---|---|
| `base/lio-e.html` | Código da LIO-E usado como base (versão 29). Vem do repositório [JOACYFRANCA/lio](https://github.com/JOACYFRANCA/lio) |
| `gerar_lio_c.py` | Gera `../lio-c.html` (versão para Claude) a partir de `base/lio-e.html` |
| `ciencias.js` | Módulo de ciências, injetado pelo gerador: fórmulas (MathJax, leitura em voz alta), detecção de páginas com fórmulas, leitura de páginas por imagem, figuras e recortes, pedidos à IA, etapas Fórmulas, Figuras, Passo a passo e Resolver junto, cartões de revisão |
| `ciencias.css` | Estilos do módulo de ciências |
| `lio_c_logo.webp` | Logo da LIO-C embutido na página pelo gerador |
| `mascote.webp` | Mascote da família LIO, embutido pelo gerador (constante `MASCOTE`) |
| `build.py` | Monta a versão para navegador a partir de `../lio-c.html` |
| `local_parts.js` | Camada de capacidades da versão para navegador: banco local (IndexedDB), chave e chamadas à API da Anthropic, modo copiar e colar, downloads, formas de uso |
| `local_config.js` | Aba Ajustes da versão para navegador |

## Gerar o arquivo publicado

Precisa só do Python 3, sem bibliotecas extras.

```
cd fonte
python3 gerar_lio_c.py          # gera ../lio-c.html
python3 build.py                # gera lio-c-local.html
```

Renomeie `lio-c-local.html` para `index.html` e substitua o da raiz do repositório. Os arquivos gerados devem ser idênticos aos publicados: é assim que se confere que eles saem deste código.

## O que o gerador muda na LIO-E

| Parte | Mudança |
|---|---|
| Identidade | Título, logo LIO-C, etiqueta de versão "LIO-C · beta N (base vNN)", textos do Início |
| Dados | Prefixo do armazenamento do navegador (`lis_`) e identificador de atividades, pacotes e backups (`lio-ciencias`): a LIO-C nunca lê nem grava os dados das outras LIOs |
| Novo estudo | Escolha da disciplina (perfil); até 40 páginas por estudo; nova tela de revisão com a leitura por imagem e as figuras; figuras salvas numa coleção própria do estudo (`figs`) e apagadas junto com ele |
| Extração | `analisar()` passa a marcar as páginas com fórmulas; figuras atravessam a extração como parágrafos próprios (`fig`); parágrafos longos são partidos sem cortar fórmulas; o texto revisável marca figuras com `‹fig:…›` |
| Texto com fórmulas | O marcador da leitura ativa trata cada fórmula como uma palavra; a primeira frase nunca corta uma fórmula; a leitura em voz alta lê a versão falada da fórmula |
| Etapas | Mapa (com as fórmulas), Leitura ativa (com as figuras da página), Fórmulas, Figuras, Passo a passo, Compreensão (literal, inferencial, aplicação), Resolver junto, Glossário e notas |
| Pedidos à IA | Exercícios, perguntas e retorno escritos para ciências, com o foco do perfil e fórmulas em LaTeX |
| Página do estudo | Botão **Véspera de prova** e a tela própria da sessão |
| Leitura ativa | Botão "Apagar este trecho"; trechos apagados (`del`) saem do mapa, da leitura e dos pedidos à IA; texto girado (avisos verticais) não entra na extração |
| Revisão e índices | Fórmulas e passos viram cartões; Fórmulas, Figuras, Passo a passo e Resolver junto entram no índice de compreensão |

## Quando a LIO-E mudar

1. Copie o `lio.html` novo da LIO-E para `base/lio-e.html`.
2. Rode `python3 gerar_lio_c.py`.
3. Se o script parar com um erro que mostra o início de um trecho, aquele ponto mudou na LIO-E: ajuste a troca correspondente no `gerar_lio_c.py` para o texto novo.
4. Rode `python3 build.py` e teste as duas versões.

## Publicar a versão do Claude

Veja `INSTALAR.md`, na raiz do repositório.

## Licença

Código sob GNU AGPL 3.0 ou posterior (arquivo `LICENSE`); textos sob CC BY 4.0 (arquivo `LICENSE-TEXTOS`). Copyright © 2026 Joacy Raimundo França.
