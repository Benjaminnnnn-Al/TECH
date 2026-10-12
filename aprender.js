(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const subjects = {
    biologia:{name:'Biología',icon:'fa-dna',desc:'Descubre cómo funciona la vida.',guide:'🧑🏽‍🔬',lessons:[['La célula y su importancia','La célula es la unidad básica de los seres vivos.'],['Ecosistemas','Un ecosistema reúne seres vivos y el ambiente donde interactúan.'],['Cuerpo humano','Los sistemas del cuerpo trabajan coordinadamente para mantenernos vivos.']]},
    quimica:{name:'Química',icon:'fa-flask-vial',desc:'Explora la materia y sus transformaciones.',guide:'👩🏻‍🔬',lessons:[['La materia','Todo lo que tiene masa y ocupa espacio es materia.'],['Átomos y elementos','Los elementos están formados por átomos de un mismo tipo.'],['Cambios químicos','En una reacción química se forman sustancias nuevas.']]},
    fisica:{name:'Física',icon:'fa-bolt',desc:'Comprende el movimiento, las fuerzas y la energía.',guide:'🧑🏽‍🏫',lessons:[['Movimiento','Describir el movimiento implica observar cómo cambia la posición con el tiempo.'],['Fuerzas','Una fuerza puede cambiar el movimiento o deformar un objeto.'],['Energía','La energía permite producir cambios y se transforma de distintas maneras.']]},
    tierra:{name:'Ciencias de la Tierra',icon:'fa-earth-americas',desc:'Conoce nuestro planeta y cómo cuidarlo.',guide:'👩🏽‍🚀',lessons:[['Capas de la Tierra','La Tierra se organiza en corteza, manto y núcleo.'],['Clima y tiempo','El tiempo describe condiciones momentáneas; el clima resume patrones de largo plazo.'],['Cuidado ambiental','Reducir residuos y proteger los ecosistemas ayuda a conservar recursos.']]}
  };
  const KEY='innovaboard-progreso-v1';
  let done={}; try{done=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){done={}}
  let activeSubject='biologia', activeLesson=0;
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){console.warn('No se pudo guardar el progreso local.',e)}};
  function toast(msg){const box=$('#toast-container');if(!box)return;const el=document.createElement('div');el.className='toast';el.textContent=msg;box.append(el);setTimeout(()=>el.remove(),2600)}
  function showView(name){
    const map={inicio:'vista-inicio',explorar:'vista-explorar',progreso:'vista-progreso-global',lecciones:'vista-lecciones',contenido:'vista-contenido'};
    Object.values(map).forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true});
    const target=document.getElementById(map[name]||map.inicio);if(target)target.hidden=false;
    $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    if(name==='progreso')renderProgress();
    window.scrollTo({top:0,behavior:'auto'});
  }
  function renderSubjects(){
    const grid=$('#vista-explorar .subject-grid');if(!grid)return;
    grid.innerHTML=Object.entries(subjects).map(([key,s])=>`<article class="subject-card" data-materia="${key}"><div class="subject-icon"><i class="fa-solid ${s.icon}"></i></div><div class="subject-copy"><span>ÁREA DE CIENCIAS</span><h2>${s.name}</h2><p>${s.desc}</p></div><div class="subject-bottom"><span>${s.lessons.length} lecciones</span><button class="subject-open" data-materia="${key}">Explorar →</button></div><div class="subject-progress"><div>${progressFor(key)}% completado</div><div class="mini-track"><span style="width:${progressFor(key)}%"></span></div></div></article>`).join('');
  }
  function progressFor(key){const s=subjects[key];return Math.round(s.lessons.filter((_,i)=>done[key+'-'+i]).length/s.lessons.length*100)}
  function renderLessons(key){activeSubject=subjects[key]?key:'biologia';const s=subjects[activeSubject];const icon=$('#materia-activa-icono');if(icon)icon.innerHTML=`<i class="fa-solid ${s.icon}"></i>`;const name=$('#materia-activa-nombre');if(name)name.textContent=s.name;const desc=$('#materia-activa-desc');if(desc)desc.textContent=s.desc;const guide=$('#area-guide-character');if(guide)guide.textContent=s.guide;const title=$('#area-guide-title');if(title)title.textContent=`¡Vamos a descubrir ${s.name.toLowerCase()}!`;const message=$('#area-guide-message');if(message)message.textContent='Elige una lección y avanza a tu ritmo.';const list=$('#lecciones-lista');if(list)list.innerHTML=s.lessons.map((l,i)=>`<button class="lesson-item" data-lesson="${i}"><small>LECCIÓN ${i+1} · ${done[activeSubject+'-'+i]?'COMPLETADA':'POR EXPLORAR'}</small><h3>${l[0]}</h3><p>${l[1]}</p></button>`).join('');const pct=progressFor(activeSubject);const pctEl=$('#progreso-materia-porcentaje');if(pctEl)pctEl.textContent=pct+'%';const fill=$('#progreso-materia-fill');if(fill)fill.style.width=pct+'%';showView('lecciones')}
  function renderLesson(i){activeLesson=Number(i)||0;const s=subjects[activeSubject],l=s.lessons[activeLesson];if(!l)return;const article=$('#contenido-leccion');if(article)article.innerHTML=`<span class="eyebrow">${s.name.toUpperCase()} · LECCIÓN ${activeLesson+1}</span><h1>${l[0]}</h1><p>${l[1]}</p><h2>Idea clave</h2><p>Relaciona este concepto con ejemplos de tu vida diaria. Explicarlo con tus propias palabras es una buena forma de comprobar lo que has aprendido.</p><button class="btn-primary" id="mark-complete">${done[activeSubject+'-'+activeLesson]?'Lección completada ✓':'Marcar como completada ✓'}</button>`;showView('contenido');const btn=$('#mark-complete');if(btn)btn.addEventListener('click',()=>{done[activeSubject+'-'+activeLesson]=true;save();btn.textContent='Lección completada ✓';toast('¡Progreso guardado en este dispositivo!')})}
  function renderProgress(){const total=Object.values(subjects).reduce((n,s)=>n+s.lessons.length,0);const completed=Object.keys(done).filter(k=>done[k]).length;const pct=Math.round(completed/total*100);[['resumen-porcentaje',pct+'%'],['resumen-detalle',`${completed} de ${total} lecciones`],['home-progress',pct+'%'],['home-completed',completed],['nav-profile-name',getUser()?.name||'Iniciar sesión']].forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.textContent=val});const fill=$('#progreso-global-fill');if(fill)fill.style.width=pct+'%';const grid=$('#progreso-global-materias');if(grid)grid.innerHTML=Object.entries(subjects).map(([k,s])=>`<div><b>${s.name}</b><p>${progressFor(k)}% completado</p><div class="mini-track"><span style="width:${progressFor(k)}%"></span></div></div>`).join('');renderSubjects()}
  function getUser(){try{return JSON.parse(localStorage.getItem('innovaboard-profile')||'null')}catch(_){return null}}
  function setModal(id,open){const m=document.getElementById(id);if(m)m.classList.toggle('open',open)}
  function init(){
    renderSubjects();
    $$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
    const heroExplore=$('#hero-explore');if(heroExplore)heroExplore.addEventListener('click',()=>showView('explorar'));
    const heroProgress=$('#hero-progress');if(heroProgress)heroProgress.addEventListener('click',()=>showView('progreso'));
    const brand=$('#brand-home');if(brand)brand.addEventListener('click',e=>{e.preventDefault();showView('inicio')});
    const exploreBack=$('#explore-back');if(exploreBack)exploreBack.addEventListener('click',()=>showView('inicio'));
    const backSubjects=$('#btn-volver-materias');if(backSubjects)backSubjects.addEventListener('click',()=>showView('explorar'));
    const backLessons=$('#btn-volver-lecciones');if(backLessons)backLessons.addEventListener('click',()=>renderLessons(activeSubject));
    document.addEventListener('click',e=>{const m=e.target.closest('[data-materia]');if(m){const key=m.dataset.materia;if(subjects[key])renderLessons(key);return}const lesson=e.target.closest('[data-lesson]');if(lesson){renderLesson(lesson.dataset.lesson);return}if(e.target.closest('[data-close-account]')){setModal('login-modal',false);setModal('profile-modal',false)}});
    const login=$('#login-form');if(login)login.addEventListener('submit',e=>{e.preventDefault();const name=$('#login-name')?.value.trim();const email=$('#login-email')?.value.trim();const group=$('#login-group')?.value.trim();if(!name||!email)return;try{localStorage.setItem('innovaboard-profile',JSON.stringify({name,email,group}))}catch(_){}setModal('login-modal',false);renderProgress();toast('¡Bienvenido a InnovaBoard!')});
    const openProfile=$('#btn-open-profile');if(openProfile)openProfile.addEventListener('click',()=>{const u=getUser();if(!u){setModal('login-modal',true);return}const fields={'profile-title':u.name,'profile-welcome':'Tu laboratorio personal','profile-name':u.name,'profile-email':u.email,'profile-group':u.group||'—','profile-lessons':Object.keys(done).filter(k=>done[k]).length,'profile-big-avatar':u.name.charAt(0).toUpperCase(),'nav-profile-name':u.name,'nav-profile-avatar':u.name.charAt(0).toUpperCase()};Object.entries(fields).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});setModal('profile-modal',true)});
    const closeProfile=$('#profile-close-btn');if(closeProfile)closeProfile.addEventListener('click',()=>setModal('profile-modal',false));
    const logout=$('#logout-btn');if(logout)logout.addEventListener('click',()=>{try{localStorage.removeItem('innovaboard-profile')}catch(_){}setModal('profile-modal',false);renderProgress();toast('Sesión cerrada')});
    const reset=$('#btn-reset-progreso');if(reset)reset.addEventListener('click',()=>{if(confirm('¿Reiniciar el progreso guardado?')){done={};save();renderProgress();toast('Progreso reiniciado')}});
    const quick=$('#quick-last');if(quick)quick.addEventListener('click',()=>renderLessons(activeSubject));
    renderProgress();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
