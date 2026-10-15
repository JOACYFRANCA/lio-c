/* ======================= LIO-C · CIÊNCIAS =======================
   Módulo injetado por fonte/gerar_lio_c.py no código da LIO-E.
   Fórmulas (LaTeX, exibidas com MathJax), leitura de páginas por imagem, figuras recortadas,
   etapas de ciências (Fórmulas, Figuras, Passo a passo, Resolver junto) e cartões de revisão. */
/* Mascote: decorativo (a mensagem está sempre no texto ao lado) */
const masc=cls=>`<img class="masc ${cls||""}" src="${MASCOTE}" alt="" aria-hidden="true" draggable="false">`;
const PERFIS={fisica:"Física",matematica:"Matemática",quimica:"Química"};
const PERFIL_FOCO={fisica:"grandezas físicas e suas unidades, leis e condições de validade dos modelos, gráficos e diagramas de forças",
  matematica:"definições, teoremas e suas hipóteses, propriedades, gráficos de funções e procedimentos de resolução",
  quimica:"equações químicas e balanceamento, fórmulas e nomenclatura, grandezas como mol, massa molar e concentração"};
const perfilPadrao=()=>{const p=load("perfil","fisica");return PERFIS[p]?p:"fisica"};
const perfilAtual=()=>{const p=est.meta&&est.meta.perfil;return PERFIS[p]?p:perfilPadrao()};
const LATEX_REGRA="Toda fórmula, símbolo, variável com índice, vetor, unidade com expoente ou equação química vai em LaTeX entre \\( e \\) (exemplos: \\(v_2^2 = v_1^2 + 2ad\\), \\(\\vec{F}\\), \\(10\\ \\text{m/s}^2\\), \\(\\mathrm{H_2O}\\)). Nunca use $.";

/* --- texto com fórmulas --- */
const RX_TEX=/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;
const tokTex=t=>{const out=[];String(t).split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/).forEach((seg,i)=>{if(!seg)return;if(i%2){out.push(seg);return}
  seg.split(/(\s+)/).forEach(x=>{if(x!=="")out.push(x)})});return out};
function fecharTex(s){s=String(s);const a=s.lastIndexOf("\\("),b=s.lastIndexOf("\\)");if(a>b)s=s.slice(0,a).trimEnd();
  const c=s.lastIndexOf("\\["),d=s.lastIndexOf("\\]");if(c>d)s=s.slice(0,c).trimEnd();return s}
function partirLongoTex(t){if(!/\\\(|\\\[/.test(t))return partirLongo(t);const M=[];
  const u=t.replace(RX_TEX,m=>{M.push(m);return "\u0001"+(M.length-1)+"\u0002"});
  return partirLongo(u).map(x=>x.replace(/\u0001(\d+)\u0002/g,(_,i)=>M[+i]))}

/* --- MathJax: carregado só quando aparece uma fórmula na tela --- */
let mjP=null;
function carregarMJ(){if(mjP)return mjP;
  window.MathJax={tex:{inlineMath:[["\\(","\\)"]],displayMath:[["\\[","\\]"]]},svg:{fontCache:"global"},
    options:{skipHtmlTags:["script","noscript","style","textarea","pre","code","select","option"],ignoreHtmlClass:"semtex"},startup:{typeset:false}};
  mjP=new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js";
    s.onload=()=>{const w=()=>{const M=window.MathJax;if(M&&M.typesetPromise&&M.startup&&M.startup.promise)M.startup.promise.then(()=>res(M));else setTimeout(w,50)};w()};
    s.onerror=()=>{mjP=null;rej(new Error("mathjax"))};document.head.appendChild(s)});
  return mjP}
function temTex(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;
    return !p||/^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(p.nodeName)||(p.closest&&p.closest("mjx-container,.semtex"))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  let n;while((n=w.nextNode()))if(/\\\(|\\\[/.test(n.nodeValue))return true;return false}
let texT=null,texFila=Promise.resolve();
function agendarTex(){clearTimeout(texT);texT=setTimeout(()=>{texFila=texFila.then(rodarTex).catch(()=>{})},30)}
async function rodarTex(){const alvos=[main,...document.querySelectorAll(".rc-ov")];
  for(const a of alvos)hidratarFigs(a);
  const comTex=alvos.filter(temTex);if(!comTex.length)return;
  let MJ;try{MJ=await carregarMJ()}catch(e){return}
  try{if(MJ.typesetClear)MJ.typesetClear(comTex);await MJ.typesetPromise(comTex);anotarFala(MJ)}catch(e){try{console.warn("LIO-C · fórmula não exibida",e)}catch(x){}}}
const GREGO={alpha:"alfa",beta:"beta",gamma:"gama",Gamma:"gama",delta:"delta",Delta:"delta",epsilon:"épsilon",varepsilon:"épsilon",zeta:"zeta",eta:"eta",theta:"teta",Theta:"teta",
  kappa:"capa",lambda:"lambda",Lambda:"lambda",mu:"mi",nu:"ni",xi:"csi",pi:"pi",Pi:"pi",rho:"rô",sigma:"sigma",Sigma:"sigma",tau:"tau",phi:"fi",varphi:"fi",Phi:"fi",chi:"qui",psi:"psi",omega:"ômega",Omega:"ômega"};
const OPS=[[/\\(?:cdot|times)/g," vezes "],[/\\div/g," dividido por "],[/\\neq|\\ne\b/g," diferente de "],[/\\leq?\b|\\leqslant/g," menor ou igual a "],[/\\geq?\b|\\geqslant/g," maior ou igual a "],
  [/\\approx|\\cong|\\simeq/g," aproximadamente "],[/\\(?:Rightarrow|implies)/g," implica "],[/\\therefore/g," portanto "],[/\\(?:to|rightarrow|longrightarrow)/g," resulta em "],
  [/\\(?:rightleftharpoons|leftrightarrow)/g," em equilíbrio com "],[/\\pm/g," mais ou menos "],[/\\infty/g," infinito "],[/\\in\b/g," pertence a "],[/\\%/g," por cento "],[/\\circ/g," graus "],
  [/\\(?:sum)/g," somatório de "],[/\\int/g," integral de "],[/\\lim/g," limite "],[/\\(?:sin|sen)\b/g," seno de "],[/\\cos\b/g," cosseno de "],[/\\(?:tan|tg)\b/g," tangente de "],[/\\log\b/g," logaritmo de "],[/\\ln\b/g," logaritmo natural de "],
  [/</g," menor que "],[/>/g," maior que "],[/=/g," igual a "],[/\+/g," mais "],[/[−-]/g," menos "],[/\//g," por "]];
function falaTex(t){let s=" "+String(t).replace(/(\d)\s*\{,\}\s*(\d)/g,"$1 vírgula $2").replace(/(\d),(\d)/g,"$1 vírgula $2")+" ";
  for(let k=0;k<6;k++)s=s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g," $1 sobre $2 ").replace(/\\sqrt\s*\[([^\]]*)\]\s*\{([^{}]*)\}/g," raiz $1 de $2 ").replace(/\\sqrt\s*\{([^{}]*)\}/g," raiz de $1 ")
    .replace(/\\vec\s*\{([^{}]*)\}/g," vetor $1 ").replace(/\\vec\s*([A-Za-z])/g," vetor $1 ").replace(/\\(?:text|mathrm|mathbf|mathit|operatorname|textbf)\s*\{([^{}]*)\}/g," $1 ")
    .replace(/\\(?:overline|bar|hat|overset\{[^{}]*\})\s*\{([^{}]*)\}/g," $1 ").replace(/\\(?:left|right|big|Big)\b/g," ")
    .replace(/\^\s*\{\s*2\s*\}|\^\s*2(?!\d)/g," ao quadrado ").replace(/\^\s*\{\s*3\s*\}|\^\s*3(?!\d)/g," ao cubo ")
    .replace(/\^\s*\{([^{}]*)\}/g," elevado a $1 ").replace(/\^\s*([^\s{}\\])/g," elevado a $1 ").replace(/_\s*\{([^{}]*)\}/g," $1 ").replace(/_\s*([^\s{}\\])/g," $1 ");
  s=s.replace(/\\([A-Za-z]+)/g,(m,g)=>GREGO[g]?" "+GREGO[g]+" ":m);
  for(const [r,v] of OPS)s=s.replace(r,v);
  return s.replace(/\\[A-Za-z]+/g," ").replace(/\\./g," ").replace(/[{}&]/g," ").replace(/(\d)\.(\d{3})/g,"$1$2").replace(/\s+/g," ").trim()}
function anotarFala(MJ){try{for(const it of MJ.startup.document.math){const r=it.typesetRoot;if(!r||!r.isConnected)continue;const nx=r.nextSibling;
    if(nx&&nx.nodeType===1&&nx.classList.contains("fala"))continue;const sp=document.createElement("span");sp.className="fala";sp.setAttribute("aria-hidden","true");sp.textContent=" "+falaTex(it.math)+" ";r.after(sp)}}catch(e){}}
function iniciarTex(){if(iniciarTex.on)return;iniciarTex.on=true;
  new MutationObserver(agendarTex).observe(document.body,{childList:true,subtree:true});agendarTex()}

/* --- figuras --- */
const FIGS={};
const fCol=id=>mRef(id).collection("figs");
const figHTML=(k,cap,aberta)=>`<figure class="fig"><img data-fig="${esc(k)}" alt="${esc(cap?primeira(cap).replace(RX_TEX,"fórmula"):"Figura")}">${cap?`<figcaption>${esc(cap)}</figcaption>`:""}</figure>`;
function hidratarFigs(raiz){(raiz||main).querySelectorAll("img[data-fig]:not([data-ld])").forEach(async im=>{im.setAttribute("data-ld","1");const k=im.dataset.fig;
  const nvf=est.nv&&est.nv.figs&&est.nv.figs[k];if(nvf&&nvf.img){im.src=nvf.img;return}
  const key=(est.id||"")+":"+k;if(FIGS[key]){im.src=FIGS[key];return}
  if(!CAP.db||!CAP.uid||!est.id){im.closest("figure").classList.add("semimg");return}
  try{const d=await fCol(est.id).doc(k).get();if(d.exists&&d.data().img){FIGS[key]=d.data().img;im.src=FIGS[key]}else im.closest("figure").classList.add("semimg")}
  catch(e){im.closest("figure").classList.add("semimg")}})}
function figsPerto(S,i){const P=S.pars[i],F=S.pars.map((p,j)=>({p,j})).filter(x=>x.p.fig&&!x.p.del&&x.p.pg===P.pg);if(!F.length)return "";
  const cita=/\b(fig\.?|figura|gr[áa]fico|esquema|tabela|diagrama|ilustra)/i.test(P.t);
  const perto=x=>{if(cita)return true;const a=Math.min(i,x.j),b=Math.max(i,x.j);for(let k=a+1;k<b;k++)if(!S.pars[k].h&&!S.pars[k].fig)return false;return true};
  const abre=F.some(perto);
  return `<details class="figs"${abre?" open":""}><summary>${F.length===1?"Figura":"Figuras"} da p. ${P.pg} (${F.length})</summary><div class="figgrid">${F.map(x=>figHTML(x.p.fig,x.p.t)).join("")}</div></details>`}

/* --- detecção de páginas com fórmulas --- */
function formulaNaPagina(lines){let pua=0,curtas=0,ops=0,sobr=0;
  for(const l of lines){const t=l.t;pua+=(t.match(/[\uE000-\uF8FF\uFFFD]/g)||[]).length;
    const tk=t.split(/\s+/).filter(Boolean);if(tk.length>=3&&tk.filter(x=>x.length<=2).length/tk.length>=0.6)curtas++;
    ops+=(t.match(/[=⇒∴→≠≤≥±√∑∫∆Δ·×÷]/g)||[]).length;
    sobr+=(t.match(/(^|\s)[A-Za-zα-ωΔτ]\s?\d{2}(?=\s|$)|(^|\s)[a-z]\d(?=\s|$)/g)||[]).length}
  return pua>0||curtas>=2||ops>=4||sobr>=3}
function analisar(raw,from,to){const r=analisar0(raw,from,to);
  r.formulas=Object.keys(raw).map(Number).filter(p=>!r.scanned.includes(p)&&formulaNaPagina(raw[p].lines)).sort((a,b)=>a-b);r.lidas=[];return r}

/* --- leitura de páginas por imagem --- */
async function renderPagina(p,maxW){const page=await est.nv.pdf.getPage(p),v1=page.getViewport({scale:1}),vp=page.getViewport({scale:Math.min(2.5,maxW/v1.width)});
  const c=document.createElement("canvas");c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);
  await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;if(page.cleanup)page.cleanup();return c}
const paraBlob=(c,q)=>new Promise(r=>c.toBlob(r,"image/jpeg",q||0.85));
function caixaOk(b){if(!Array.isArray(b)||b.length!==4)return null;let v=b.map(Number);if(v.some(x=>!isFinite(x)))return null;
  const mx=Math.max(...v);if(mx>1&&mx<=1000)v=v.map(x=>x/1000);if(mx>1000)return null;
  v=v.map(x=>Math.max(0,Math.min(1,x)));if(v[2]-v[0]<0.03||v[3]-v[1]<0.02)return null;return v}
function recortar(c,bb,marg){const m=marg==null?0.012:marg,W=c.width,H=c.height;
  const sx=Math.max(0,Math.floor((bb[0]-m)*W)),sy=Math.max(0,Math.floor((bb[1]-m)*H)),ex=Math.min(W,Math.ceil((bb[2]+m)*W)),ey=Math.min(H,Math.ceil((bb[3]+m)*H));
  const w=ex-sx,h=ey-sy;if(w<16||h<16)return null;const k=Math.min(1,900/w),o=document.createElement("canvas");o.width=Math.round(w*k);o.height=Math.round(h*k);
  const g=o.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,o.width,o.height);g.drawImage(c,sx,sy,w,h,0,0,o.width,o.height);
  return o.toDataURL("image/jpeg",0.8)}
