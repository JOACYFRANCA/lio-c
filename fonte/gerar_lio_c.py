# Gera a LIO-C (LIO para ciências: Matemática, Física e Química) a partir do código-fonte da LIO-E.
# Copyright (C) 2026 Joacy Raimundo França · AGPL-3.0-or-later (ver LICENSE)
#
# Uso, dentro da pasta fonte:  python3 gerar_lio_c.py   →  ../lio-c.html
# Fonte da LIO-E: base/lio-e.html (neste repositório) ou ../lio.html (no repositório da LIO).
# Como o gerar_lio_l.py, troca trechos exatos. Se o código da LIO-E mudar num ponto trocado aqui,
# o script para e mostra o início do trecho que não encontrou.
# O código novo da LIO-C fica em ciencias.js (funções) e ciencias.css (estilos), injetados pelo gerador.
import os, re, base64
_aqui = os.path.dirname(os.path.abspath(__file__))
_cands = [os.path.join(_aqui, 'base', 'lio-e.html'), os.path.join(_aqui, '..', 'lio.html')]
_src = next(c for c in _cands if os.path.exists(c))
_out = os.path.join(_aqui, '..', 'lio-c.html')
s = open(_src, encoding='utf-8').read()
JS = open(os.path.join(_aqui, 'ciencias.js'), encoding='utf-8').read()
_masc = 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(_aqui, 'mascote.webp'), 'rb').read()).decode()
JS = 'const MASCOTE="' + _masc + '";\n' + JS
CSS = open(os.path.join(_aqui, 'ciencias.css'), encoding='utf-8').read()
_logo_p = os.path.join(_aqui, 'lio_c_logo.webp')
_logo = 'data:image/webp;base64,' + base64.b64encode(open(_logo_p, 'rb').read()).decode() if os.path.exists(_logo_p) else None

def rep(a, b, count=1):
    global s
    n = s.count(a)
    assert n == count, (n, a[:80])
    s = s.replace(a, b)

def rep_all(a, b):
    global s
    assert a in s, ('nenhum', a[:80])
    s = s.replace(a, b)

def region(a, b):
    i = s.index(a); j = s.index(b, i)
    return i, j

def rep_region(a, b, new):
    global s
    i, j = region(a, b)
    s = s[:i] + new + s[j:]

# ------------------------------------------------------------------ identidade
rep('<title>LIO · Leitura Inteligente Orientada</title>', '<title>LIO-C · Leitura Inteligente Orientada de Ciências</title>')
rep('<span class="brand-t">Leitura Inteligente Orientada</span>', '<span class="brand-t">Leitura Inteligente Orientada <span class="lio-c">· Ciências</span></span>')
_m = re.search(r'>beta · v(\d+)<', s)
BASE_V = _m.group(1)
s = s.replace(_m.group(0), '>LIO-C · beta 6 (base v%s)<' % BASE_V, 1)
rep('<p class="lead">Leia textos densos por partes, guarde o que importa e acompanhe a sua evolução a cada rodada.</p>',
    '<p class="lead">Estude Matemática, Física e Química pelo livro: fórmulas legíveis, figuras recortadas, deduções passo a passo e questões resolvidas junto com você.</p>')
rep_all('"olh_"', '"lis_"')                        # armazenamento local separado da LIO-E
rep_all('"oficina-leitura"', '"lio-ciencias"')     # atividades e pacotes da LIO-C não se misturam com os das outras LIOs
_h = re.search(r'<!--\n  LIO · Leitura Inteligente Orientada — versão para Claude \(artefato do claude.ai\)\n  Versão (\d+) \(beta\)[^\n]*\n', s)
assert _h, 'cabeçalho do código não encontrado'
s = s.replace(_h.group(0), '<!--\n  LIO-C · Leitura Inteligente Orientada de Ciências — versão para Claude (artefato do claude.ai)\n'
              '  Beta 6 · 15/10/2026 · gerada a partir da LIO-E versão %s por fonte/gerar_lio_c.py\n' % _h.group(1), 1)
