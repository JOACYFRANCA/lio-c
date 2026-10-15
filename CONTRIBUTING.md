# Como contribuir com a LIO-C

A LIO-C está em **versão beta**: em teste, aberta a quem quiser usar e dar opinião. As contribuições desta fase definem a versão 1.0.

## Formas de contribuir

| Você quer… | Como fazer | Precisa de conta no GitHub? |
|---|---|---|
| Dizer o que achou da LIO-C | Responda ao [formulário de opinião](https://docs.google.com/forms/d/e/1FAIpQLSfgBYt45TQsZMBL3DV7KHX-LgpnLY-RDb17_6ggDfYdwDai4Q/viewform) (uns 5 minutos) | Não |
| Relatar um erro | Abra uma [Issue](https://github.com/JOACYFRANCA/lio-c/issues/new/choose) com o modelo **Erro** | Sim |
| Sugerir uma melhoria | Abra uma [Issue](https://github.com/JOACYFRANCA/lio-c/issues/new/choose) com o modelo **Sugestão** | Sim |
| Contar como usou com um grupo | Use o formulário (há perguntas para quem media) ou abra uma Issue **Sugestão** | Não |
| Ajudar nas versões para ChatGPT e Gemini | Essas versões seguem as da LIO-E e serão construídas pelo autor, uma de cada vez. Se quiser testar quando saírem, abra uma Issue **Sugestão** se oferecendo | Sim |

## Sobre o código: por que não aceitamos pull requests

A LIO-C, como toda a família LIO, é um projeto de **co-desenvolvimento humano–IA**: o autor concebe, especifica e valida; o código é gerado pela IA de cada plataforma sob a direção dele. Esse processo é registrado versão por versão (ver `DECLARACAO_IA.md` e `REGISTRO_DESENVOLVIMENTO.md`) e é parte do que o projeto quer mostrar. O código da LIO-C é gerado a partir do da LIO-E pelo script `fonte/gerar_lio_c.py`: melhorias de leitura em geral entram primeiro na LIO-E e chegam à LIO-C na geração seguinte.

Código escrito diretamente por outras pessoas misturaria esse registro. Por isso:

- **Não aceitamos pull requests com alterações no código.**
- Toda sugestão entra como **Issue**. O autor avalia e, se for adiante, implementa com a IA e registra a mudança, citando a Issue de origem.
- Correções de texto na documentação (erros de digitação, links quebrados) podem vir por pull request.
- Você é livre para fazer a sua própria cópia e modificá-la, conforme a licença do código (AGPL-3.0): quem distribuir uma versão modificada precisa manter os créditos e oferecer o código-fonte dela.

## Antes de abrir uma Issue

- Procure se o assunto já foi registrado.
- **Nunca inclua páginas, trechos longos ou figuras de livros didáticos**, nem arquivos de atividade com esses textos: eles são protegidos por direitos autorais. Descreva o problema e, se precisar, cite só a fórmula ou a frase em questão.
- Se o problema for uma fórmula mal transcrita, um exercício ou uma etapa do Resolver junto, diga a disciplina, o livro e a página, copie o item e diga por que ele está errado.
- **Nunca inclua dados pessoais** de participantes: nomes, e-mails, respostas ou relatórios.
- Diga qual versão você usa: o número aparece ao lado do logo, no topo da LIO-C, junto da etiqueta "beta" (por exemplo, "LIO-C · beta 1 (base v29)").

## Como as contribuições são tratadas

1. O autor lê e responde a Issue, normalmente na mesma semana.
2. Ela recebe uma etiqueta: `erro`, `sugestão`, `planejado`, `não agora` ou `resolvido`.
3. Quando a mudança entra numa versão, o `REGISTRO_DESENVOLVIMENTO.md` cita o número da Issue.

## Convivência

Seja respeitoso e objetivo. A LIO-C foi feita para quem estuda Matemática, Física e Química: relatos de fórmulas mal transcritas, figuras mal recortadas, exercícios com erro de conteúdo e etapas do Resolver junto que entregam a resposta cedo demais são especialmente bem-vindos.

---

LIO-C · Joacy Raimundo França