const novaChaveFig=p=>"f"+p+"_"+Math.random().toString(36).slice(2,7);
function promptPaginas(pgs){return `${pgs.length>1?`As ${pgs.length} imagens são as páginas ${pgs.join(", ")} (nesta ordem)`:`A imagem é a página ${pgs[0]}`} de um livro de ${PERFIS[est.nv.perfil]||PERFIS[perfilPadrao()]} que o estudante anexou para estudo pessoal. Transcreva cada página fielmente, sem resumir, corrigir ou comentar.

Regras:
- Itens na ordem de leitura. Em páginas de duas colunas, a coluna da esquerda inteira antes da direita; boxes laterais depois do texto principal. Junte palavras hifenizadas no fim da linha. Omita cabeçalhos, rodapés repetidos, números de página, avisos laterais (como "Reprodução proibida"), créditos de ilustração e orientações ao professor (anotações coloridas na margem, como "Comente com os estudantes").
- ${LATEX_REGRA} Fórmula em destaque, sozinha na linha, vira um item "formula" com o LaTeX entre \\[ e \\].
- Títulos de seção e nomes de boxes ("Exercício resolvido", "Saiba mais", "Exercícios propostos"): tipo "titulo". O conteúdo dos boxes: tipo "texto". Exercícios numerados: um item "texto" por exercício, com as alternativas no mesmo item.
- Cada figura, gráfico, diagrama, esquema ou tabela com conteúdo vira um item "figura" no lugar em que aparece na leitura. Em "texto": a legenda, se houver, e uma descrição objetiva do que a figura mostra (valores, eixos e unidades, setas e rótulos visíveis, tendência), em até 60 palavras, com LaTeX nos símbolos. Em "caixa": a posição da figura na página como [x0, y0, x1, y1], em frações de 0 a 1 da largura e da altura, a partir do canto superior esquerdo, incluindo os rótulos da figura. Ignore fotos decorativas, enfeites e ícones.
- Notas de rodapé à parte, em "notas".

Responda apenas com JSON neste formato:
{"paginas":[{"pagina":${pgs[0]},"itens":[{"tipo":"titulo","texto":"..."},{"tipo":"texto","texto":"..."},{"tipo":"formula","texto":"\\\\[ ... \\\\]"},{"tipo":"figura","texto":"...","caixa":[0.1,0.3,0.5,0.6]}],"notas":[]}]}`}
async function lerGrupo(grupo,ctl,aviso){const nv=est.nv,canv={},blobs=[];
  for(const p of grupo){aviso(`Preparando a imagem da página ${p}`);canv[p]=await renderPagina(p,1500);blobs.push(await paraBlob(canv[p]))}
  aviso(grupo.length>1?`O Claude está lendo as páginas ${grupo[0]}–${grupo[grupo.length-1]}`:`O Claude está lendo a página ${grupo[0]}`);
  let r;
  try{r=await CAP.sample.json(promptPaginas(grupo),{images:blobs,signal:ctl.signal,cache:false})}
  catch(e){if(grupo.length>1&&e&&(e.code==="invalid_json"||e.code==="prompt_too_large"||e.code==="empty_completion")){let ok=0;for(const p of grupo)ok+=await lerGrupo([p],ctl,aviso);return ok}throw e}
  let ok=0;
  for(const x of arr(r&&r.paginas)){const p=+x.pagina;if(!grupo.includes(p))continue;const pars=[];
    for(const it of arr(x.itens)){const tp=String(it&&it.tipo||"texto"),t=String(it&&it.texto||"").trim();if(!t&&tp!=="figura")continue;
      if(tp==="titulo"){pars.push({t,h:true});continue}
      if(tp==="formula"){const f=/^\\\[/.test(t)?t:"\\["+t.replace(/^\\\(|\\\)$/g,"")+"\\]",ult=pars[pars.length-1];
        if(ult&&!ult.h&&!ult.fig)ult.t+=" "+f;else pars.push({t:f});continue}
      if(tp==="figura"){const bb=caixaOk(it.caixa),img=bb?recortar(canv[p],bb):null,k=novaChaveFig(p);
        nv.figs=nv.figs||{};if(img)nv.figs[k]={img,pg:p,bb};pars.push({t:t||`Figura da página ${p}`,fig:k});continue}
      pars.push(tp==="citacao"?{t,q:true}:{t})}
    if(!pars.length)continue;
    nv.ext.pages[p]={pars,notes:arr(x.notas).map(String).filter(Boolean),img:true};
    nv.ext.scanned=nv.ext.scanned.filter(q=>q!==p);nv.ext.lidas=[...new Set([...arr(nv.ext.lidas),p])];ok++}
  return ok}
async function lerPorImagem(pgs){const nv=est.nv;if(nv.job||!pgs.length)return;
  const ctl=new AbortController(),lote=Math.max(1,Math.min(CAP.imgMax,3));nv.job={ctl,feitas:0,total:pgs.length,msg:""};
  const aviso=m=>{nv.job.msg=m;const e=$("#ost");if(e)e.innerHTML=`<span class="spin"></span>${esc(m)}… <span class="note">${nv.job.feitas} de ${nv.job.total} páginas prontas</span>`};
  estNovo();let ok=0,erro=null;
  try{for(let i=0;i<pgs.length;i+=lote){const g=pgs.slice(i,i+lote);ok+=await lerGrupo(g,ctl,aviso);nv.job.feitas+=g.length}}
  catch(e){avisoIA(e);erro=e&&e.code==="cancelled"?"Leitura interrompida. As páginas já lidas foram mantidas.":sampleMsg(e)}
  nv.job=null;if(nv.edit&&ok)toast("As correções feitas à mão foram substituídas pela nova leitura.");
  montarSecoes();nv.edit=false;estNovo();
  toast(erro||(ok?`${ok} página${ok>1?"s":""} lida${ok>1?"s":""} com fórmulas e figuras.`:"O Claude não conseguiu ler essas páginas."))}

/* --- recorte manual de figura --- */
async function abrirRecorte(pg,chave){const nv=est.nv;if(!nv||!nv.pdf)return;const atual=chave&&nv.figs&&nv.figs[chave];
  const ov=document.createElement("div");ov.className="rc-ov";
  ov.innerHTML=`<div class="rc-box" role="dialog" aria-modal="true" aria-label="Recortar figura da página ${pg}">
    <div class="row" style="justify-content:space-between;align-items:baseline"><b>${chave?"Ajustar recorte":"Recortar figura"} · p. ${pg}</b><span class="note">Arraste sobre a figura.</span></div>
    <div class="rc-area"><span class="note"><span class="spin"></span>Preparando a página…</span></div>
    ${chave?"":`<div class="field"><label for="rcd">Legenda ou descrição</label><input id="rcd" placeholder="Ex.: Gráfico F × d do exercício resolvido"></div>`}
    <div class="row"><button class="btn primary" id="rcok" disabled>Guardar recorte</button><button class="btn" id="rcno">Cancelar</button></div></div>`;
  document.body.appendChild(ov);const fechar=()=>{ov.remove();document.removeEventListener("keydown",esc1)};const esc1=e=>{if(e.key==="Escape")fechar()};document.addEventListener("keydown",esc1);
  ov.querySelector("#rcno").onclick=fechar;ov.onclick=e=>{if(e.target===ov)fechar()};
  let c;try{c=await renderPagina(pg,Math.min(900,Math.max(320,window.innerWidth-64)))}catch(e){ov.querySelector(".rc-area").innerHTML='<p class="note">Não foi possível mostrar a página.</p>';return}
  const area=ov.querySelector(".rc-area");area.innerHTML="";c.className="rc-pg";area.appendChild(c);const sel=document.createElement("div");sel.className="rc-sel";sel.hidden=true;area.appendChild(sel);
  let bb=atual&&atual.bb?atual.bb.slice():null,ini=null;
  const desenha=()=>{if(!bb){sel.hidden=true;return}sel.hidden=false;const W=c.clientWidth,H=c.clientHeight;
    Object.assign(sel.style,{left:bb[0]*W+"px",top:bb[1]*H+"px",width:(bb[2]-bb[0])*W+"px",height:(bb[3]-bb[1])*H+"px"});ov.querySelector("#rcok").disabled=!(bb&&bb[2]-bb[0]>0.02&&bb[3]-bb[1]>0.02)};
  const pos=e=>{const r=c.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))]};
  c.onpointerdown=e=>{e.preventDefault();c.setPointerCapture(e.pointerId);ini=pos(e);bb=[ini[0],ini[1],ini[0],ini[1]];desenha()};
  c.onpointermove=e=>{if(!ini)return;const q=pos(e);bb=[Math.min(ini[0],q[0]),Math.min(ini[1],q[1]),Math.max(ini[0],q[0]),Math.max(ini[1],q[1])];desenha()};
  c.onpointerup=()=>{ini=null};desenha();
  ov.querySelector("#rcok").onclick=async()=>{const b=ov.querySelector("#rcok");b.disabled=true;b.innerHTML='<span class="spin"></span>Recortando…';
    try{const hi=await renderPagina(pg,1500),img=recortar(hi,bb,0);if(!img)throw 0;nv.figs=nv.figs||{};
      if(chave){nv.figs[chave]={img,pg,bb}}
      else{const k=novaChaveFig(pg),t=(ov.querySelector("#rcd").value||"").trim()||`Figura da página ${pg}`;nv.figs[k]={img,pg,bb};
        const pgo=nv.ext.pages[pg]=nv.ext.pages[pg]||{pars:[],notes:[]};pgo.pars.push({t,fig:k});
        if(nv.edit){let j=-1;nv.pars.forEach((p,i)=>{if(p.pg<=pg)j=i});nv.pars.splice(j+1,0,{t,pg,fig:k});nv.secs=seccionar(nv.pars,nv.notas)}else montarSecoes()}
      fechar();estNovo();toast("Recorte guardado.")}
    catch(e){b.disabled=false;b.textContent="Guardar recorte";toast("Não foi possível recortar. Marque uma área maior.")}}}
function tirarFigura(k){const nv=est.nv;for(const p of Object.keys(nv.ext.pages)){const o=nv.ext.pages[p];if(o&&o.pars)o.pars=o.pars.filter(x=>x.fig!==k)}
  nv.pars=nv.pars.filter(x=>x.fig!==k);if(nv.figs)delete nv.figs[k];nv.secs=seccionar(nv.pars,nv.notas);estNovo()}

/* --- páginas que ainda precisam da leitura por imagem --- */
function pendentesImg(nv){const ex=nv.ext||{},lidas=arr(ex.lidas);return [...new Set([...arr(ex.scanned),...arr(ex.formulas)])].filter(p=>!lidas.includes(p)).sort((a,b)=>a-b)}
const podeLerImg=nv=>!!(CAP.sample&&CAP.imgMax&&nv&&nv.pdf);
/* Em ciências a leitura por imagem é o caminho principal: começa sozinha depois da extração */
function autoLer(){const nv=est.nv;if(!nv||nv.autoFeito||!podeLerImg(nv))return;const pend=pendentesImg(nv);if(!pend.length)return;nv.autoFeito=true;lerPorImagem(pend)}

/* --- revisão do texto extraído (substitui a da LIO-E) --- */
function revisaoUI(head){const nv=est.nv,ex=nv.ext||{scanned:[],pages:{}},sc=arr(ex.scanned),lidas=arr(ex.lidas);
  nv.perfil=PERFIS[nv.perfil]?nv.perfil:perfilPadrao();
  const pend=pendentesImg(nv);
  const resto=[];if(nv.pdf)for(let p=nv.de;p<=nv.ate;p++)if(!lidas.includes(p)&&!pend.includes(p))resto.push(p);
  const nP=nv.pars.filter(p=>!p.h&&!p.fig).length,figs=nv.pars.filter(p=>p.fig);
  const podeImg=!!(CAP.sample&&CAP.imgMax&&nv.pdf),job=nv.job,lote=Math.max(1,Math.min(CAP.imgMax||1,3));
  const minutos=n=>Math.max(1,Math.round(Math.ceil(n/lote)*1.2));
  const painelImg=!nv.pdf?"":job?`<div class="panel"><div class="espera">${masc("m-espera")}<b>Lendo páginas com o Claude</b></div><p class="note" id="ost"><span class="spin"></span>${esc(job.msg||"Começando")}… ${job.feitas} de ${job.total} páginas prontas</p><div class="row"><button class="btn" id="ocrStop">Parar</button></div></div>`
    :pend.length?`<div class="panel destaque"><b>${pend.length} página${pend.length>1?"s":""} com fórmulas${sc.length?" ou sem texto legível":""} (p. ${faixas(pend)})</b>
      <p>Em livros de ciências, a extração de texto costuma estragar as fórmulas (índices, frações e símbolos se desmancham) e não traz as figuras. ${podeImg?`Recomendado: o Claude lê essas páginas como imagem, escreve as fórmulas de forma legível e recorta as figuras. Leva cerca de ${minutos(pend.length)} min, ${lote} página${lote>1?"s":""} por vez.`:"Nesta visualização não dá para ler páginas por imagem; o estudo seguirá com o texto extraído."}</p>
      ${podeImg?`<div class="row"><button class="btn primary" id="ocr">Ler ${pend.length} página${pend.length>1?"s":""} com o Claude</button>${resto.length?`<button class="btn" id="ocrAll">Ler todas as ${pend.length+resto.length} páginas</button>`:""}</div>`:""}</div>`
    :lidas.length?`<div class="panel"><b>${lidas.length} página${lidas.length>1?"s":""} lida${lidas.length>1?"s":""} por imagem</b><p class="note">Fórmulas e figuras dessas páginas foram transcritas pelo Claude. Confira algumas antes de salvar.${resto.length&&podeImg?"":""}</p>${resto.length&&podeImg?`<div class="row"><button class="btn small" id="ocrAll">Ler também as outras ${resto.length} páginas</button></div>`:""}</div>`:"";
  main.innerHTML=`${head}<p class="lead">${nv.texto?"Texto":`Páginas ${nv.de}–${nv.ate}`}: ${nP} parágrafos, ${figs.length} figura${figs.length===1?"":"s"}, ${nv.notas.length} notas de rodapé, ${nv.secs.length} ${nv.secs.length===1?"seção":"seções"}.</p>
  <div class="field" style="max-width:18rem"><label for="pf2">Disciplina</label><select id="pf2" ${job?"disabled":""}>${Object.entries(PERFIS).map(([k,v])=>`<option value="${k}"${nv.perfil===k?" selected":""}>${v}</option>`).join("")}</select></div>
  ${painelImg}
  ${nv.pdf&&!job?`<div class="stack"><h2>Figuras</h2>${figs.length?`<div class="figgrid">${figs.map(p=>{const f=(nv.figs||{})[p.fig];return `<div class="figcard">${f&&f.img?`<img src="${f.img}" alt="">`:'<div class="semimg-box">Sem recorte</div>'}<span class="note">p. ${p.pg} · ${esc(fecharTex(primeira(p.t).slice(0,90)))}</span><div class="row"><button class="btn small" data-aj="${esc(p.fig)}" data-pg="${p.pg}">${f&&f.img?"Ajustar":"Recortar"}</button><button class="btn small" data-tf="${esc(p.fig)}">Tirar</button></div></div>`}).join("")}</div>`:'<p class="note">Nenhuma figura ainda. Ao ler as páginas por imagem, o Claude recorta as figuras. Você também pode recortar à mão.</p>'}
    <div class="row"><label class="note" for="rcp">Recortar uma figura da página</label><input id="rcp" type="number" min="${nv.de}" max="${nv.ate}" value="${nv.de}" style="width:6rem"><button class="btn small" id="rcn">Recortar</button></div></div>`:""}
  ${nv.secs.length?`<div class="stack"><h2>Seções</h2>${nv.secs.map(s=>{const ps=s.pars.filter(p=>!p.h&&!p.fig),ch=ps.reduce((a,p)=>a+p.t.length,0),nf=s.pars.filter(p=>p.fig).length;
    return `<div class="studyrow"><div class="sr-main"><b>${s.n+1}. ${esc(s.titulo)}</b><span class="note">p. ${s.pgIni}–${s.pgFim} · ${ps.length} parágrafos${nf?` · ${nf} figura${nf>1?"s":""}`:""} · cerca de ${Math.max(1,Math.round(ch/700))} min</span><span class="note">${esc(fecharTex((ps[0]||{t:""}).t.slice(0,160)))}…</span></div></div>`}).join("")}</div>`:'<div class="hiddenbox">Nenhum texto foi extraído ainda.</div>'}
  <details id="rv"><summary>Revisar o texto extraído</summary>
   <p class="note">Corrija aqui o que a extração errou. Parágrafos são separados por uma linha em branco. ‹p.12› marca a página, ‹p.12›> marca uma citação recuada, ## marca um título e ‹fig:…› marca uma figura. Fórmulas ficam entre \\( e \\) (no texto) ou \\[ e \\] (em destaque), em LaTeX.</p>
   <div class="field"><label for="tx">Texto</label><textarea id="tx" style="min-height:22rem">${esc(toTxt(nv.pars))}</textarea></div>
   <div class="field"><label for="nt">Notas de rodapé</label><textarea id="nt">${esc(nv.notas.map(n=>`‹p.${n.pg}› ${n.t}`).join("\n\n"))}</textarea></div>
   <div class="row"><button class="btn" id="apl">Aplicar correções</button></div></details>
  <div class="row"><button class="btn primary" id="sv" ${nv.secs.length&&!job?"":"disabled"}>Salvar e começar a estudar</button><button class="btn" id="vt" ${job?"disabled":""}>${nv.texto?"Outro texto":"Mudar páginas"}</button></div><p class="note" id="st"></p>`;
  $("#pf2").onchange=e=>{nv.perfil=e.target.value;save("perfil",nv.perfil)};
  $("#vt").onclick=()=>{if(nv.texto){est.nv={};estNovo();return}nv.secs=null;nv.ext=null;nv.figs={};estNovo()};
  $("#apl").onclick=()=>{nv.pars=fromTxt($("#tx").value,nv.de);nv.notas=fromTxt($("#nt").value,nv.de).filter(n=>!n.h).map(n=>({t:n.t,pg:n.pg}));
    nv.secs=seccionar(nv.pars,nv.notas);nv.edit=true;toast("Correções aplicadas.");estNovo()};
  $("#sv").onclick=()=>{if(!pend.length||!podeImg||nv.semImgOk){salvarNovo();return}
    $("#st").innerHTML=`<span class="fb stack" style="display:flex"><b>${pend.length} página${pend.length>1?"s":""} com fórmulas não ${pend.length>1?"foram lidas":"foi lida"} pelo Claude.</b><span>Sem a leitura por imagem, as fórmulas dessas páginas ficam embaralhadas (como “v = _Δs m Δt”), as figuras não aparecem e boxes de duas colunas podem se misturar.</span>
      <span class="row"><button class="btn primary" id="svLer">Ler agora com o Claude</button><button class="btn" id="svAssim">Salvar assim mesmo</button></span></span>`;
    $("#svLer").onclick=()=>lerPorImagem(pend);$("#svAssim").onclick=()=>{nv.semImgOk=true;salvarNovo()}};
  const o=$("#ocr");if(o)o.onclick=()=>lerPorImagem(pend);
  const oa=$("#ocrAll");if(oa)oa.onclick=()=>lerPorImagem([...pend,...resto].sort((a,b)=>a-b));
  const os=$("#ocrStop");if(os)os.onclick=()=>{if(nv.job)nv.job.ctl.abort();os.disabled=true};
  main.querySelectorAll("[data-aj]").forEach(b=>b.onclick=()=>abrirRecorte(+b.dataset.pg,b.dataset.aj));
  main.querySelectorAll("[data-tf]").forEach(b=>b.onclick=()=>tirarFigura(b.dataset.tf));
  const rn=$("#rcn");if(rn)rn.onclick=()=>{const p=Math.max(nv.de,Math.min(nv.ate,parseInt($("#rcp").value)||nv.de));abrirRecorte(p,null)};
}
function faixas(ps){const out=[];let a=null,b=null;for(const p of ps){if(a===null){a=b=p;continue}if(p===b+1){b=p;continue}out.push(a===b?a:a+"–"+b);a=b=p}
  if(a!==null)out.push(a===b?a:a+"–"+b);return out.join(", ")}