if _logo:
    s = re.sub(r'(<img class="lio-logo" src=")data:image/webp;base64,[A-Za-z0-9+/=]+(" alt=")LIO(" width=")68(" height="40">)',
               lambda m: m.group(1) + _logo + m.group(2) + 'LIO-C' + m.group(3) + '106' + m.group(4), s, count=1)
    assert 'alt="LIO-C"' in s, 'logo do cabeçalho não trocado'
    s, _n = re.subn(r'LIO_LOGO="[A-Za-z0-9+/=]+"', 'LIO_LOGO="' + _logo.split(',', 1)[1] + '"', s, count=1)
    assert _n == 1, 'constante LIO_LOGO não encontrada'
    rep('alt="LIO · Leitura Inteligente Orientada" width="440" height="316"', 'alt="LIO-C · Leitura Inteligente Orientada de Ciências" width="391" height="148"')


# ------------------------------------------------------------------ extração: fórmulas e figuras
rep('function analisar(raw,from,to){', 'function analisar0(raw,from,to){')
# figuras atravessam a extração como parágrafos próprios
rep('if(i===0&&last&&!last.h&&!x.h&&!TERM.test(last.t)){last.t=joinL(last.t,t);return}',
    'if(i===0&&last&&!last.h&&!x.h&&!x.fig&&!last.fig&&!TERM.test(last.t)){last.t=joinL(last.t,t);return}')
rep('const o={t,pg:p};if(x.h)o.h=true;if(x.q)o.q=true;pars.push(o)', 'const o={t,pg:p};if(x.h)o.h=true;if(x.q)o.q=true;if(x.fig)o.fig=x.fig;pars.push(o)')
rep('for(const p of pars){if(p.h){out.push(p);continue}for(const t of partirLongo(p.t))out.push({...p,t})}',
    'for(const p of pars){if(p.h||p.fig){out.push(p);continue}for(const t of partirLongoTex(p.t))out.push({...p,t})}', count=2)
# texto revisável: a figura fica marcada com ‹fig:chave›
rep('const toTxt=ps=>ps.map(p=>p.h?`## ${p.t}`:`‹p.${p.pg}›${p.q?">":""} ${p.t}`).join("\\n\\n");',
    'const toTxt=ps=>ps.map(p=>p.h?`## ${p.t}`:`‹p.${p.pg}›${p.q?">":""}${p.fig?`‹fig:${p.fig}›`:""} ${p.t}`).join("\\n\\n");')
rep('''    const o={t:b.replace(/^‹p\\.\\d+›>?\\s*/,"").replace(/\\s+/g," "),pg};if(m&&m[2])o.q=true;if(o.t)out.push(o)}''',
    '''    let rb=b.replace(/^‹p\\.\\d+›>?\\s*/,"");const fm=rb.match(/^‹fig:([\\w-]+)›\\s*/);if(fm)rb=rb.slice(fm[0].length);
    const o={t:rb.replace(/\\s+/g," "),pg};if(m&&m[2])o.q=true;if(fm)o.fig=fm[1];if(o.t)out.push(o)}''')
# leitura por imagem: substitui a leitura de escaneadas da LIO-E
rep_region('function revisaoUI(head){', 'async function salvarNovo(){', '')
rep('async function salvarNovo(){const nv=est.nv;\n  const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6),now=agora(),status={};',
    'async function salvarNovo(){const nv=est.nv;\n  const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6),now=agora(),status={};const usadas=new Set(nv.secs.flatMap(s=>s.pars.filter(p=>p.fig).map(p=>p.fig)));')
rep('try{await mRef(id).set({tipo:"estudo",titulo:nv.titulo||nv.nome,',
    'try{await mRef(id).set({tipo:"estudo",perfil:PERFIS[nv.perfil]?nv.perfil:"fisica",titulo:nv.titulo||nv.nome,')