/* --- apagar trechos inúteis da leitura --- */
const RX_AVISO=/Reprodu[çc][ãa]o proibida|Art\.?\s*184 do C[óo]digo Penal/i;
function ligarApagar(S,i,depois){const b=$("#apgP");if(!b)return;
  b.onclick=()=>{if(b.dataset.ok!=="1"){b.dataset.ok="1";b.textContent="Apagar mesmo? Toque de novo";b.classList.add("confirma");setTimeout(()=>{if(b.isConnected&&b.dataset.ok==="1"){b.dataset.ok="";b.textContent="Apagar este trecho";b.classList.remove("confirma")}},5000);return}
    S.pars[i].del=true;salvarSec(S,{pars:S.pars});logEv("apagar",{est:est.id,sec:S.n,i});toast("Trecho apagado. Dá para restaurar em “Ver a seção inteira”.");depois()}}
function blocoApagados(S){const n=S.pars.filter(p=>p.del).length;
  return n?`<div class="fb row" style="justify-content:space-between"><span>${n} trecho${n>1?"s":""} apagado${n>1?"s":""} desta seção.</span><button class="btn small" id="restP">Restaurar</button></div>`:""}
function ligarApagados(S,depois){const b=$("#restP");if(!b)return;b.onclick=()=>{S.pars.forEach(p=>{delete p.del});salvarSec(S,{pars:S.pars});toast("Trechos restaurados.");depois()}}

/* --- pedidos à IA da seção --- */
function trechoS(S){return S.pars.map((p,i)=>p.del?null:p.h?`## ${p.t}`:`[P${i+1}] (p. ${p.pg})${p.fig?" [FIGURA]":""}${p.q?" [citação recuada]":""} ${p.t}`).filter(x=>x!==null).join("\n\n")}
function promptSecaoS(S){const pf=perfilAtual();
  const ns=S.notas.length?"\n\nNOTAS DE RODAPÉ DO TRECHO:\n"+S.notas.map(n=>`(p. ${n.pg}) ${n.t}`).join("\n"):"";
  return `Você prepara exercícios de estudo ativo para um estudante de ${PERFIS[pf]} que estuda por um livro didático. Use SOMENTE o trecho abaixo. Nesta disciplina, dê atenção a: ${PERFIL_FOCO[pf]}. Escreva em português do Brasil, com frases curtas e diretas. ${LATEX_REGRA}

Responda apenas com um objeto JSON neste formato:
{"ideias":[{"p":1,"certa":"...","erradas":["...","..."]}],
 "formulas":[{"p":3,"latex":"E_c = \\\\frac{m v^2}{2}","nome":"...","simbolos":[{"s":"v","significa":"...","unidade":"m/s"}],"vale":"...","teste":{"pergunta":"...","certa":"...","erradas":["...","..."]}}],
 "figuras":[{"p":5,"perguntas":[{"pergunta":"...","certa":"...","erradas":["...","..."],"explica":"..."}]}],
 "deducao":[{"p":4,"titulo":"...","passos":["...","...","..."]}],
 "termos":[{"termo":"...","sentido":"...","p":2}]}

Regras:
- ideias: uma entrada para cada parágrafo [Pn] de texto (não [FIGURA]) com mais de 40 palavras. "certa" resume a ideia central em até 20 palavras. As duas "erradas" têm tamanho e tom parecidos com a certa e são plausíveis para quem leu mal (um detalhe tomado como central, uma relação invertida entre grandezas), mas são falsas ou secundárias para quem leu bem.
- formulas: de 0 a 6 fórmulas, equações, definições simbólicas ou equações químicas ESCRITAS no trecho; não invente outras. "latex" sem os delimitadores. "nome": como o trecho chama a fórmula, ou uma descrição curta. "simbolos": cada símbolo da fórmula, com o significado em palavras (sem LaTeX, até 8 palavras) e a unidade no SI ("" se não houver). "vale": quando a fórmula vale (hipóteses, condições, limites do modelo), em até 25 palavras; se o trecho não diz, use o padrão da disciplina e comece com "Em geral,". "teste": uma pergunta de múltipla escolha sobre o comportamento da fórmula (o que acontece com uma grandeza quando outra dobra, cai à metade ou muda de sinal) ou sobre quando usá-la, com duas "erradas" plausíveis.
- figuras: para cada parágrafo [FIGURA] com conteúdo (gráfico, diagrama, esquema, tabela), de 1 a 3 perguntas de múltipla escolha que exigem LER a figura (valores, inclinação, área sob a curva, sentido de setas, tendência, relação com o texto). "explica": por que a certa está certa, em até 30 palavras. Use só o que a descrição da figura e o texto permitem afirmar. Lista vazia se não houver [FIGURA].
- deducao: até 2 deduções, demonstrações ou exercícios resolvidos que ESTÃO no trecho, cada um em 3 a 7 passos na ordem correta, um passo por frase curta, com a conta em LaTeX quando houver, para o estudante reordenar. Lista vazia se não houver.
- termos: de 3 a 6 conceitos ou termos técnicos usados no trecho; "sentido" explica, em até 25 palavras, como ESTE texto usa o termo.
- "p" é sempre o número do parágrafo [Pn] de onde vem a informação.

TRECHO:
${trechoS(S)}${ns}`}
const strs=a=>arr(a).filter(str).map(x=>x.trim());
function validarS(g,S){g=g&&typeof g==="object"?g:{};
  const full=norm(S.pars.map(p=>p.t).join(" ")+" "+S.notas.map(n=>n.t).join(" "));
  const nP=S.pars.length,okP=p=>Number.isInteger(+p)&&+p>=1&&+p<=nP&&!S.pars[+p-1].h&&!S.pars[+p-1].del,okT=p=>okP(p)&&!S.pars[+p-1].fig,okF=p=>okP(p)&&!!S.pars[+p-1].fig;
  let desc=0;const conta=(a,b)=>{desc+=a.length-b.length;return b};
  const mc=x=>x&&str(x.pergunta)&&str(x.certa)&&strs(x.erradas).length>=2;
  const id0=arr(g.ideias);
  const ideias=conta(id0,id0.filter(x=>x&&okT(x.p)&&str(x.certa)&&strs(x.erradas).length>=2)).map(x=>({i:+x.p-1,ok:x.certa.trim(),no:strs(x.erradas).slice(0,2)}));
  const f0=arr(g.formulas);
  const formulas=conta(f0,f0.filter(x=>x&&okP(x.p)&&str(x.latex)&&arr(x.simbolos).some(y=>y&&str(y.s)&&str(y.significa)))).slice(0,6).map(x=>({
    p:+x.p-1,latex:x.latex.trim().replace(/^\\\(|\\\)$|^\\\[|\\\]$/g,"").trim(),nome:str(x.nome)?x.nome.trim():"Fórmula",
    simb:arr(x.simbolos).filter(y=>y&&str(y.s)&&str(y.significa)).slice(0,8).map(y=>({s:y.s.trim().replace(/^\\\(|\\\)$/g,""),m:y.significa.trim(),u:str(y.unidade)?y.unidade.trim():""})),
    vale:str(x.vale)?x.vale.trim():"",teste:mc(x.teste)?{q:x.teste.pergunta.trim(),ok:x.teste.certa.trim(),no:strs(x.teste.erradas).slice(0,2)}:null}));
  const g0=arr(g.figuras);
  const figuras=conta(g0,g0.filter(x=>x&&okF(x.p)&&arr(x.perguntas).some(mc))).map(x=>({p:+x.p-1,
    q:arr(x.perguntas).filter(mc).slice(0,3).map(y=>({q:y.pergunta.trim(),ok:y.certa.trim(),no:strs(y.erradas).slice(0,2),ex:str(y.explica)?y.explica.trim():""}))}));
  const d0=arr(g.deducao);
  const deducao=conta(d0,d0.filter(x=>x&&okP(x.p)&&strs(x.passos).length>=3)).slice(0,2).map(x=>({p:+x.p-1,titulo:str(x.titulo)?x.titulo.trim():"Dedução",passos:strs(x.passos).slice(0,8)}));
  const t0=arr(g.termos);
  const termos=conta(t0,t0.filter(x=>x&&str(x.termo)&&str(x.sentido)&&full.includes(norm(x.termo)))).map(x=>({termo:x.termo.trim(),sentido:x.sentido.trim(),p:okP(x.p)?+x.p-1:null}));
  return {ideias,lab:[],vozes:null,arg:null,crono:[],termos,formulas,figuras,deducao,desc,quando:agora()}}

/* --- Mapa: fórmulas da seção --- */
function mapaFormulas(S){const F=S.gen?arr(S.gen.formulas).filter((x,k)=>!sinal(S,"f"+k)):[],nf=S.pars.filter(p=>p.fig).length;
  if(!F.length&&!nf)return "";
  return `<div class="stack">${F.length?`<h2>Fórmulas desta seção</h2><ul class="skel formulas">${F.map(x=>`<li><span class="pgref">p. ${S.pars[x.p].pg}</span><b>${esc(x.nome)}:</b> \\(\\displaystyle ${esc(x.latex)}\\)</li>`).join("")}</ul>`:""}
    ${nf?`<p class="note">${nf} figura${nf>1?"s":""} nesta seção. Elas aparecem na leitura, junto da página, e têm uma etapa própria.</p>`:""}</div>`}

/* --- etapa: Fórmulas --- */
function pFormulas(S,el){const F=S.gen.formulas.map((x,k)=>({...x,k})).filter(x=>!sinal(S,"f"+x.k));
  if(!est.fo)est.fo={i:0,ph:"simb",esc:{},c:0,t:0};const st=est.fo;
  if(st.i>=F.length){S.resp.formulas={c:st.c,t:st.t};salvarResp(S);
    el.innerHTML=`<div class="fb">${st.t?`Você acertou ${st.c} de ${st.t} itens nas fórmulas desta seção.`:"Nenhuma fórmula restante."}</div>
    <p class="note">Cada fórmula virou uma ficha na revisão espaçada: daqui a alguns dias ela volta para você escrever de memória.</p>
    <div class="stack">${F.map(x=>fichaFormula(S,x)).join("")}</div>
    <div class="row"><button class="btn primary" id="nx">Próxima etapa</button><button class="btn" id="re">Treinar de novo</button></div>`;
    $("#nx").onclick=()=>proximoPasso(S);$("#re").onclick=()=>{est.fo=null;pFormulas(S,el)};ligarSim(S,el);return}
  const X=F[st.i],cab=`${stepsBar(F.length,st.i)}<div class="passage formula"><span class="label">Fórmula ${st.i+1} de ${F.length} · p. ${S.pars[X.p].pg}</span><div class="eq">\\[${esc(X.latex)}\\]</div></div>`;
  if(st.ph==="simb"||st.ph==="simbok"){
    const outras=F.filter(y=>y.k!==X.k).flatMap(y=>y.simb.map(z=>z.m)),sig=[...new Set([...X.simb.map(z=>z.m),...shuffle(outras).slice(0,2)])];
    if(!st.ops||st.ops.k!==X.k)st.ops={k:X.k,l:shuffle(sig)};
    const feito=st.ph==="simbok";
    el.innerHTML=`${cab}<p class="q">O que significa cada símbolo?</p><div class="simbs">${X.simb.map((z,j)=>{const v=st.esc[j]||"",ok=feito&&norm(v)===norm(z.m);
      return `<div class="simb${feito?(ok?" right":" wrong"):""}"><span class="sv">\\(${esc(z.s)}\\)</span>${feito?`<span>${ok?"✓ ":"✗ "}${esc(z.m)}${z.u?` <span class="un">· unidade: ${esc(z.u)}</span>`:""}${!ok&&v?`<span class="note"> (você: ${esc(v)})</span>`:""}</span>`
        :`<select data-s="${j}" aria-label="Significado do símbolo ${esc(z.s)}"><option value="">Escolha…</option>${st.ops.l.map(m=>`<option${v===m?" selected":""}>${esc(m)}</option>`).join("")}</select>`}</div>`}).join("")}</div>
      <div class="row">${feito?'<button class="btn primary" id="cont">Continuar</button>':`<button class="btn primary" id="chk" ${X.simb.every((z,j)=>st.esc[j])?"":"disabled"}>Conferir</button>`}</div>`;
    el.querySelectorAll("[data-s]").forEach(s=>s.onchange=()=>{st.esc[+s.dataset.s]=s.value;$("#chk").disabled=!X.simb.every((z,j)=>st.esc[j])});
    if($("#chk"))$("#chk").onclick=()=>{const c=X.simb.filter((z,j)=>norm(st.esc[j])===norm(z.m)).length;st.c+=c;st.t+=X.simb.length;st.ph="simbok";
      logEv("formula",{est:est.id,sec:S.n,k:X.k,c,tt:X.simb.length});pFormulas(S,el)};
    if($("#cont"))$("#cont").onclick=()=>{st.ph=X.teste?"teste":"vale";pFormulas(S,el)};return}
  if(st.ph==="teste"){const T=X.teste,list=shuffle([T.ok,...T.no]).map(esc);
    el.innerHTML=`${cab}<p class="q">${esc(T.q)}</p>${optsHTML(list)}<div id="fb" aria-live="polite"></div>`;
    bindOpts(list,esc(T.ok),right=>{st.t++;if(right)st.c++;$("#fb").innerHTML=`<div class="fb"><b class="${right?"ok":"bad"}">${right?"Isso.":"Não era essa."}</b></div><div class="row"><button class="btn primary" id="cont">Continuar</button></div>`;
      $("#cont").onclick=()=>{st.ph="vale";pFormulas(S,el)}});return}
  el.innerHTML=`${stepsBar(F.length,st.i)}${fichaFormula(S,X)}<div class="row"><button class="btn primary" id="nx">${st.i+1<F.length?"Próxima fórmula":"Ver o resumo"}</button></div>${botaoSinal("f"+X.k)}`;
  $("#nx").onclick=()=>{st.i++;st.ph="simb";st.esc={};pFormulas(S,el);window.scrollTo(0,0)};
  ligarSinal(S,el,()=>{st.i++;st.ph="simb";st.esc={};pFormulas(S,el)});ligarSim(S,el)}
function fichaFormula(S,X){return `<div class="ficha"><span class="eyebrow">${esc(X.nome)} · p. ${S.pars[X.p].pg}</span><div class="eq">\\[${esc(X.latex)}\\]</div>
  <table class="tabsimb"><tbody>${X.simb.map(z=>`<tr><td class="sv">\\(${esc(z.s)}\\)</td><td>${esc(z.m)}</td><td class="un">${esc(z.u)}</td></tr>`).join("")}</tbody></table>
  ${X.vale?`<p><b>Quando vale:</b> ${esc(X.vale)}</p>`:""}
  ${X.k!=null&&(CAP.sample||X.sim)&&!(X.sim&&X.sim.no)?`<div class="row"><button class="btn small" data-sim="${X.k}">Brincar com a fórmula</button></div>`:""}<div class="simbox" id="sim_${X.k}"></div></div>`}

/* --- Simulador da fórmula: controles deslizantes, resultado e gráfico --- */
/* A IA descreve a fórmula (variáveis, faixas, expressão); a página calcula com um avaliador próprio e nunca executa código vindo da IA. */
const SIM_FUN={sqrt:Math.sqrt,raiz:Math.sqrt,abs:Math.abs,exp:Math.exp,ln:Math.log,log:Math.log10,
  sen:x=>Math.sin(x*Math.PI/180),sin:x=>Math.sin(x*Math.PI/180),cos:x=>Math.cos(x*Math.PI/180),tan:x=>Math.tan(x*Math.PI/180),tg:x=>Math.tan(x*Math.PI/180)};
function compilarExpr(src,ids){const t=String(src).replace(/\*\*/g,"^").replace(/·|×/g,"*").replace(/−/g,"-").match(/\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z0-9_]*|[-+*/^(),]|\S/g)||[];
  let i=0;const pk=()=>t[i],nx=()=>t[i++],need=c=>{if(nx()!==c)throw new Error("esperava "+c)};
  const E=()=>{let a=T();while(pk()==="+"||pk()==="-"){const o=nx(),b=T(),x=a;a=o==="+"?v=>x(v)+b(v):v=>x(v)-b(v)}return a};
  const T=()=>{let a=U();while(pk()==="*"||pk()==="/"){const o=nx(),b=U(),x=a;a=o==="*"?v=>x(v)*b(v):v=>x(v)/b(v)}return a};
  const U=()=>{if(pk()==="-"){nx();const a=U();return v=>-a(v)}if(pk()==="+"){nx();return U()}return P()};
  const P=()=>{const a=A();if(pk()==="^"){nx();const b=U();return v=>Math.pow(a(v),b(v))}return a};
  const A=()=>{const k=nx();if(k===undefined)throw new Error("fim inesperado");
    if(/^\d/.test(k)){const n=+k;return ()=>n}
    if(k==="("){const a=E();need(")");return a}
    if(/^[A-Za-z_]/.test(k)){if(pk()==="("){const f=SIM_FUN[k];if(!f)throw new Error("função "+k);nx();const a=E();need(")");return v=>f(a(v))}
      if(k==="pi")return ()=>Math.PI;if(!ids.includes(k))throw new Error("variável "+k);return v=>v[k]}
    throw new Error("símbolo "+k)};
  const f=E();if(i<t.length)throw new Error("sobrou "+t[i]);return f}
function promptSim(X){const pf=perfilAtual();
  return `Você prepara um simulador interativo para uma fórmula de um livro de ${PERFIS[pf]}. O estudante vai mexer em controles deslizantes e ver o resultado e um gráfico mudarem.
Se a fórmula não puder ser calculada assim (vetores sem módulo, derivadas, integrais, somatórios, equações químicas, desigualdades, definições sem cálculo), responda apenas {"simulavel":false,"motivo":"..."}.
Senão, escolha uma grandeza como saída e escreva a expressão dela em função das outras. Em Matemática, para funções, a saída é y = f(x), e os coeficientes (a, b, c...) também são variáveis com controle.
Expressão: só números com ponto decimal, os ids das variáveis e constantes, + - * / ^ e parênteses, e as funções sqrt, abs, exp, ln, log, sen, cos, tan (ângulos em graus). Multiplicação sempre explícita com *.

Responda apenas com JSON neste formato:
{"simulavel":true,"saida":{"s":"E_C","nome":"energia cinética","unidade":"J"},"expr":"m*v^2/2",
 "variaveis":[{"id":"m","s":"m","nome":"massa","unidade":"kg","min":0.5,"max":100,"valor":10,"passo":0.5}],
 "constantes":[{"id":"g","s":"g","nome":"aceleração da gravidade","unidade":"m/s²","valor":9.8}],
 "eixo":"v",
 "previsao":{"pergunta":"Se a velocidade dobrar, a energia cinética...","opcoes":["dobra","fica 4 vezes maior","não muda"],"certa":1,"explica":"..."}}

- "id": curto, sem acento, só letras minúsculas, números e _ (m, v, v0, theta, a, b, c, x). "s": o símbolo em LaTeX, sem delimitadores.
- De 1 a 5 variáveis, com faixas realistas para o contexto do livro (valores positivos onde só faz sentido positivo), "valor" dentro da faixa e "passo" adequado.
- "eixo": o id da variável mais interessante para o gráfico.
- "previsao": uma pergunta para o estudante prever o efeito de mudar uma variável, antes de mexer; três opções; "certa" é o índice (0 a 2); "explica" em até 30 palavras, sem LaTeX.

FÓRMULA: ${X.latex}
NOME: ${X.nome}
SÍMBOLOS: ${X.simb.map(z=>z.s+" = "+z.m+(z.u?" ("+z.u+")":"")).join("; ")}
QUANDO VALE: ${X.vale||"-"}`}
function validarSim(g){if(!g||typeof g!=="object")return null;if(g.simulavel===false)return {no:true,motivo:str(g.motivo)?g.motivo.trim():""};
  const okId=x=>typeof x==="string"&&/^[a-z_][a-z0-9_]{0,15}$/.test(x);
  const vs=arr(g.variaveis).filter(v=>v&&okId(v.id)&&isFinite(+v.min)&&isFinite(+v.max)&&+v.max>+v.min).slice(0,5).map(v=>{const mn=+v.min,mx=+v.max,ps=isFinite(+v.passo)&&+v.passo>0?+v.passo:(mx-mn)/100;
    return {id:v.id,s:str(v.s)?v.s.trim():v.id,nome:str(v.nome)?v.nome.trim():v.id,u:str(v.unidade)?v.unidade.trim():"",min:mn,max:mx,passo:ps,valor:Math.min(mx,Math.max(mn,isFinite(+v.valor)?+v.valor:(mn+mx)/2))}});
  const cs=arr(g.constantes).filter(c=>c&&okId(c.id)&&isFinite(+c.valor)).map(c=>({id:c.id,s:str(c.s)?c.s.trim():c.id,nome:str(c.nome)?c.nome.trim():c.id,u:str(c.unidade)?c.unidade.trim():"",valor:+c.valor}));
  if(!vs.length||!str(g.expr)||!g.saida||!str(g.saida.s))return null;
  const ids=[...vs.map(v=>v.id),...cs.map(c=>c.id)];if(new Set(ids).size!==ids.length)return null;
  let f;try{f=compilarExpr(g.expr,ids)}catch(e){return null}
  const env=Object.fromEntries([...vs.map(v=>[v.id,v.valor]),...cs.map(c=>[c.id,c.valor])]);if(!isFinite(f(env)))return null;
  const pv=g.previsao,prev=pv&&str(pv.pergunta)&&strs(pv.opcoes).length===3&&[0,1,2].includes(+pv.certa)?{q:pv.pergunta.trim(),ops:strs(pv.opcoes),ok:+pv.certa,ex:str(pv.explica)?pv.explica.trim():""}:null;
  return {saida:{s:g.saida.s.trim(),nome:str(g.saida.nome)?g.saida.nome.trim():"resultado",u:str(g.saida.unidade)?g.saida.unidade.trim():""},expr:String(g.expr),vs,cs,
    eixo:vs.some(v=>v.id===g.eixo)?g.eixo:vs[0].id,prev}}
const fmtN=x=>{if(!isFinite(x))return "—";const a=Math.abs(x);if(a!==0&&(a>=1e6||a<1e-3))return x.toExponential(2).replace(".",",").replace("e+"," × 10^").replace("e-"," × 10^-");
  return x.toLocaleString("pt-BR",{maximumSignificantDigits:4})};
function niceTicks(a,b,n){if(!(b>a)){b=a+1}const st0=(b-a)/n,p=Math.pow(10,Math.floor(Math.log10(st0))),m=st0/p,st=(m<1.5?1:m<3?2:m<7?5:10)*p;
  const out=[];for(let v=Math.ceil(a/st)*st;v<=b+st*1e-9;v+=st)out.push(+v.toPrecision(12));return out}
function graficoSim(Sm,f,val){const V=Sm.vs.find(v=>v.id===Sm.eixo),W=560,H=250,ml=72,mr=14,mt=12,mb=40,N=120,pts=[];
  for(let j=0;j<=N;j++){const x=V.min+(V.max-V.min)*j/N,env={...val,[V.id]:x},y=f(env);pts.push([x,isFinite(y)?y:null])}
  const ys=pts.map(p=>p[1]).filter(y=>y!==null);if(!ys.length)return '<p class="note">Sem pontos para desenhar nesta faixa.</p>';
  let y0=Math.min(...ys),y1=Math.max(...ys);if(y0>0&&y0<(y1-y0)*0.6)y0=0;if(y1<0&&-y1<(y1-y0)*0.6)y1=0;if(y1-y0<1e-12){y0-=1;y1+=1}
  const pad=(y1-y0)*0.06;y0-=y0===0?0:pad;y1+=pad;
  const X=x=>ml+(x-V.min)/(V.max-V.min)*(W-ml-mr),Y=y=>mt+(1-(y-y0)/(y1-y0))*(H-mt-mb);
  let d="",pen=false;for(const [x,y] of pts){if(y===null||y<y0-1e9||y>y1+1e9){pen=false;continue}d+=(pen?"L":"M")+X(x).toFixed(1)+" "+Y(y).toFixed(1);pen=true}
  const yt=niceTicks(y0,y1,4),xt=niceTicks(V.min,V.max,5),cx=val[V.id],cy=f(val);
  return `<svg class="simgraf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de ${esc(Sm.saida.nome)} em função de ${esc(V.nome)}">
    ${yt.map(t=>`<line x1="${ml}" x2="${W-mr}" y1="${Y(t)}" y2="${Y(t)}" class="gl"/><text x="${ml-6}" y="${Y(t)+4}" text-anchor="end">${fmtN(t)}</text>`).join("")}
    ${xt.map(t=>`<text x="${X(t)}" y="${H-mb+16}" text-anchor="middle">${fmtN(t)}</text>`).join("")}
    ${y0<0&&y1>0?`<line x1="${ml}" x2="${W-mr}" y1="${Y(0)}" y2="${Y(0)}" class="zero"/>`:""}
    <line x1="${ml}" x2="${ml}" y1="${mt}" y2="${H-mb}" class="ax"/><line x1="${ml}" x2="${W-mr}" y1="${H-mb}" y2="${H-mb}" class="ax"/>
    <path d="${d}" class="curva"/>${isFinite(cy)&&cy>=y0&&cy<=y1?`<line x1="${X(cx)}" x2="${X(cx)}" y1="${H-mb}" y2="${Y(cy)}" class="guia"/><circle cx="${X(cx)}" cy="${Y(cy)}" r="5.5" class="ponto"/>`:""}
    <text transform="translate(13 ${(mt+H-mb)/2}) rotate(-90)" text-anchor="middle" class="tit">${esc(Sm.saida.nome)}${Sm.saida.u?" ("+esc(Sm.saida.u)+")":""}</text>
    <text x="${(ml+W-mr)/2}" y="${H-6}" text-anchor="middle" class="tit">${esc(V.nome)}${V.u?" ("+esc(V.u)+")":""}</text>
  </svg>`}