rep('''    for(const s of nv.secs)await sCol(id).doc(String(s.n)).set({n:s.n,titulo:s.titulo,pgIni:s.pgIni,pgFim:s.pgFim,pars:s.pars,notas:s.notas,gen:null,resp:{},status:"nova",step:"mapa"});''',
    '''    for(const s of nv.secs)await sCol(id).doc(String(s.n)).set({n:s.n,titulo:s.titulo,pgIni:s.pgIni,pgFim:s.pgFim,pars:s.pars,notas:s.notas,gen:null,resp:{},status:"nova",step:"mapa"});
    for(const k of usadas){const f=(nv.figs||{})[k];if(f&&f.img){await fCol(id).doc(k).set({img:f.img,pg:f.pg});FIGS[id+":"+k]=f.img}}''')
# perfil escolhido ao criar o estudo
rep('''    <div class="field"><label for="rf">Referência (opcional)</label>''',
    '''    <div class="field"><label for="pf">Disciplina</label><select id="pf">${Object.entries(PERFIS).map(([k,v])=>`<option value="${k}"${(nv.perfil||perfilPadrao())===k?" selected":""}>${v}</option>`).join("")}</select></div>
    <div class="field"><label for="rf">Referência (opcional)</label>''')
rep('''  Object.assign(nv,{de,ate,titulo:$("#tt").value.trim(),ref:$("#rf").value.trim()});''',
    '''  Object.assign(nv,{de,ate,titulo:$("#tt").value.trim(),ref:$("#rf").value.trim(),perfil:$("#pf").value});save("perfil",nv.perfil);''')
rep('''if(ate-de+1>60){$("#st").textContent="São no máximo 60 páginas por estudo. Divida o livro em capítulos.";return}''',
    '''if(ate-de+1>40){$("#st").textContent="São no máximo 40 páginas por estudo. Livros de ciências têm muitas fórmulas e figuras: divida o livro em capítulos ou tópicos.";return}''')
rep('Escolha só o trecho que vai estudar agora: um capítulo ou um artigo, até 60 páginas.',
    'Escolha só o trecho que vai estudar agora: um tópico ou um capítulo, até 40 páginas.')
# depois da extração, a leitura por imagem das páginas com fórmulas começa sozinha
rep('    nv.ext=analisar(raw,de,ate);montarSecoes();estNovo();', '    nv.ext=analisar(raw,de,ate);montarSecoes();estNovo();autoLer();')
# apagar estudo também apaga as figuras
rep('''        try{const rc=mRef(id).collection("rodadas"),qr=await rc.get();for(const d of qr.docs)await rc.doc(d.id).delete()}catch(e){}''',
    '''        try{const rc=mRef(id).collection("rodadas"),qr=await rc.get();for(const d of qr.docs)await rc.doc(d.id).delete()}catch(e){}
        try{const qf=await fCol(id).get();for(const d of qf.docs)await fCol(id).doc(d.id).delete()}catch(e){}''')

# ------------------------------------------------------------------ texto com fórmulas
# o marcador trata cada fórmula como uma palavra só
rep('const tokW=t=>String(t).split(/(\\s+)/);', 'const tokW=t=>tokTex(t);')
rep('''function primeira(t){const m=t.match(/^.{20,}?[.!?](?=\\s+["“«(]?[A-ZÀ-Ý])/);const s=m?m[0]:t;return s.length>240?s.slice(0,240)+"…":s}''',
    '''function primeira(t){const m=t.match(/^.{20,}?[.!?](?=\\s+["“«(]?[A-ZÀ-Ý])/);const s=fecharTex(m?m[0]:t);return s.length>240?fecharTex(s.slice(0,240))+"…":s}''')