async function abrirSim(S,k,box){const X=S.gen.formulas[k];if(!X)return;
  if(!X.sim){if(!CAP.sample)return;box.innerHTML='<p class="note"><span class="spin"></span>O Claude está montando o simulador…</p>';
    try{const g=await CAP.sample.json(promptSim(X),{cache:false});const v=validarSim(g);if(!v)throw {code:"sim"};X.sim=v;salvarSec(S,{gen:S.gen});logEv("simulador",{est:est.id,sec:S.n,k,ok:!v.no})}
    catch(e){avisoIA(e);box.innerHTML=`<p class="note" style="color:var(--bad)">${e&&e.code==="sim"?"O Claude não conseguiu montar um simulador válido para esta fórmula. Tente de novo.":esc(sampleMsg(e))}</p>`;return}}
  const Sm=X.sim;if(Sm.no){box.innerHTML=`<p class="note">Esta fórmula não dá para simular com controles deslizantes${Sm.motivo?": "+esc(Sm.motivo):"."}</p>`;return}
  const f=compilarExpr(Sm.expr,[...Sm.vs.map(v=>v.id),...Sm.cs.map(c=>c.id)]);
  const val=Object.fromEntries([...Sm.vs.map(v=>[v.id,v.valor]),...Sm.cs.map(c=>[c.id,c.valor])]);
  const R=S.resp;R.sim=R.sim||{};const feitoPrev=()=>!Sm.prev||R.sim[k]!=null;
  const desenhar=()=>{const y=f(val),V=Sm.vs.find(v=>v.id===Sm.eixo);
    box.innerHTML=`<div class="sim stack">
      ${Sm.prev&&!feitoPrev()?`<div class="fb stack"><b>Antes de mexer, preveja:</b> <span>${esc(Sm.prev.q)}</span><div class="row">${Sm.prev.ops.map((o,j)=>`<button class="btn small" data-pv="${j}">${esc(o)}</button>`).join("")}</div></div>`
        :Sm.prev?`<div class="fb"><b class="${R.sim[k]===Sm.prev.ok?"ok":"bad"}">${R.sim[k]===Sm.prev.ok?"Sua previsão estava certa.":"Sua previsão não se confirmou."}</b> ${esc(Sm.prev.ex)} <span class="note">Confira mexendo nos controles.</span></div>`:""}
      <div class="simres"><span class="note">${esc(Sm.saida.nome)}</span><b>\\(${esc(Sm.saida.s)}\\) = <span class="simout">${fmtN(y)}${Sm.saida.u?" "+esc(Sm.saida.u):""}</span></b></div>
      <div class="simctl">${Sm.vs.map(v=>`<label class="sl"><span class="slt">\\(${esc(v.s)}\\) · ${esc(v.nome)}<b>${fmtN(val[v.id])}${v.u?" "+esc(v.u):""}</b></span>
        <input type="range" min="${v.min}" max="${v.max}" step="${v.passo}" value="${val[v.id]}" data-v="${v.id}" ${feitoPrev()?"":"disabled"} aria-label="${esc(v.nome)}"></label>`).join("")}</div>
      ${Sm.cs.length?`<p class="note">Constante${Sm.cs.length>1?"s":""}: ${Sm.cs.map(c=>`\\(${esc(c.s)}\\) = ${fmtN(c.valor)}${c.u?" "+esc(c.u):""}`).join(" · ")}</p>`:""}
      <div class="row"><label class="note" for="eix_${k}">Gráfico em função de</label><select id="eix_${k}">${Sm.vs.map(v=>`<option value="${v.id}"${v.id===Sm.eixo?" selected":""}>${esc(v.nome)}</option>`).join("")}</select></div>
      <div class="simg">${graficoSim(Sm,f,val)}</div>
      <p class="note">${esc(Sm.saida.nome)} (vertical) em função de ${esc(V.nome)} (horizontal), com as outras grandezas fixas nos valores dos controles. O ponto é o valor atual.</p></div>`;
    box.querySelectorAll("[data-pv]").forEach(b=>b.onclick=()=>{R.sim[k]=+b.dataset.pv;salvarResp(S);logEv("sim_previsao",{est:est.id,sec:S.n,k,certo:+b.dataset.pv===Sm.prev.ok});desenhar()});
    box.querySelectorAll("[data-v]").forEach(r=>r.oninput=()=>{val[r.dataset.v]=+r.value;atualizar()});
    box.querySelector(`#eix_${k}`).onchange=e=>{Sm.eixo=e.target.value;desenhar()}};
  const atualizar=()=>{const y=f(val);box.querySelector(".simout").textContent=fmtN(y)+(Sm.saida.u?" "+Sm.saida.u:"");
    box.querySelectorAll(".sl").forEach(l=>{const id=l.querySelector("input").dataset.v,v=Sm.vs.find(x=>x.id===id);l.querySelector(".slt b").textContent=fmtN(val[id])+(v.u?" "+v.u:"")});
    box.querySelector(".simg").innerHTML=graficoSim(Sm,f,val)};
  desenhar()}
function ligarSim(S,el){el.querySelectorAll("[data-sim]").forEach(b=>b.onclick=()=>{const k=+b.dataset.sim,box=el.querySelector("#sim_"+k);if(!box)return;b.disabled=true;abrirSim(S,k,box)})}

/* --- etapa: Figuras --- */
function pFiguras(S,el){const L=[];S.gen.figuras.forEach((f,k)=>{if(!S.pars[f.p]||!S.pars[f.p].fig)return;f.q.forEach((q,j)=>{if(!sinal(S,`g${k}_${j}`))L.push({...q,k,j,p:f.p})})});
  if(!est.fg)est.fg={i:0,c:0,t:0};const st=est.fg;
  if(st.i>=L.length){S.resp.figuras={c:st.c,t:st.t};salvarResp(S);
    el.innerHTML=`<div class="fb">${st.t?`Você acertou ${st.c} de ${st.t} perguntas sobre as figuras.`:"Nenhuma pergunta restante."} Ao estudar, leia a figura antes do texto que a explica: eixos, unidades e o que muda.</div>
    <div class="row"><button class="btn primary" id="nx">Próxima etapa</button><button class="btn" id="re">Treinar de novo</button></div>`;
    $("#nx").onclick=()=>proximoPasso(S);$("#re").onclick=()=>{est.fg=null;pFiguras(S,el)};return}
  const X=L[st.i],P=S.pars[X.p],list=shuffle([X.ok,...X.no]).map(esc);
  el.innerHTML=`${stepsBar(L.length,st.i)}<div class="figtreino">${figHTML(P.fig,null)}<details><summary>Ver a descrição da figura (p. ${P.pg})</summary><p class="note-t">${esc(P.t)}</p></details></div>
    <p class="q">${esc(X.q)}</p>${optsHTML(list)}<div id="fb" aria-live="polite"></div>`;
  bindOpts(list,esc(X.ok),right=>{st.t++;if(right)st.c++;logEv("figura",{est:est.id,sec:S.n,k:X.k,j:X.j,certo:right});
    $("#fb").innerHTML=`<div class="stack"><div class="fb"><b class="${right?"ok":"bad"}">${right?"Isso.":"Não era essa."}</b> ${esc(X.ex)}</div>
      <div class="row"><button class="btn primary" id="nx">${st.i+1<L.length?"Próxima pergunta":"Ver o resultado"}</button></div>${botaoSinal(`g${X.k}_${X.j}`)}</div>`;
    $("#nx").onclick=()=>{st.i++;pFiguras(S,el);window.scrollTo(0,0)};ligarSinal(S,el,()=>{st.i++;pFiguras(S,el)})})}

/* --- etapa: Passo a passo (deduções e exemplos resolvidos) --- */
function pDeducao(S,el){const D=S.gen.deducao.map((x,k)=>({...x,k})).filter(x=>!sinal(S,"d"+x.k));
  if(!est.dd)est.dd={i:0,ord:null,ok:false,c:0,t:0};const st=est.dd;
  if(st.i>=D.length){S.resp.deducao={c:st.c,t:st.t};salvarResp(S);
    el.innerHTML=`<div class="fb">${st.t?`${st.c} de ${st.t} passos na posição certa.`:"Nenhuma dedução restante."} Numa dedução, cada passo precisa de um motivo: uma lei, uma definição ou uma conta do passo anterior.</div>
    <div class="row"><button class="btn primary" id="nx">Próxima etapa</button><button class="btn" id="re">Treinar de novo</button></div>`;
    $("#nx").onclick=()=>proximoPasso(S);$("#re").onclick=()=>{est.dd=null;pDeducao(S,el)};return}
  const X=D[st.i];
  if(!st.ord){let o;do{o=shuffle(X.passos.map((_,j)=>j))}while(o.every((v,j)=>v===j)&&X.passos.length>1);st.ord=o}
  el.innerHTML=`${stepsBar(D.length,st.i)}<p class="lead">${st.ok?"Resultado":"Os passos estão embaralhados. Ponha na ordem certa."}</p><h2>${esc(X.titulo)} <span class="pgref">p. ${S.pars[X.p].pg}</span></h2>
    <ol class="orderlist" id="ol"></ol>
    ${st.ok?`<details><summary>Ver o trecho do livro</summary><p class="note-t">${esc(S.pars[X.p].t)}</p></details><div class="row"><button class="btn primary" id="nx">${st.i+1<D.length?"Próxima":"Ver o resultado"}</button></div>${botaoSinal("d"+X.k)}`
      :'<div class="row"><button class="btn primary" id="chk">Conferir</button><button class="btn small" id="dica">Dica: qual é o primeiro passo?</button></div><div id="dfb"></div>'}`;
  orderList($("#ol"),st.ord,j=>esc(X.passos[j]),st.ok);
  if($("#chk"))$("#chk").onclick=()=>{const c=st.ord.filter((v,pos)=>v===pos).length;st.c+=c;st.t+=X.passos.length;st.ok=true;
    logEv("deducao",{est:est.id,sec:S.n,k:X.k,c,tt:X.passos.length});pDeducao(S,el)};
  if($("#dica"))$("#dica").onclick=()=>{$("#dfb").innerHTML=`<div class="fb">O primeiro passo é: ${esc(X.passos[0])}</div>`};
  if($("#nx"))$("#nx").onclick=()=>{st.i++;st.ord=null;st.ok=false;pDeducao(S,el);window.scrollTo(0,0)};
  ligarSinal(S,el,()=>{st.i++;st.ord=null;st.ok=false;pDeducao(S,el)})}

/* --- etapa: Resolver junto --- */
const resumoQ=t=>{const s=String(t||"").replace(/\s+/g," ").trim();return s.length>110?fecharTex(s.slice(0,110))+"…":s};
const dicasUsadas=x=>arr(x.et).reduce((s,e)=>s+(e&&e.dicas||0),0);
function indiceResolver(R){let c=0,t=0;for(const x of arr(R.resolv)){if(!x||!x.fim)continue;
  if(x.direta&&x.direta.av==="certa"){const n=x.plano.etapas.length;c+=n;t+=n;continue}
  for(const e of arr(x.et)){if(!e)continue;t++;if(e.av==="certa"&&!e.viu)c+=e.dicas?0.5:1}}return {c,t}}
function promptPlano(S,enun,img){const pf=perfilAtual();
  return `Você é um tutor de ${PERFIS[pf]}. Um estudante quer resolver a questão abaixo com ajuda, sem receber a resposta pronta. ${img?"A questão está na imagem anexada; transcreva-a em \"enunciado\".":""}
Use o TRECHO do livro que ele estuda como base teórica. Se a questão precisar de algo que não está no trecho, use o conhecimento padrão da disciplina e diga o que foi em "fora_do_trecho".

Divida a resolução em 3 a 6 etapas pequenas, na ordem em que um bom estudante pensaria. Em geral: identificar os dados e o que se pede (com unidades); escolher a lei, definição ou propriedade; montar a equação; resolver; dar a resposta com unidade. Adapte ao tipo de questão (questões conceituais têm etapas de raciocínio, não de conta).
Para cada etapa: "pergunta" é o que o tutor pergunta ao estudante, curta e sem entregar a resposta; "esperado" é a resposta correta da etapa; "dicas" são três dicas graduais: a primeira só aponta a direção, a segunda é mais específica, a terceira quase entrega a etapa, sem entregá-la inteira.
${LATEX_REGRA}

Responda apenas com JSON neste formato:
{"enunciado":"...","pede":"...","etapas":[{"titulo":"Dados","pergunta":"...","esperado":"...","dicas":["...","...","..."]}],"resposta":"...","conferir":{"unidade":"...","ordem":"...","limite":"..."},"p":3,"fora_do_trecho":""}

- "pede": o que a questão pede, em uma frase.
- "resposta": a resposta final, com unidade.
- "conferir": como o estudante pode verificar a resposta. "unidade": por que a unidade faz sentido. "ordem": se o valor é razoável (ordem de grandeza, comparação com algo do cotidiano). "limite": um caso limite ou teste rápido (o que acontece se uma grandeza for zero ou muito grande; substituir a solução na equação). Use "" quando não se aplicar.
- "p": número do parágrafo [Pn] do trecho que dá a base teórica, ou 0.

QUESTÃO:
${enun||"(na imagem anexada)"}

TRECHO:
${trechoS(S)}`}
function validarPlano(g,S){if(!g||typeof g!=="object")return null;
  const et=arr(g.etapas).filter(x=>x&&str(x.pergunta)&&str(x.esperado)).slice(0,7).map(x=>({titulo:str(x.titulo)?x.titulo.trim():"Etapa",q:x.pergunta.trim(),esp:x.esperado.trim(),dicas:strs(x.dicas).slice(0,3)}));
  if(et.length<2)return null;const c=g.conferir||{},nP=S.pars.length,p=+g.p;
  return {enun:str(g.enunciado)?g.enunciado.trim():"",pede:str(g.pede)?g.pede.trim():"",etapas:et,resp:str(g.resposta)?g.resposta.trim():"",
    conf:{unidade:str(c.unidade)?c.unidade.trim():"",ordem:str(c.ordem)?c.ordem.trim():"",limite:str(c.limite)?c.limite.trim():""},
    p:Number.isInteger(p)&&p>=1&&p<=nP&&!S.pars[p-1].h?p-1:null,fora:str(g.fora_do_trecho)?g.fora_do_trecho.trim():""}}
function promptEtapa(x,k,resp){const P=x.plano,E=P.etapas[k];
  return `Você confere uma etapa da resolução de uma questão de ${PERFIS[perfilAtual()]}, feita por um estudante. Seja justo e tolerante com notação (como v^2, x2 para x ao quadrado, raiz de 2) e com arredondamentos; aceite caminhos diferentes, se estiverem corretos. Não entregue a resposta esperada se a do estudante não estiver certa.

QUESTÃO: ${P.enun||x.enun}
ETAPA ${k+1} (${E.titulo}): ${E.q}
RESPOSTA ESPERADA (para você, não mostre): ${E.esp}
RESPOSTA DO ESTUDANTE: ${resp}

Responda apenas com JSON:
{"avaliacao":"certa","retorno":"...","erro":"nenhum"}
- "avaliacao": "certa", "parcial" ou "errada".
- "retorno": uma ou duas frases para o estudante: o que está certo e, se não estiver certa, onde olhar, sem dar a resposta. ${LATEX_REGRA}
- "erro": o tipo principal do erro: "unidade", "sinal", "conta", "conceito", "leitura" (leu mal o enunciado), "incompleta" ou "nenhum".`}
const AVE={certa:["ok","Certa"],parcial:["prog","Quase"],errada:["bad","Ainda não"]};
async function prepararImagem(f){const url=URL.createObjectURL(f);try{const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
  const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
  const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);return await paraBlob(c,0.88)}finally{URL.revokeObjectURL(url)}}