# figuras não são parágrafos de leitura: aparecem junto da página
rep('const corpo=S=>S.pars.map((p,i)=>p.h?-1:i).filter(i=>i>=0);', 'const corpo=S=>S.pars.map((p,i)=>p.h||p.fig?-1:i).filter(i=>i>=0);')
rep('''      if(p.h){html+=`<p class="sh">${esc(p.t)}</p>`;return}''',
    '''      if(p.h){html+=`<p class="sh">${esc(p.t)}</p>`;return}
      if(p.del)return;
      if(p.fig){html+=figHTML(p.fig,p.t);return}''')
rep('''  <ul class="skel">${S.pars.map(p=>p.h?`<li class="sk-h">${esc(p.t)}</li>`:`<li><span class="pgref">p. ${p.pg}</span>${esc(primeira(p.t))}</li>`).join("")}</ul>''',
    '''  <ul class="skel">${S.pars.filter(p=>!p.del).map(p=>p.h?`<li class="sk-h">${esc(p.t)}</li>`:p.fig?`<li class="sk-f"><span class="pgref">p. ${p.pg}</span>${esc(primeira(p.t))}</li>`:`<li><span class="pgref">p. ${p.pg}</span>${esc(primeira(p.t))}</li>`).join("")}</ul>
  ${mapaFormulas(S)}''')
rep('''    ${notas.length?`<details><summary>Notas de rodapé da p. ${P.pg} (${notas.length})</summary>${notas.map(n=>`<p class="note-t">${esc(n.t)}</p>`).join("")}</details>`:""}
    ${CAP.sample?'<div class="stack"><div class="row"><button class="btn small" id="expl">''',
    '''    ${notas.length?`<details><summary>Notas de rodapé da p. ${P.pg} (${notas.length})</summary>${notas.map(n=>`<p class="note-t">${esc(n.t)}</p>`).join("")}</details>`:""}
    ${figsPerto(S,i)}
    ${CAP.sample?'<div class="stack"><div class="row"><button class="btn small" id="expl">''')

# ------------------------------------------------------------------ etapas
rep('''function passos(S){return [["mapa","Mapa"],["leitura","Leitura ativa"],["frases","Frases difíceis"],["vozes","Vozes"],["argumento","Argumento"],["crono","Cronologia"],["compreensao","Compreensão"],["fecho","Glossário e notas"]]}''',
    '''function passos(S){return [["mapa","Mapa"],["leitura","Leitura ativa"],["formulas","Fórmulas"],["figuras","Figuras"],["deducao","Passo a passo"],["compreensao","Compreensão"],["resolver","Resolver junto"],["fecho","Glossário e notas"]]}''')
rep('''const PRECISA_GEN={frases:g=>arr(g.lab).length>0,vozes:g=>!!g.vozes,argumento:g=>!!g.arg,crono:g=>arr(g.crono).length>=3};''',
    '''const PRECISA_GEN={formulas:g=>arr(g.formulas).length>0,figuras:g=>arr(g.figuras).length>0,deducao:g=>arr(g.deducao).length>0};''')
rep_region('const SEM_MATERIAL={', 'const corpo=', '''const SEM_MATERIAL={formulas:"O Claude não encontrou nesta seção fórmulas para treinar.",
  figuras:"Esta seção não tem figuras ou gráficos com perguntas. Para ter figuras, leia as páginas por imagem ao criar o estudo.",
  deducao:"Esta seção não tem uma dedução ou um exemplo resolvido para reconstruir passo a passo."};
''')
rep('''  if(s==="frases"){est.fi=0;est.fr={c:0,t:0}}
  if(s==="vozes"){est.va={};est.vok=false}
  if(s==="argumento"){est.am=null;est.aa={};est.aok=false}
  if(s==="crono"){est.co=null;est.cok=false}''',
    '''  if(s==="formulas")est.fo=null;
  if(s==="figuras")est.fg=null;
  if(s==="deducao")est.dd=null;
  if(s==="resolver")est.rj=null;''')
rep('''  ({mapa:pMapa,leitura:pLeitura,frases:pFrases,vozes:pVozes,argumento:pArg,crono:pCrono,compreensao:pComp,fecho:pFecho})[cur](S,$("#st"));''',
    '''  ({mapa:pMapa,leitura:pLeitura,formulas:pFormulas,figuras:pFiguras,deducao:pDeducao,compreensao:pComp,resolver:pResolver,fecho:pFecho})[cur](S,$("#st"));''')
rep('''id==="frases"?!!R.frases:id==="vozes"?!!R.vozes:id==="argumento"?!!R.arg:id==="crono"?!!R.crono:''',
    '''id==="formulas"?!!R.formulas:id==="figuras"?!!R.figuras:id==="deducao"?!!R.deducao:id==="resolver"?arr(R.resolv).some(x=>x&&x.fim):''')
# texto girado (avisos verticais como "Reprodução proibida", créditos de ilustração) não entra no texto
rep('for(const i of tc.items){if(typeof i.str!=="string"||!i.str.trim())continue;',
    'for(const i of tc.items){if(typeof i.str!=="string"||!i.str.trim())continue;if(Math.abs(i.transform[1])>Math.abs(i.transform[0])*0.5)continue;if(RX_AVISO.test(i.str))continue;')
# parágrafos apagados pelo estudante (p.del) saem da leitura, do mapa e dos pedidos à IA
rep('const corpo=S=>S.pars.map((p,i)=>p.h||p.fig?-1:i).filter(i=>i>=0);', 'const corpo=S=>S.pars.map((p,i)=>p.h||p.fig||p.del?-1:i).filter(i=>i>=0);')
rep('const trechoNum=S=>S.pars.map((p,i)=>p.h?`## ${p.t}`:`[P${i+1}] ${p.t}`).join("\\n\\n");',
    'const trechoNum=S=>S.pars.map((p,i)=>p.del?null:p.h?`## ${p.t}`:`[P${i+1}] ${p.t}`).filter(x=>x!==null).join("\\n\\n");')
rep('<label for="tag">Etiqueta: a ideia deste parágrafo em 3 a 8 palavras suas</label>',
    '<label for="tag">Etiqueta: a ideia deste parágrafo em 3 a 8 palavras suas. Se for uma fórmula, descreva o que ela diz</label>')
rep('Leia o parágrafo abaixo e responda em duas linhas, em português do Brasil:',
    'Leia o parágrafo abaixo e responda em duas linhas, em português do Brasil. Se o parágrafo for principalmente uma fórmula, a etiqueta diz em palavras o que a fórmula relaciona (por exemplo: energia cinética cresce com massa e velocidade ao quadrado).')
# botão para apagar um trecho inútil (aviso, lixo da extração) e restaurar na seção inteira
rep('''<div class="navpar">${est.li>0?'<button class="btn small" id="pant">◀ Parágrafo anterior</button>':""}${botaoSec}</div>''',
    '''<div class="navpar">${est.li>0?'<button class="btn small" id="pant">◀ Parágrafo anterior</button>':""}${botaoSec}<button class="btn small apagar" id="apgP" type="button" title="Apagar este trecho se ele não tem conteúdo (aviso, número de página, texto embaralhado)">Apagar este trecho</button></div>''')
rep('    $("#sk").onclick=()=>irPara(est.li+1);ligarNav();', '    $("#sk").onclick=()=>irPara(est.li+1);ligarNav();ligarApagar(S,i,()=>{est.lph="read";est.sug=null;pLeitura(S,el)});')
rep('<div class="passage secinteira"><span class="label">Seção inteira', '${blocoApagados(S)}<div class="passage secinteira"><span class="label">Seção inteira')
rep('const volta=()=>{pararVoz();est.verSec=false;pLeitura(S,el)};$("#vsx").onclick=volta;$("#vsx2").onclick=volta;',
    'const volta=()=>{pararVoz();est.verSec=false;pLeitura(S,el)};$("#vsx").onclick=volta;$("#vsx2").onclick=volta;ligarApagados(S,()=>pLeitura(S,el));')