function pResolver(S,el){const R=S.resp;R.resolv=arr(R.resolv);if(!est.rj)est.rj={v:"lista"};const st=est.rj;
  if(st.v==="q"&&R.resolv[st.k])return resolverQ(S,el,R.resolv[st.k]);
  if(st.v==="treino"&&st.tr)return treinoErro(S,el,st);
  st.v="lista";
  el.innerHTML=`<p class="lead">Traga uma questão do livro, da lista ou de uma prova. O Claude não entrega a resposta: ele divide a resolução em etapas, você faz cada uma e recebe dicas só quando pedir.</p>
  ${mapaErros()}
  ${R.resolv.length?`<div class="stack"><h2>Questões desta seção</h2>${R.resolv.map((x,k)=>`<div class="studyrow${x.var?" parecida":""}"><div class="sr-main">${x.var?`<span class="pill keep">Parecida · ${NIVEL_VAR[x.var.nivel]}</span>`:""}<b>${esc(resumoQ(x.plano.enun||x.enun))}</b><span class="note">${x.fim&&x.direta&&x.direta.av==="certa"?"Resolvida direto, sem ajuda ✓":x.fim?`Concluída · ${x.plano.etapas.length} etapas · ${dicasUsadas(x)} dica${dicasUsadas(x)===1?"":"s"}`:`Em andamento · etapa ${Math.min(x.k+1,x.plano.etapas.length)} de ${x.plano.etapas.length}`}</span></div>
    <div class="row"><button class="btn small" data-ab="${k}">${x.fim?"Rever":"Continuar"}</button><button class="btn small" data-rm="${k}" aria-label="Apagar esta questão">×</button></div></div>`).join("")}</div>`:""}
  ${CAP.sample?`<div class="panel stack"><b>Nova questão</b>
    <div class="field"><label for="qtx">Enunciado</label><textarea id="qtx" style="min-height:8rem" placeholder="Cole ou digite a questão. Fórmulas do jeito que conseguir: v^2, raiz de 2, H2O.">${esc(st.rasc||"")}</textarea></div>
    ${CAP.imgMax?`<div class="row"><label class="btn small" for="qim">Anexar foto ou print da questão</label><input type="file" id="qim" accept="image/*" hidden><span class="note" id="qimn">${st.img?esc(st.img.name):""}</span></div>`:""}
    <div class="row"><button class="btn primary" id="qgo" ${st.busy?"disabled":""}>Começar a resolver</button>${st.busy?'<button class="btn small" id="qstop">Parar</button>':""}</div><p class="note" id="qst">${st.busy?`<span class="espera">${masc("m-espera")}<span><span class="spin"></span>O Claude está preparando as etapas (até um minuto)…</span></span>`:st.err?`<span style="color:var(--bad)">${esc(st.err)}</span>`:""}</p></div>`
    :vazio("O Resolver junto usa o Claude. "+semGen())}
  <div class="row"><button class="btn" id="nx">Próxima etapa</button></div>`;
  $("#nx").onclick=()=>proximoPasso(S);
  el.querySelectorAll("[data-ab]").forEach(b=>b.onclick=()=>{est.rj={v:"q",k:+b.dataset.ab};pResolver(S,el)});
  el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{if(b.dataset.ok!=="1"){b.dataset.ok="1";b.textContent="Apagar?";return}R.resolv.splice(+b.dataset.rm,1);salvarResp(S);pResolver(S,el)});
  ligarMapaErros(S,el);
  const ta=$("#qtx");if(!ta)return;ta.oninput=()=>{st.rasc=ta.value};
  const fi=$("#qim");if(fi)fi.onchange=()=>{const f=fi.files[0];st.img=f&&/^image\//.test(f.type)?f:null;$("#qimn").textContent=st.img?st.img.name:""};
  if($("#qstop"))$("#qstop").onclick=()=>{if(st.ctl)st.ctl.abort()};
  $("#qgo").onclick=async()=>{const txt=ta.value.trim();if(txt.split(/\s+/).length<4&&!st.img){$("#qst").textContent="Escreva o enunciado completo ou anexe uma imagem da questão.";return}
    st.busy=true;st.err=null;st.ctl=new AbortController();pResolver(S,el);
    try{const imgs=st.img?[await prepararImagem(st.img)]:null;
      const g=await CAP.sample.json(promptPlano(S,txt,!!imgs),Object.assign({signal:st.ctl.signal,cache:false},imgs?{images:imgs}:{}));
      const pl=validarPlano(g,S);if(!pl)throw {code:"plano"};
      R.resolv.push({enun:txt||pl.enun,plano:pl,k:0,et:[],fim:false,quando:agora()});salvarResp(S);
      logEv("resolver",{est:est.id,sec:S.n,etapas:pl.etapas.length,img:!!imgs});
      est.rj={v:"q",k:R.resolv.length-1};
    }catch(e){avisoIA(e);st.err=e&&e.code==="plano"?"O Claude não conseguiu dividir esta questão em etapas. Confira o enunciado e tente de novo.":e&&e.code==="cancelled"?"":sampleMsg(e)}
    st.busy=false;st.ctl=null;if(est.view==="secao"&&est.step==="resolver")pResolver(S,el)}}
function resolverQ(S,el,x){const R=S.resp,P=x.plano,N=P.etapas.length;x.et=arr(x.et);
  if(x.var&&!x.fim&&!(x.direta&&x.direta.etapas))return tentativaDireta(S,el,x);
  const base=P.p!=null&&S.pars[P.p]?`<details><summary>Base no livro (p. ${S.pars[P.p].pg})</summary><p class="note-t">${esc(S.pars[P.p].t)}</p></details>`:"";
  const feitas=x.et.slice(0,Math.min(x.k,N)).map((E,k)=>E?`<div class="claim"><span class="note">Etapa ${k+1} · ${esc(P.etapas[k].titulo)}${E.viu?' · <span class="pill keep">vista resolvida</span>':E.dicas?` · ${E.dicas} dica${E.dicas>1?"s":""}`:""}</span><b>${esc(P.etapas[k].q)}</b><span class="t">${esc(P.etapas[k].esp)}</span></div>`:"").join("");
  let corpoH="";
  if(x.k<N){const k=x.k,E=x.et[k]=x.et[k]||{resp:"",av:null,ret:"",dicas:0,viu:false,tent:0},Q=P.etapas[k],fechada=E.av==="certa"||E.viu;
    corpoH=`<div class="stack"><span class="eyebrow">Etapa ${k+1} de ${N} · ${esc(Q.titulo)}</span><p class="q">${esc(Q.q)}</p>
      <div class="field"><label for="rtx">Sua resposta</label><textarea id="rtx" style="min-height:5rem" ${fechada?"readonly":""}>${esc(E.resp||"")}</textarea></div>
      ${E.dicas?`<div class="dicabox">${masc("m-dica")}<div class="stack">${Q.dicas.slice(0,E.dicas).map((d,j)=>`<div class="fb dica"><b>Dica ${j+1}:</b> ${esc(d)}</div>`).join("")}</div></div>`:""}
      <div id="rfb" aria-live="polite">${E.av?`<div class="fb"><span class="pill ${AVE[E.av][0]}">${AVE[E.av][1]}</span> ${esc(E.ret)}</div>`:""}</div>
      ${fechada?`<div class="fb"><b>Etapa resolvida:</b> ${esc(Q.esp)}</div><div class="row"><button class="btn primary" id="rnx">${k+1<N?"Próxima etapa":"Conferir a resposta"}</button></div>`
        :`<div class="row"><button class="btn primary" id="rchk" ${E.resp&&E.resp.trim()?"":"disabled"}>Conferir</button>${E.dicas<Q.dicas.length?`<button class="btn small" id="rdic">Pedir dica (${E.dicas+1} de ${Q.dicas.length})</button>`:""}</div>
        <button class="linkbtn sutil" id="rviu">Não consegui: ver esta etapa resolvida</button>`}</div>`}
  else if(!x.fim){const C=P.conf,itens=[["unidade","A unidade faz sentido?"],["ordem","O valor é razoável?"],["limite","Um teste rápido confirma?"]].filter(([k])=>C[k]);x.conf=x.conf||{};
    corpoH=`<div class="stack"><h2>Conferência</h2><p class="lead">Antes de dar por terminado, confira a resposta como um cientista faz.</p>
      ${P.resp?`<div class="fb"><b>Resposta:</b> ${esc(P.resp)}</div>`:""}
      ${itens.map(([k,t])=>`<div class="claim"><b>${t}</b>${x.conf[k]?`<span class="t">${esc(C[k])}</span>`:`<button class="btn small" data-cf="${k}">Pensar e ver</button>`}</div>`).join("")}
      <div class="row"><button class="btn primary" id="rfim">Concluir a questão</button></div></div>`}
  else if(x.direta&&x.direta.av==="certa"){corpoH=`<div class="stack"><div class="festa">${masc("m-cele")}<h2>Resolvida direto, sem ajuda</h2></div>
      <div class="fb"><b>Sua resposta:</b> ${esc(x.direta.resp)}<br>${esc(x.direta.ret)}</div>${P.resp?`<p class="note"><b>Resposta esperada:</b> ${esc(P.resp)}</p>`:""}
      <p class="note">Você resolveu uma questão parecida sem dicas: é o sinal de que aprendeu o caminho, e não só seguiu os passos.</p>
      <details><summary>Ver a resolução por etapas</summary><div class="stack">${P.etapas.map((Q,j)=>`<div class="claim"><span class="note">Etapa ${j+1} · ${esc(Q.titulo)}</span><b>${esc(Q.q)}</b><span class="t">${esc(Q.esp)}</span></div>`).join("")}</div></details>
      ${blocoParecida(x)}<div class="row"><button class="btn" id="rnova">Questões desta seção</button><button class="btn" id="rnx2">Próxima etapa da seção</button></div></div>`}
  else{const n=x.et.filter(E=>E&&E.av==="certa"&&!E.viu&&!E.dicas).length,d=dicasUsadas(x),v=x.et.filter(E=>E&&E.viu).length;
    corpoH=`<div class="stack"><h2>Questão concluída</h2><div class="placar">${[["Etapas certas sem ajuda",n+" de "+N],["Dicas usadas",d],["Etapas vistas resolvidas",v]].map(([a,b])=>`<div class="stat"><b>${b}</b><span class="note">${a}</span></div>`).join("")}</div>
      ${P.resp?`<div class="fb"><b>Resposta:</b> ${esc(P.resp)}</div>`:""}
      ${blocoParecida(x)}
      <div class="row"><button class="btn" id="rnova">Questões desta seção</button><button class="btn" id="rnx2">Próxima etapa da seção</button></div></div>`}
  el.innerHTML=`<button class="linkbtn" id="rvolta">← Questões desta seção</button>
    <div class="passage"><span class="label">Questão</span><p>${esc(P.enun||x.enun)}</p>${P.pede?`<p class="note"><b>Pede:</b> ${esc(P.pede)}</p>`:""}</div>${base}${P.fora?`<p class="note">Fora do trecho: ${esc(P.fora)}</p>`:""}
    ${stepsBar(N,Math.min(x.k,N))}${feitas?`<details${x.k>=N?" open":""}><summary>Etapas feitas (${Math.min(x.k,N)})</summary><div class="stack">${feitas}</div></details>`:""}${corpoH}`;
  const re=()=>resolverQ(S,el,x);
  $("#rvolta").onclick=()=>{est.rj={v:"lista"};pResolver(S,el)};
  if(x.k<N){const k=x.k,E=x.et[k],Q=P.etapas[k],ta=$("#rtx");
    if(ta&&!ta.readOnly){ta.oninput=()=>{E.resp=ta.value;$("#rchk").disabled=!ta.value.trim()};ta.focus({preventScroll:true})}
    if($("#rdic"))$("#rdic").onclick=()=>{E.dicas++;salvarResp(S);logEv("dica",{est:est.id,sec:S.n,etapa:k,n:E.dicas});re()};
    if($("#rviu"))$("#rviu").onclick=()=>{E.viu=true;salvarResp(S);logEv("etapa_vista",{est:est.id,sec:S.n,etapa:k});re()};
    if($("#rnx"))$("#rnx").onclick=()=>{x.k++;salvarResp(S);re();window.scrollTo(0,0)};
    if($("#rchk"))$("#rchk").onclick=async()=>{const b=$("#rchk");b.disabled=true;$("#rfb").innerHTML='<p class="note"><span class="spin"></span>Conferindo…</p>';
      try{const f=await CAP.sample.json(promptEtapa(x,k,E.resp.trim()),{modelTier:"quick",cache:false});
        E.av=AVE[f&&f.avaliacao]?f.avaliacao:"parcial";E.ret=str(f&&f.retorno)?f.retorno.trim():"";E.erro=str(f&&f.erro)?f.erro.trim():"";E.tent=(E.tent||0)+1;E.hist=arr(E.hist);E.hist.push({av:E.av,erro:E.erro,q:agora()});
        salvarResp(S);logEv("etapa",{est:est.id,sec:S.n,etapa:k,av:E.av,erro:E.erro,tent:E.tent,dicas:E.dicas});re()}
      catch(e){avisoIA(e);$("#rfb").innerHTML=`<p class="note" style="color:var(--bad)">${esc(sampleMsg(e))}</p>`;b.disabled=false}}}
  el.querySelectorAll("[data-cf]").forEach(b=>b.onclick=()=>{x.conf[b.dataset.cf]=true;salvarResp(S);re()});
  if($("#rfim"))$("#rfim").onclick=()=>{x.fim=true;salvarResp(S);re()};
  if($("#rnova"))$("#rnova").onclick=()=>{est.rj={v:"lista"};pResolver(S,el)};
  if($("#rnx2"))$("#rnx2").onclick=()=>proximoPasso(S);
  ligarParecida(S,el,x)}

/* --- "Mais uma igual": questão parecida, começando sem dicas --- */
const NIVEL_VAR={1:"outros números",2:"outro contexto",3:"pergunta invertida"};
const NIVEL_VAR_DESC={1:"Mesma situação, outros valores. Confirma o procedimento.",2:"Mesmo conceito numa situação nova. Confirma que você reconhece quando usar.",3:"A mesma situação, pedindo outra grandeza. Confirma que você entende a relação, nos dois sentidos."};
function blocoParecida(x){if(!CAP.sample)return "";const sug=x.direta&&x.direta.av==="certa"?Math.min(3,(x.var?x.var.nivel:0)+1):x.var?x.var.nivel:1;
  return `<div class="panel stack"><b>Tentar uma parecida</b><p class="note">A parecida começa sem dicas: você tenta a resposta final direto. Se travar, ela vira resolução por etapas.${(dicasUsadas(x)>2||x.et.some(E=>E&&E.viu))&&!x.var?" Depois de tantas dicas, comece pelos outros números.":""}</p>
    <div class="parecidas">${[1,2,3].map(n=>`<button class="btn${n===sug?" primary":""}" data-var="${n}"><b>${NIVEL_VAR[n][0].toUpperCase()+NIVEL_VAR[n].slice(1)}</b><span class="note">${NIVEL_VAR_DESC[n]}</span></button>`).join("")}</div>
    <p class="note" id="vst"></p></div>`}
function promptVariacao(S,x,nivel){const pf=perfilAtual(),P=x.plano;
  const regra={1:"mesma estrutura e mesmo contexto, com outros valores numéricos (escolha valores que deem contas razoáveis à mão)",
    2:"mesmo conceito e mesmo tipo de raciocínio, numa situação diferente, de preferência do cotidiano do estudante",
    3:"a mesma situação, mas pedindo outra grandeza: o que era dado vira o que se pede (por exemplo, dada a velocidade, pedir o tempo)"}[nivel];
  return `Você cria uma questão parecida para um estudante de ${PERFIS[pf]} que acabou de resolver a questão abaixo com ajuda. O objetivo é ver se ele aprendeu o caminho.
A questão nova deve ser: ${regra}. Não copie a original. Use valores realistas. Resolva a questão nova você mesmo, com cuidado, e confira a resposta antes de responder.
Use o TRECHO do livro como base teórica.
Divida a resolução em 3 a 6 etapas pequenas, como na original. Para cada etapa: "pergunta" curta, sem entregar a resposta; "esperado" é a resposta correta; "dicas" são três dicas graduais (a primeira só aponta a direção, a terceira quase entrega a etapa).
${LATEX_REGRA}

Responda apenas com JSON neste formato:
{"enunciado":"...","pede":"...","etapas":[{"titulo":"...","pergunta":"...","esperado":"...","dicas":["...","...","..."]}],"resposta":"...","conferir":{"unidade":"...","ordem":"...","limite":"..."},"p":3,"fora_do_trecho":""}

QUESTÃO ORIGINAL:
${P.enun||x.enun}
RESPOSTA DA ORIGINAL: ${P.resp}

TRECHO:
${trechoS(S)}`}
function promptFinal(x,resp){const P=x.plano;
  return `Você confere a resposta final de um estudante de ${PERFIS[perfilAtual()]} a uma questão, resolvida sem ajuda. Aceite arredondamentos razoáveis (até cerca de 2%), unidades equivalentes (36 km/h = 10 m/s) e notação informal (v^2, x2, raiz de 2). Se faltar a unidade numa grandeza física, a resposta é "parcial". Não revele a resposta correta se a do estudante não estiver certa.

QUESTÃO: ${P.enun||x.enun}
RESPOSTA CORRETA (para você, não mostre): ${P.resp}
RESPOSTA DO ESTUDANTE: ${resp}

Responda apenas com JSON:
{"avaliacao":"certa","retorno":"...","erro":"nenhum"}
- "avaliacao": "certa", "parcial" ou "errada".
- "retorno": uma frase para o estudante. Se não estiver certa, diga só o que conferir (unidade, sinal, a grandeza pedida), sem dar o valor. ${LATEX_REGRA}
- "erro": "unidade", "sinal", "conta", "conceito", "leitura", "incompleta" ou "nenhum".`}
function ligarParecida(S,el,x){const R=S.resp;
  el.querySelectorAll("[data-var]").forEach(b=>b.onclick=async()=>{const nivel=+b.dataset.var;
    el.querySelectorAll("[data-var]").forEach(y=>y.disabled=true);$("#vst").innerHTML='<span class="spin"></span>O Claude está criando a questão parecida (até um minuto)…';
    try{const g=await CAP.sample.json(promptVariacao(S,x,nivel),{cache:false});const pl=validarPlano(g,S);if(!pl||!pl.enun||!pl.resp)throw {code:"plano"};
      const orig=R.resolv.indexOf(x);R.resolv.push({enun:pl.enun,plano:pl,k:0,et:[],fim:false,quando:agora(),var:{orig,nivel},direta:{resp:"",av:null,ret:"",tent:0}});salvarResp(S);
      logEv("parecida",{est:est.id,sec:S.n,nivel});est.rj={v:"q",k:R.resolv.length-1};pResolver(S,el);window.scrollTo(0,0)}
    catch(e){avisoIA(e);$("#vst").textContent=e&&e.code==="plano"?"O Claude não conseguiu montar a questão parecida. Tente de novo ou escolha outro tipo.":sampleMsg(e);el.querySelectorAll("[data-var]").forEach(y=>y.disabled=false)}})}