# modo véspera de prova: botão na página do estudo e tela própria
rep('<button class="btn" id="imp">Imprimir / salvar em PDF</button></div>', '<button class="btn" id="imp">Imprimir / salvar em PDF</button><button class="btn" id="vesp">Véspera de prova</button></div>')
rep('  $("#fich").onclick=()=>estGo("fich");ligarImp();', '  $("#fich").onclick=()=>estGo("fich");ligarImp();$("#vesp").onclick=()=>{est.vp=null;estGo("vespera")};')
rep('pac:estPac})[est.view]();', 'pac:estPac,vespera:estVespera})[est.view]();')
# mascote: Início, telas vazias, esperas e celebrações (nunca no meio da leitura ou dos testes)
rep('<p class="lead">Estude Matemática, Física e Química pelo livro: fórmulas legíveis, figuras recortadas, deduções passo a passo e questões resolvidas junto com você.</p></div></section>',
    '<p class="lead">Estude Matemática, Física e Química pelo livro: fórmulas legíveis, figuras recortadas, deduções passo a passo e questões resolvidas junto com você.</p></div>${masc("m-hero")}</section>')
rep('const vazio=m=>`<div class="vazio"><span class="vz-i" aria-hidden="true"></span><p>${m}</p></div>`;', 'const vazio=m=>`<div class="vazio">${masc("m-vazio")}<p>${m}</p></div>`;')
rep('<span class="cele-i" aria-hidden="true">✓</span>', '${masc("m-cele")}')
rep('<div class="panel">${job?`<b><span class="spin"></span>Preparando os exercícios desta seção…</b>', '<div class="panel">${job?`<div class="espera">${masc("m-espera")}<b><span class="spin"></span>Preparando os exercícios desta seção…</b></div>')
# textos de apresentação que ainda falavam das etapas de ciências humanas
rep('Anexe um PDF e escolha o capítulo da semana. O texto é dividido em seções de 15 a 20 minutos, e cada seção passa por mapa, leitura ativa, frases difíceis, vozes, argumento e cronologia. No fim, o fichamento sai pronto.',
    'Anexe o PDF do livro e escolha um tópico ou capítulo. A LIO-C lê as fórmulas e as figuras, divide o texto em seções, e cada seção passa por mapa, leitura ativa, fórmulas, figuras, passo a passo, compreensão e resolver junto. No fim, o fichamento sai pronto.')
rep('o texto é dividido em seções de 15 a 20 minutos, e cada seção passa por mapa, leitura ativa, frases difíceis, vozes, argumento, cronologia e compreensão.',
    'o texto é dividido em seções, e cada seção passa por mapa, leitura ativa, fórmulas, figuras, passo a passo, compreensão e resolver junto.')
rep('Nenhum estudo ainda. Comece com “Novo estudo” e um PDF do curso.','Nenhum estudo ainda. Comece com “Novo estudo” e o PDF do seu livro.')
# leitura em voz alta: a fórmula é lida pela versão falada (span .fala), não pelos glifos do MathJax
rep('acceptNode:n=>n.parentElement&&n.parentElement.closest(".pbar,.label")?NodeFilter.FILTER_REJECT',
    'acceptNode:n=>n.parentElement&&n.parentElement.closest(".pbar,.label,mjx-container")?NodeFilter.FILTER_REJECT')
# pedidos à IA da seção
rep_region('function promptSecao(S){', 'function redesenharSecao(){', 'function promptSecao(S){return promptSecaoS(S)}\nfunction validar(g,S){return validarS(g,S)}\n')

# ------------------------------------------------------------------ compreensão: crítica vira aplicação
rep('const NIVEL={literal:"Literal",inferencial:"Inferencial",critica:"Crítica"};', 'const NIVEL={literal:"Literal",inferencial:"Inferencial",critica:"Aplicação"};')
rep('critica:"Pede que você avalie o argumento e se posicione, com base no texto."};', 'critica:"Pede que você use o conceito numa situação nova ou explique um fenômeno com base no texto."};')
rep('Você prepara perguntas de compreensão de leitura para um estudante que tem dificuldade em compreender e memorizar textos.',
    'Você prepara perguntas de compreensão para um estudante que estuda ${PERFIS[perfilAtual()]} por um livro didático.')