function tentativaDireta(S,el,x){const P=x.plano,D=x.direta=x.direta||{resp:"",av:null,ret:"",tent:0};
  el.innerHTML=`<button class="linkbtn" id="rvolta">← Questões desta seção</button>
    <span class="eyebrow">Questão parecida · ${NIVEL_VAR[x.var.nivel]}</span>
    <div class="passage"><span class="label">Questão</span><p>${esc(P.enun)}</p>${P.pede?`<p class="note"><b>Pede:</b> ${esc(P.pede)}</p>`:""}</div>
    <p class="lead">Tente direto, sem dicas. Use um papel para as contas e escreva aqui a resposta final${perfilAtual()==="matematica"?"":", com a unidade"}.</p>
    <div class="field"><label for="dtx">Resposta final</label><textarea id="dtx" style="min-height:4rem">${esc(D.resp)}</textarea></div>
    <div id="dfb" aria-live="polite">${D.av?`<div class="fb"><span class="pill ${AVE[D.av][0]}">${AVE[D.av][1]}</span> ${esc(D.ret)}</div>`:""}</div>
    <div class="row"><button class="btn primary" id="dchk" ${D.resp.trim()?"":"disabled"}>Conferir</button><button class="btn" id="detp">${D.tent?"Resolver por etapas, com dicas":"Travei: resolver por etapas"}</button></div>
    ${D.tent?`<p class="note">Tentativas: ${D.tent}.</p>`:""}`;
  const re=()=>resolverQ(S,el,x),ta=$("#dtx");
  $("#rvolta").onclick=()=>{est.rj={v:"lista"};pResolver(S,el)};
  ta.oninput=()=>{D.resp=ta.value;$("#dchk").disabled=!ta.value.trim()};ta.focus({preventScroll:true});
  $("#detp").onclick=()=>{D.etapas=true;salvarResp(S);logEv("parecida_etapas",{est:est.id,sec:S.n,tent:D.tent});re()};
  $("#dchk").onclick=async()=>{const b=$("#dchk");b.disabled=true;$("#dfb").innerHTML='<p class="note"><span class="spin"></span>Conferindo…</p>';
    try{const f=await CAP.sample.json(promptFinal(x,D.resp.trim()),{modelTier:"quick",cache:false});
      D.av=AVE[f&&f.avaliacao]?f.avaliacao:"parcial";D.ret=str(f&&f.retorno)?f.retorno.trim():"";D.erro=str(f&&f.erro)?f.erro.trim():"";D.tent++;D.hist=arr(D.hist);D.hist.push({av:D.av,erro:D.erro,q:agora()});
      if(D.av==="certa"){x.fim=true;x.k=x.plano.etapas.length}salvarResp(S);logEv("parecida_final",{est:est.id,sec:S.n,av:D.av,erro:D.erro,tent:D.tent});re()}
    catch(e){avisoIA(e);$("#dfb").innerHTML=`<p class="note" style="color:var(--bad)">${esc(sampleMsg(e))}</p>`;b.disabled=false}}}

/* --- Mapa de erros: os tipos de erro do Resolver junto, no estudo inteiro --- */
const TIPOS_ERRO={unidade:["Unidades","esquecer a unidade, trocar ou não converter (km/h e m/s, g e kg)"],
  sinal:["Sinais","sinal trocado: sentido, trabalho negativo, referencial, menos de uma subtração"],
  conta:["Contas","frações, potências de 10, arredondamento, isolar a incógnita"],
  conceito:["Conceitos","usar a lei, a definição ou a fórmula errada para a situação"],
  leitura:["Leitura do enunciado","dado ignorado, grandeza pedida trocada, situação mal interpretada"],
  incompleta:["Respostas incompletas","parar no meio, faltar parte do que foi pedido"]};
const MIN_ERROS=8;
function errosDoEstudo(){const cnt={},ult={};let conf=0,certas=0;
  const ver=(h,q)=>{conf++;if(h.av==="certa"){certas++;return}if(TIPOS_ERRO[h.erro]){cnt[h.erro]=(cnt[h.erro]||0)+1;ult[h.erro]=q}};
  for(const S of arr(est.secoes))for(const x of arr(S.resp&&S.resp.resolv)){if(!x)continue;
    const regs=[...arr(x.et).filter(Boolean),...(x.direta&&(x.direta.tent||x.direta.hist)?[x.direta]:[])];
    for(const E of regs){const H=arr(E.hist);if(H.length)H.forEach(h=>ver(h,x.plano.enun||x.enun));else if(E.av)ver(E,x.plano.enun||x.enun)}}
  const lista=Object.keys(cnt).map(k=>({k,n:cnt[k],ex:ult[k]})).sort((a,b)=>b.n-a.n);
  return {conf,certas,erros:lista.reduce((s,x)=>s+x.n,0),lista}}
function mapaErros(){const M=errosDoEstudo();if(!M.conf)return "";
  if(M.conf<MIN_ERROS)return `<p class="note">Seu mapa de erros aparece depois de ${MIN_ERROS} respostas conferidas neste estudo (faltam ${MIN_ERROS-M.conf}).</p>`;
  if(!M.lista.length)return `<div class="fb"><b>Mapa de erros:</b> ${M.conf} respostas conferidas, nenhum erro com tipo definido. Continue assim.</div>`;
  const max=M.lista[0].n;
  return `<div class="panel stack mapaerros"><b>Seu mapa de erros neste estudo</b>
    <p class="note">${M.conf} respostas conferidas no Resolver junto, ${M.certas} ${M.certas===1?"certa":"certas"}. Os erros, por tipo:</p>
    <div class="barras">${M.lista.map(x=>`<div class="barra"><span class="bl"><b>${TIPOS_ERRO[x.k][0]}</b><span class="note">${TIPOS_ERRO[x.k][1]}</span></span>
      <span class="bv"><i style="width:${Math.max(8,Math.round(100*x.n/max))}%"></i><span>${x.n} de ${M.conf}</span></span>${CAP.sample?`<button class="btn small" data-tre="${x.k}">Treinar</button>`:""}</div>`).join("")}</div>
    ${M.lista[0].n>=3?`<p class="note">O que mais pesa agora: <b>${TIPOS_ERRO[M.lista[0].k][0].toLowerCase()}</b>. Um treino curto de 5 itens sobre isso, no assunto deste estudo, ajuda mais do que mais uma questão inteira.</p>`:""}
    <p class="note" id="tst"></p></div>`}
function promptTreinoErro(S,tipo){const pf=perfilAtual(),M=errosDoEstudo(),ex=(M.lista.find(x=>x.k===tipo)||{}).ex||"";
  return `Você prepara um treino curto e focado para um estudante de ${PERFIS[pf]} que vem errando sempre no mesmo ponto: ${TIPOS_ERRO[tipo][0].toLowerCase()} (${TIPOS_ERRO[tipo][1]}).
Crie 5 itens de múltipla escolha, rápidos (resolvidos em até 1 minuto cada), sobre o assunto do TRECHO abaixo, cada um exigindo exatamente esse cuidado. As duas alternativas erradas devem ser os erros típicos desse tipo (por exemplo, para unidades: o valor sem converter, a unidade trocada). Do mais fácil para o mais difícil.
${ex?`Uma questão em que ele errou: ${ex}
`:""}${LATEX_REGRA}

Responda apenas com JSON:
{"itens":[{"pergunta":"...","certa":"...","erradas":["...","..."],"explica":"..."}]}
- "explica": por que a certa está certa e qual armadilha as erradas representam, em até 35 palavras.

TRECHO:
${trechoS(S)}`}
function ligarMapaErros(S,el){el.querySelectorAll("[data-tre]").forEach(b=>b.onclick=async()=>{const tipo=b.dataset.tre;
  el.querySelectorAll("[data-tre]").forEach(y=>y.disabled=true);$("#tst").innerHTML='<span class="spin"></span>O Claude está preparando o treino…';
  try{const g=await CAP.sample.json(promptTreinoErro(S,tipo),{cache:false});
    const it=arr(g&&g.itens).filter(x=>x&&str(x.pergunta)&&str(x.certa)&&strs(x.erradas).length>=2).slice(0,5).map(x=>({q:x.pergunta.trim(),ok:x.certa.trim(),no:strs(x.erradas).slice(0,2),ex:str(x.explica)?x.explica.trim():""}));
    if(it.length<3)throw {code:"poucos"};
    est.rj={v:"treino",tr:{tipo,it,i:0,c:0,resp:false}};logEv("treino_erro",{est:est.id,sec:S.n,tipo});pResolver(S,el);window.scrollTo(0,0)}
  catch(e){avisoIA(e);$("#tst").textContent=e&&e.code==="poucos"?"O Claude não conseguiu montar o treino. Tente de novo.":sampleMsg(e);el.querySelectorAll("[data-tre]").forEach(y=>y.disabled=false)}})}
function treinoErro(S,el,st){const T=st.tr,N=T.it.length;
  if(T.i>=N){S.resp.treinos=arr(S.resp.treinos);if(!T.salvo){S.resp.treinos.push({tipo:T.tipo,c:T.c,t:N,q:agora()});T.salvo=true;salvarResp(S)}
    el.innerHTML=`<span class="eyebrow">Treino · ${TIPOS_ERRO[T.tipo][0]}</span><div class="fb"><b>${T.c} de ${N}.</b> ${T.c>=N-1?"Bom sinal: o cuidado está ficando automático. Confira no mapa, nas próximas questões, se esse erro diminui.":"Esse ponto ainda pede atenção. Antes de responder uma questão, pare um segundo só para ele."}</div>
      <div class="row"><button class="btn primary" id="tvolta">Voltar às questões</button></div>`;
    $("#tvolta").onclick=()=>{est.rj={v:"lista"};pResolver(S,el)};return}
  const X=T.it[T.i];if(!T.ord||T.ord.k!==T.i)T.ord={k:T.i,l:shuffle([X.ok,...X.no]).map(esc)};
  el.innerHTML=`<button class="linkbtn" id="tvolta">← Questões desta seção</button><span class="eyebrow">Treino · ${TIPOS_ERRO[T.tipo][0]}</span>${stepsBar(N,T.i)}
    <p class="q">${esc(X.q)}</p>${optsHTML(T.ord.l)}<div id="fb" aria-live="polite"></div>`;
  $("#tvolta").onclick=()=>{est.rj={v:"lista"};pResolver(S,el)};
  bindOpts(T.ord.l,esc(X.ok),right=>{if(right)T.c++;logEv("treino_item",{est:est.id,sec:S.n,tipo:T.tipo,certo:right});
    $("#fb").innerHTML=`<div class="stack"><div class="fb"><b class="${right?"ok":"bad"}">${right?"Isso.":"Não era essa."}</b> ${esc(X.ex)}</div><div class="row"><button class="btn primary" id="tnx">${T.i+1<N?"Próximo":"Ver o resultado"}</button></div></div>`;
    $("#tnx").onclick=()=>{T.i++;treinoErro(S,el,st);window.scrollTo(0,0)}})}

/* --- Modo véspera de prova: fórmulas, erros recorrentes, questões e folha de revisão --- */
const VP_TEMPO={15:{f:4,t:0,q:3},30:{f:6,t:5,q:5},60:{f:10,t:5,q:8}};
function vpFormulas(secs){const out=[];for(const S of secs){const g=S.gen||{};arr(g.formulas).forEach((F,k)=>{if(!sinal(S,"f"+k)&&S.pars[F.p])out.push({...F,k:null,sec:S.n,pg:S.pars[F.p].pg,cid:`${est.id}:${S.n}:f:${norm(F.latex).slice(0,40)}`})})}return out}
function vpMCQ(el,itens,rot,fim){let i=0,c=0;const errs=[];
  const passo=()=>{if(i>=itens.length){fim(c,errs);return}const X=itens[i],l=shuffle([X.ok,...X.no]).map(esc);
    el.innerHTML=`<span class="eyebrow">${rot} · ${i+1} de ${itens.length}</span>${stepsBar(itens.length,i)}<p class="q">${esc(X.q)}</p>${optsHTML(l)}<div id="fb" aria-live="polite"></div>`;
    bindOpts(l,esc(X.ok),right=>{if(right)c++;else errs.push(X);
      $("#fb").innerHTML=`<div class="stack"><div class="fb"><b class="${right?"ok":"bad"}">${right?"Isso.":"Não era essa."}</b> ${esc(X.ex||"")}</div><div class="row"><button class="btn primary" id="vnx">${i+1<itens.length?"Próxima":"Continuar"}</button></div></div>`;
      $("#vnx").onclick=()=>{i++;passo();window.scrollTo(0,0)}})};passo()}
const vpItens=g=>arr(g&&g.itens).filter(x=>x&&str(x.pergunta)&&str(x.certa)&&strs(x.erradas).length>=2).map(x=>({q:x.pergunta.trim(),ok:x.certa.trim(),no:strs(x.erradas).slice(0,3),ex:str(x.explica)?x.explica.trim():"",as:str(x.assunto)?x.assunto.trim():""}));
function promptVespera(secs,n){const pf=perfilAtual(),F=vpFormulas(secs);let txt="",lim=18000;
  for(const S of secs){const t=`### ${S.titulo}\n${trechoS(S)}\n\n`;if(txt.length+t.length>lim){txt+=t.slice(0,Math.max(0,lim-txt.length))+"\n[...]\n";break}txt+=t}
  return `Você prepara um simulado curto de véspera de prova para um estudante de ${PERFIS[pf]}, sobre o conteúdo abaixo, do livro que ele estudou.
Crie ${n} questões de múltipla escolha no estilo de prova escolar e de vestibular: misture questões conceituais, de leitura de situação e de cálculo simples (resolvível em até 3 minutos, à mão). Cubra as fórmulas e os assuntos principais, sem repetir o mesmo ponto. Cada questão tem a certa e três erradas plausíveis, que correspondem a erros típicos (unidade não convertida, sinal trocado, fórmula errada).
${LATEX_REGRA}

Responda apenas com JSON:
{"itens":[{"pergunta":"...","certa":"...","erradas":["...","...","..."],"explica":"...","assunto":"..."}]}
- "explica": a resolução curta, em até 40 palavras. "assunto": o tema da questão em até 5 palavras.

${F.length?`FÓRMULAS DO CONTEÚDO:\n${F.map(x=>`- ${x.nome}: ${x.latex}`).join("\n")}\n\n`:""}CONTEÚDO:
${txt}`}
function estVespera(){const m=est.meta,secs0=est.secoes.filter(S=>S.status!=="nova");if(!est.vp)est.vp={fase:"setup",tempo:30,sel:(secs0.length?secs0:est.secoes).map(S=>S.n)};const V=est.vp;
  const cab=`<div class="stack"><button class="linkbtn" id="bk">← ${esc(m.titulo)}</button><span class="eyebrow">Véspera de prova</span><h1>Revisão para a prova</h1></div>`;
  const secs=()=>est.secoes.filter(S=>V.sel.includes(S.n));
  const voltar=()=>{$("#bk").onclick=()=>estGo("estudo")};
  if(V.fase==="setup"){const F=vpFormulas(secs()),E=errosDoEstudo(),T=VP_TEMPO[V.tempo],temErro=E.lista.length&&E.lista[0].n>=2&&T.t;
    main.innerHTML=`${cab}<p class="lead">Uma sessão curta que junta o que mais ajuda na véspera: lembrar as fórmulas de memória, atacar o seu erro mais frequente e resolver um simulado no estilo da prova. No fim, você baixa uma folha de revisão de uma página.</p>
      <div class="stack"><span class="pnl-lbl">Quanto tempo você tem?</span><div class="subtabs">${[15,30,60].map(t=>`<button class="chip" data-t="${t}" aria-pressed="${V.tempo===t}">${t} min</button>`).join("")}</div></div>
      <div class="stack"><span class="pnl-lbl">O que cai na prova</span>${est.secoes.map(S=>`<label class="row" style="gap:8px"><input type="checkbox" data-sec="${S.n}" ${V.sel.includes(S.n)?"checked":""}> ${esc(S.titulo)} <span class="note">p. ${S.pgIni}–${S.pgFim}${S.status==="nova"?" · não estudada":""}</span></label>`).join("")}</div>
      <div class="panel stack"><b>A sessão</b><ol class="vplano">
        <li>Fórmulas de memória: ${Math.min(T.f,F.length)} de ${F.length}${F.length?", começando pelas que você mais esquece":" (prepare os exercícios das seções para ter fórmulas)"}</li>
        ${temErro?`<li>Seu erro mais frequente, <b>${TIPOS_ERRO[E.lista[0].k][0].toLowerCase()}</b>: treino de ${T.t} itens</li>`:`<li class="note">Treino de erros: ${T.t?"ainda sem um erro que se repita no Resolver junto":"fica de fora nos 15 minutos"}</li>`}
        <li>Simulado: ${T.q} questões no estilo da prova</li><li>Folha de revisão para baixar</li></ol>
        ${CAP.sample?"":'<p class="note">Sem acesso ao Claude nesta visualização: o treino e o simulado ficam de fora.</p>'}</div>
      <div class="row"><button class="btn primary" id="vgo" ${V.sel.length?"":"disabled"}>Começar</button></div>`;
    voltar();main.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{V.tempo=+b.dataset.t;estVespera()});
    main.querySelectorAll("[data-sec]").forEach(c=>c.onchange=()=>{const n=+c.dataset.sec;V.sel=c.checked?[...new Set([...V.sel,n])]:V.sel.filter(x=>x!==n);estVespera()});
    $("#vgo").onclick=async()=>{const b=$("#vgo");b.disabled=true;b.innerHTML='<span class="spin"></span>Montando…';
      let lap={};try{const r=await uCol().doc("rev_"+est.id).get();lap=r.exists?(r.data().cards||{}):{}}catch(e){}
      const F2=vpFormulas(secs()).map(x=>({...x,lap:(lap[x.cid]&&lap[x.cid].l)||0,nunca:!lap[x.cid]})).sort((a,b)=>b.lap-a.lap||(b.nunca-a.nunca)).slice(0,T.f);
      Object.assign(V,{fase:F2.length?"form":"erro",F:F2,fi:0,ver:false,lembrou:[],esqueceu:[],tipo:temErro&&CAP.sample?E.lista[0].k:null,tc:null,tt:0,qi:null,qc:0,qerr:[],t0:Date.now()});
      logEv("vespera",{est:est.id,tempo:V.tempo,secs:V.sel.length});estVespera()};return}
  if(V.fase==="form"){const X=V.F[V.fi];
    main.innerHTML=`${cab}<span class="eyebrow">1 · Fórmulas de memória · ${V.fi+1} de ${V.F.length}</span>${stepsBar(V.F.length,V.fi)}
      <div class="passage cartao"><p><b>${esc(X.nome)}</b></p><p class="note">Escreva num papel, sem olhar: a fórmula, o que significa cada símbolo, a unidade de cada um e quando ela vale.${X.lap?` Você já esqueceu esta ${X.lap} vez${X.lap>1?"es":""} na revisão.`:""}</p></div>
      ${V.ver?`${fichaFormula(S0(X.sec),X)}<div class="row"><button class="btn primary" id="vsim">Lembrei</button><button class="btn" id="vnao">Não lembrei, ou lembrei errado</button></div>`:'<div class="row"><button class="btn primary" id="vmos">Conferir</button></div>'}`;
    voltar();if($("#vmos"))$("#vmos").onclick=()=>{V.ver=true;estVespera()};
    const prox=ok=>{(ok?V.lembrou:V.esqueceu).push(X);V.fi++;V.ver=false;if(V.fi>=V.F.length)V.fase="erro";estVespera();window.scrollTo(0,0)};
    if($("#vsim"))$("#vsim").onclick=()=>prox(true);if($("#vnao"))$("#vnao").onclick=()=>prox(false);return}
  if(V.fase==="erro"){if(!V.tipo){V.fase="quest";return estVespera()}
    main.innerHTML=`${cab}<span class="eyebrow">2 · Seu erro mais frequente: ${TIPOS_ERRO[V.tipo][0]}</span><p class="note"><span class="spin"></span>O Claude está preparando o treino…</p><div id="vbox"></div>`;voltar();
    (async()=>{try{const g=await CAP.sample.json(promptTreinoErro(secs()[0],V.tipo),{cache:false});const it=vpItens(g).slice(0,VP_TEMPO[V.tempo].t);if(it.length<3)throw {code:"poucos"};
        main.innerHTML=`${cab}<div id="vbox"></div>`;voltar();
        vpMCQ($("#vbox"),it,"2 · "+TIPOS_ERRO[V.tipo][0],(c)=>{V.tc=c;V.tt=it.length;V.fase="quest";estVespera()})}
      catch(e){avisoIA(e);V.fase="quest";toast(e&&e.code==="poucos"?"O treino de erros não pôde ser montado; seguindo para o simulado.":sampleMsg(e));estVespera()}})();return}
  if(V.fase==="quest"){if(!CAP.sample){V.fase="fim";return estVespera()}
    const n=VP_TEMPO[V.tempo].q;
    main.innerHTML=`${cab}<span class="eyebrow">3 · Simulado</span><p class="note"><span class="spin"></span>O Claude está montando ${n} questões no estilo da prova (até um minuto)…</p>`;voltar();
    (async()=>{try{const g=await CAP.sample.json(promptVespera(secs(),n),{cache:false});const it=vpItens(g).slice(0,n);if(it.length<2)throw {code:"poucos"};
        main.innerHTML=`${cab}<div id="vbox"></div>`;voltar();
        vpMCQ($("#vbox"),it,"3 · Simulado",(c,errs)=>{V.qc=c;V.qt=it.length;V.qerr=errs;V.fase="fim";estVespera()})}
      catch(e){avisoIA(e);toast(e&&e.code==="poucos"?"O simulado não pôde ser montado.":sampleMsg(e));V.fase="fim";estVespera()}})();return}
  if(!V.salvo){V.salvo=true;const r={q:agora(),tempo:V.tempo,form:[V.lembrou.length,V.F.length],treino:V.tt?[V.tc,V.tt,V.tipo]:null,sim:V.qt?[V.qc,V.qt]:null,min:Math.round((Date.now()-V.t0)/60000)};
    m.vesperas=[...arr(m.vesperas),r].slice(-20);qw("meta",()=>mRef(est.id).update({vesperas:m.vesperas,atualizado:agora()}));logEv("vespera_fim",r)}
  const pontos=[...V.esqueceu.map(x=>`Fórmula: <b>${esc(x.nome)}</b>`),...(V.tipo&&V.tc!=null&&V.tc<V.tt?[`Cuidado com <b>${TIPOS_ERRO[V.tipo][0].toLowerCase()}</b>: ${esc(TIPOS_ERRO[V.tipo][1])}`]:[]),...Object.entries(V.qerr.reduce((o,x)=>{const k=x.as||"";(o[k]=o[k]||[]).push(x);return o},{})).map(([k,l])=>k?`${l.length>1?l.length+" questões erradas":"Questão errada"} sobre <b>${esc(k)}</b>`:l.map(x=>`Questão errada: ${esc(x.q.length>90?fecharTex(x.q.slice(0,90))+"…":x.q)}`).join("<br>"))];
  main.innerHTML=`${cab}<div class="festa">${masc("m-cele")}<h2>Sessão concluída</h2></div>
    <div class="placar">${[["Fórmulas lembradas",V.F.length?`${V.lembrou.length} de ${V.F.length}`:"—"],["Treino de erros",V.tt?`${V.tc} de ${V.tt}`:"—"],["Simulado",V.qt?`${V.qc} de ${V.qt}`:"—"]].map(([a,b])=>`<div class="stat"><b>${b}</b><span class="note">${a}</span></div>`).join("")}</div>
    ${pontos.length?`<div class="stack"><h2>Para revisar antes de dormir</h2><ul class="gloss">${pontos.map(p=>`<li><span class="gt">${p}</span></li>`).join("")}</ul></div>`:'<div class="fb">Nada para rever com urgência. Durma bem: o sono ajuda a fixar o que você estudou.</div>'}
    <div class="row"><button class="btn primary" id="vfolha">Baixar a folha de revisão</button><button class="btn" id="vnovo">Nova sessão</button><button class="btn" id="vvolta">Voltar ao estudo</button></div>
    <p class="note">A folha traz as fórmulas do conteúdo (as que você esqueceu primeiro), as suas armadilhas e as questões que você errou, com a resolução. Abra o arquivo para imprimir ou salvar em PDF.</p>`;
  voltar();$("#vvolta").onclick=()=>estGo("estudo");$("#vnovo").onclick=()=>{est.vp=null;estVespera()};$("#vfolha").onclick=()=>baixarFolha(V,secs())}
const S0=n=>est.secoes.find(S=>S.n===n)||est.secoes[0];
async function baixarFolha(V,secs){const m=est.meta,todas=vpFormulas(secs),esq=new Set(V.esqueceu.map(x=>x.cid)),E=errosDoEstudo();
  const ord=[...todas.filter(x=>esq.has(x.cid)),...todas.filter(x=>!esq.has(x.cid))];
  const css=`body{font:11pt/1.45 Georgia,serif;color:#111;max-width:46rem;margin:24px auto;padding:0 16px}h1{font:700 17pt Arial,sans-serif;margin:0 0 2px}h2{font:700 12pt Arial,sans-serif;margin:18px 0 6px;border-bottom:1px solid #999}
    .sub{font:9pt Arial,sans-serif;color:#555}.f{break-inside:avoid;border:1px solid #ccc;border-radius:6px;padding:6px 10px;margin:6px 0}.f b{font-family:Arial,sans-serif}.esq{border-color:#b9412d;border-width:2px}
    .f small{display:block;color:#444}ul{margin:4px 0 0;padding-left:18px}li{margin:3px 0}@media print{body{margin:0}}`;
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Folha de revisão - ${esc(m.titulo)}</title><style>${css}</style>
<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]]},svg:{fontCache:"global"}}<\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js"><\/script></head><body>
<img src="${MASCOTE}" alt="" style="float:right;width:70px;margin:0 0 6px 12px"><h1>Folha de revisão · ${esc(m.titulo)}</h1><div class="sub">${esc(secs.map(S=>S.titulo).join(" · "))} · ${new Date().toLocaleDateString("pt-BR")} · LIO-C</div>
${ord.length?`<h2>Fórmulas${esq.size?" (com borda vermelha: as que você esqueceu hoje)":""}</h2>${ord.map(x=>`<div class="f${esq.has(x.cid)?" esq":""}"><b>${esc(x.nome)}</b> <span class="sub">p. ${x.pg}</span>
  <div>\\[${esc(x.latex)}\\]</div><small>${x.simb.map(z=>`\\(${esc(z.s)}\\): ${esc(z.m)}${z.u?` (${esc(z.u)})`:""}`).join(" · ")}</small>${x.vale?`<small><b>Quando vale:</b> ${esc(x.vale)}</small>`:""}</div>`).join("")}`:""}
${E.lista.length?`<h2>Suas armadilhas</h2><ul>${E.lista.slice(0,3).map(x=>`<li><b>${TIPOS_ERRO[x.k][0]}</b> (${x.n} vez${x.n>1?"es":""} no Resolver junto): ${esc(TIPOS_ERRO[x.k][1])}.</li>`).join("")}</ul>`:""}
${V.qerr.length?`<h2>Questões que você errou no simulado</h2>${V.qerr.map(x=>`<div class="f"><div>${esc(x.q)}</div><small><b>Resposta:</b> ${esc(x.ok)}</small>${x.ex?`<small>${esc(x.ex)}</small>`:""}</div>`).join("")}`:""}
<h2>Na hora da prova</h2><ul><li>Leia a pergunta duas vezes: qual grandeza é pedida, em qual unidade?</li><li>Antes de calcular, anote os dados com unidades e converta tudo para o SI.</li><li>Confira a resposta: a unidade faz sentido? O valor é razoável?</li></ul>
</body></html>`;
  const nome=`Folha de revisao - ${nomeArquivo(m.titulo)}.html`;
  if(CAP.uid==="local"){try{const u=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));const w=window.open(u,"_blank");if(w){setTimeout(()=>URL.revokeObjectURL(u),60000);return}}catch(e){}}
  if(!CAP.dl){toast("Download indisponível aqui.");return}
  try{await CAP.dl.save({filename:nome,data:html});toast("Folha baixada. Abra o arquivo para imprimir ou salvar em PDF.")}catch(e){if(e&&e.code!=="declined")toast("Não foi possível baixar a folha.")}}

/* --- revisão espaçada: fórmulas e passos --- */
function cartoesCiencias(S,R,g,base,id,onde,pgi){const out=[];
  if(R.formulas)arr(g.formulas).forEach((F,k)=>{if(sinal(S,"f"+k))return;
    out.push({id:`${base}:f:${norm(F.latex).slice(0,40)}`,est:id,sec:S.n,tipo:"Fórmula",onde,pg:pgi(F.p),
      frente:`<p>Escreva de memória: <b>${esc(F.nome)}</b>.</p><p class="note">O que significa cada símbolo? Quando ela vale?</p>`,
      verso:`<div class="eq">\\[${esc(F.latex)}\\]</div><ul>${F.simb.map(z=>`<li>\\(${esc(z.s)}\\): ${esc(z.m)}${z.u?` (${esc(z.u)})`:""}</li>`).join("")}</ul>${F.vale?`<p class="note">${esc(F.vale)}</p>`:""}`,
      texto:S.pars[F.p]?S.pars[F.p].t:""})});
  if(R.deducao)arr(g.deducao).forEach((D,k)=>{if(sinal(S,"d"+k))return;
    out.push({id:`${base}:d${k}`,est:id,sec:S.n,tipo:"Passo a passo",onde,pg:pgi(D.p),frente:`<p>Quais são os passos de <b>${esc(D.titulo)}</b>?</p>`,
      verso:`<ol>${D.passos.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`,texto:S.pars[D.p]?S.pars[D.p].t:""})});
  return out}

iniciarTex();