rep('2 críticas (pedem que o estudante avalie o argumento do autor e se posicione, com base em elementos do texto).',
    '2 de aplicação (pedem que o estudante use um conceito do trecho numa situação nova e concreta, ou explique um fenômeno do cotidiano com base no trecho; não peça cálculos longos). Toda fórmula e símbolo em LaTeX entre \\\\( e \\\\); nunca use $.')
rep('"nivel" é "literal", "inferencial" ou "critica".', '"nivel" é "literal", "inferencial" ou "critica" (use "critica" para as de aplicação).')
rep('para crítica, o que uma boa resposta precisa considerar, em até 40 palavras.', 'para aplicação, o que uma boa resposta precisa conter, em até 40 palavras.')
rep('Numa pergunta crítica, é "completa" quando a posição do estudante está fundamentada em elementos do texto, concorde ele ou não com o autor.',
    'Numa pergunta de aplicação, é "completa" quando o estudante usa corretamente o conceito do trecho na situação, mesmo com palavras diferentes da referência. Aceite notação matemática informal (como v^2 ou x2 para x ao quadrado).')

# ------------------------------------------------------------------ revisão espaçada e índices
rep('''    for(const q of arr(S.perg).map((q,k)=>({...q,k})))if(q.n!=="critica"&&R.perg''',
    '''    out.push(...cartoesCiencias(S,R,g,base,id,onde,pgi));
    for(const q of arr(S.perg).map((q,k)=>({...q,k})))if(q.n!=="critica"&&R.perg''')
rep('Os cartões vêm das seções que você já estudou: suas etiquetas, o glossário, o argumento, as vozes e a cronologia.',
    'Os cartões vêm das seções que você já estudou: suas etiquetas, o glossário, as fórmulas, os passos das deduções e as perguntas de compreensão.')
rep('const COMP_ROT={ide:"Ideia central",frases:"Frases difíceis",vozes:"Vozes",arg:"Argumento",crono:"Cronologia",perg:"Compreensão",teste:"Teste"};',
    'const COMP_ROT={ide:"Ideia central",formulas:"Fórmulas",figuras:"Figuras",deducao:"Passo a passo",resolv:"Resolver junto",perg:"Compreensão",teste:"Teste"};')
rep('const soma={ide:[0,0],frases:[0,0],vozes:[0,0],arg:[0,0],crono:[0,0],perg:[0,0]};',
    'const soma={ide:[0,0],formulas:[0,0],figuras:[0,0],deducao:[0,0],resolv:[0,0],perg:[0,0]};')
rep('''    ["frases","vozes","arg","crono"].forEach(k=>{const x=R[k];if(x&&x.t){soma[k][0]+=x.c||0;soma[k][1]+=x.t}});''',
    '''    ["formulas","figuras","deducao"].forEach(k=>{const x=R[k];if(x&&x.t){soma[k][0]+=x.c||0;soma[k][1]+=x.t}});
    {const x=indiceResolver(R);if(x.t){soma.resolv[0]+=x.c;soma.resolv[1]+=x.t}}''')

# ------------------------------------------------------------------ CSS e módulo de ciências (por último, para as trocas acima não o alcançarem)
s = s.replace('</style>\n', '\n/* ---- LIO-C ---- */\n' + CSS + '</style>\n', 1)
rep('/* ======================= IMPRESSÃO (PDF) =======================', JS + '\n/* ======================= IMPRESSÃO (PDF) =======================')

open(_out, 'w', encoding='utf-8').write(s)
print('ok →', os.path.relpath(_out), len(s), 'bytes · base LIO-E v' + BASE_V)
