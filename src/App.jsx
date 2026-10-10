import {useEffect,useRef,useState} from 'react'
import {works,about,school,SITE} from './data'
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n))
const DEF={theme:'dark',accent:'#e8553d',grain:true,cursor:true,wobble:true}
const NAV=[['home','Home'],['school','School'],['portfolio','Portfolio'],['contact','Contact']]

function Ph({src,label='photo goes here'}){return src?<img className="ph" src={src} alt=""/>:<div className="ph blank"><span>{label}</span></div>}

export default function App(){
 const [s,setS]=useState(()=>{try{return {...DEF,...JSON.parse(localStorage.getItem('norii')||'{}')}}catch{return DEF}})
 const [menu,setMenu]=useState(false),[film,setFilm]=useState(null),[active,setActive]=useState('home'),[toast,setToast]=useState('')
 const wrap=useRef(),stage=useRef(),track=useRef(),bar=useRef(),cur=useRef(),dist=useRef(1),clicks=useRef(0)
 const set=o=>setS(p=>({...p,...o}))
 useEffect(()=>{const d=document.documentElement;d.dataset.theme=s.theme;d.dataset.wobble=s.wobble;d.dataset.grain=s.grain;d.style.setProperty('--accent',s.accent);localStorage.setItem('norii',JSON.stringify(s))},[s])

 // vertical scroll -> horizontal translate, 1px : 1px, so it stays perfectly in sync
 useEffect(()=>{
  const vw=()=>document.documentElement.clientWidth
  const top=()=>wrap.current.getBoundingClientRect().top+scrollY
  const update=()=>{const pr=clamp((scrollY-top())/dist.current,0,1);track.current.style.transform=`translate3d(${-pr*dist.current}px,0,0)`
   bar.current.style.transform=`scaleX(${pr})`;let a='home';if(scrollY>top()-innerHeight*.5){a='school';const x=pr*dist.current+vw()*.4
   NAV.slice(1).forEach(([id])=>{if(document.getElementById(id).offsetLeft<=x)a=id})};setActive(a)}
  const measure=()=>{dist.current=Math.max(1,track.current.scrollWidth-vw());wrap.current.style.height=dist.current+stage.current.offsetHeight+'px';update()}
  let raf;const on=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)}
  measure();document.fonts?.ready.then(measure);addEventListener('resize',measure);addEventListener('scroll',on,{passive:true})
  const k=e=>{if(film||e.target.closest('input,textarea'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft')scrollBy({top:(e.key==='ArrowRight'?1:-1)*innerWidth*.6,behavior:'smooth'})}
  addEventListener('keydown',k);return()=>{removeEventListener('resize',measure);removeEventListener('scroll',on);removeEventListener('keydown',k)}},[film])

 useEffect(()=>{if(!s.cursor)return;let x=0,y=0,cx=0,cy=0,raf;const mv=e=>{x=e.clientX;y=e.clientY;if(cur.current)cur.current.dataset.on=e.target.closest('[data-cur]')?.dataset.cur||''}
  const f=()=>{cx+=(x-cx)*.2;cy+=(y-cy)*.2;if(cur.current)cur.current.style.transform=`translate(${cx}px,${cy}px)`;raf=requestAnimationFrame(f)}
  addEventListener('mousemove',mv);f();return()=>{removeEventListener('mousemove',mv);cancelAnimationFrame(raf)}},[s.cursor])
 useEffect(()=>{document.body.style.overflow=film?'hidden':'';return()=>{document.body.style.overflow=''}},[film])
 useEffect(()=>{document.documentElement.classList.toggle('lock',!!film)},[film])
 useEffect(()=>{const k=e=>e.key==='Escape'&&(setFilm(null),setMenu(false));addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[])

 const go=id=>{if(id==='home')return scrollTo({top:0,behavior:'smooth'})
  const t=wrap.current.getBoundingClientRect().top+scrollY;scrollTo({top:t+clamp(document.getElementById(id).offsetLeft,0,dist.current),behavior:'smooth'})}
 const logo=()=>{clicks.current++;if(clicks.current%5===0){setToast('Take 2. Action!');setTimeout(()=>setToast(''),2200)}}

 return <>
  {s.cursor&&<div className="cursor" ref={cur}><i/></div>}
  <div className="grain"/><div className="progress"><div ref={bar}/></div>
  <header><a className="logo" data-cur="hi" onClick={logo}>NORII<small>FILMS</small></a>
   <nav>{NAV.map(([id,l])=><a key={id} data-cur="go" className={(active===id?'on ':'')+'n-'+id} onClick={()=>go(id)}>{l}</a>)}</nav>
   <button className="burger" aria-label="Settings" onClick={()=>setMenu(!menu)}><i/><i/><i/></button></header>

  {menu&&<aside className="settings"><h4>Settings <em>(Experimental)</em></h4>
   <div className="row">Mode<span><button className={s.theme==='dark'?'sel':''} onClick={()=>set({theme:'dark'})}>Dark</button><button className={s.theme==='light'?'sel':''} onClick={()=>set({theme:'light'})}>Light</button></span></div>
   <div className="row">Marker color<span>{['#e8553d','#f2c14e','#7bd389','#6ea8fe','#ff7ac6'].map(c=><button key={c} aria-label={c} className={'sw '+(s.accent===c?'sel':'')} style={{background:c}} onClick={()=>set({accent:c})}/>)}</span></div>
   {[['grain','Film grain'],['cursor','Fancy cursor'],['wobble','Wonky mode']].map(([k,l])=><label key={k} className="row">{l}<input type="checkbox" checked={s[k]} onChange={e=>set({[k]:e.target.checked})}/></label>)}
   <p>{s.wobble?'Wonky mode ON. Looks handmade on purpose.':'Boring professional mode. Are you sure?'}</p></aside>}

  <section id="home" className="hero"><div className="heroimg"><Ph src="/a.png"/></div>
   <div className="shade"/><div className="heroTxt"><p className="eyebrow">a very, very cool name: </p>
    <h1>NORII FILMS</h1><p className="tag">This is my portfolio which holds my projects and video edits.<span className="hand"> (sounds serious lol).</span></p>
    <button className="cta" data-cur="go" onClick={()=>go('portfolio')}>View my work <span>→</span></button></div>
   <div className="scroll"><span className="hand">psst, scroll down!</span><i>↓</i></div></section>

  <div ref={wrap} className="hwrap"><div className="stage" ref={stage}><div className="track" ref={track}>
   <section id="school" className="panel schoolP"><div className="head"><i/><h2>About</h2><span className="hand big">Saves you time from stalking, i guess</span></div>
    <div className="schoolGrid">
     <div className="idcard"><div className="idtop">STUDENT ID <small>valid until graduation (depende)</small></div><Ph src="/download (9).jpg"/><h3>{school.name}</h3><p className="typed">{school.program}</p><p className="typed">{school.years}</p><div className="barcode"/></div>
     <div className="report aboutCard"><h4 className="hand">Hi, I'm Prince Geibrylle</h4><p className="lead">{about.p1}</p><p>{about.p2}</p><div className="stamp hand">bisaya ta ha</div></div>
     <ol className="tline">{school.timeline.map(([y,t])=><li key={y}><b className="hand">{y}</b><span>{t}</span></li>)}</ol>
     <div className="postit clubs"><h5 className="hand">Clubs &amp; side quests:</h5><ul className="hand">{school.clubs.map(c=><li key={c}>{c}</li>)}</ul></div></div></section>

   <section id="portfolio" className="panel works"><div className="perf"/>
    <div className="head"><i/><h2>Featured works</h2><span className="hand big">Click one, or suntokan (jkjkk)</span></div>
    <div className="cards">{works.map((w,i)=><article key={i} className="card" data-cur="play" style={{'--r':[-2.2,1.4,-1,2.1][i%4]+'deg'}} onClick={()=>setFilm(w)}>
     <div className="tape"/><Ph src={w.image} label={`still #${i+1} goes here`}/><h3>{w.title}<span>↗</span></h3><p className="typed">{w.type}, {w.year}</p></article>)}</div>
    <p className="hand foot">← you came from there. no going back (jk, scroll up)</p></section>

   <section id="contact" className="panel contactP"><div className="head"><i/><h2>Contact</h2><span className="hand big">say hi, I reply (usually)</span></div><div className="contactRow"><Contact/><div className="elsewhere"><h5 className="hand">Or find me here:</h5>{SITE.socials.map(([n,u,h])=><a key={n} href={u} target="_blank" rel="noreferrer" data-cur="go"><b>{n}</b><span className="typed">{h}</span></a>)}<p className="hand">(Facebook page is the one with my mom as top fan)</p></div></div></section>
  </div></div></div>

  <footer><span>NORII FILMS ——— EST. {SITE.year}</span><span className="hand">Inquire now!</span><span>{SITE.socials.map(([n,u])=><a key={n} href={u} target="_blank" rel="noreferrer">{n}</a>)}</span></footer>
  {toast&&<div className="toast hand">{toast}</div>}
  {film&&<div className="modal" onClick={()=>setFilm(null)}><div className="dlg" onClick={e=>e.stopPropagation()}>
   <button className="x" onClick={()=>setFilm(null)}>close ✕</button>
   <div className="player">{film.video?<iframe src={film.video} title={film.title} allowFullScreen/>:<><Ph label="video / trailer goes here"/><b>▶</b></>}</div>
   <div className="info"><h3>{film.title}</h3><p className="typed">{film.type} / {film.year} / {film.role}</p><p>{film.desc}</p><p className="hand big">Note: {film.note}</p></div></div></div>}
 </>}

function Contact(){const [f,setF]=useState({name:'',email:'',message:'',website:''}),[st,setSt]=useState('idle')
 const ch=e=>setF({...f,[e.target.name]:e.target.value})
 const send=async e=>{e.preventDefault();setSt('sending');try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});if(!r.ok)throw 0;setSt('ok');setF({name:'',email:'',message:'',website:''})}catch{setSt('err')}}
 return <form className="note" onSubmit={send}><label>Your name<input name="name" value={f.name} onChange={ch} required maxLength={80}/></label>
  <label>Your email<input name="email" type="email" value={f.email} onChange={ch} required/></label>
  <input className="hp" name="website" value={f.website} onChange={ch} tabIndex={-1} autoComplete="off"/>
  <label>Message<textarea name="message" rows={5} value={f.message} onChange={ch} required maxLength={3000}/></label>
  <button className="cta" disabled={st==='sending'}>{st==='sending'?'Sending...':'Send it'} <span>✉</span></button>
  {st==='ok'&&<p className="hand big good">Sent! Check your inbox for my reply (give me a day).</p>}
  {st==='err'&&<p className="hand big bad">Server hiccup. Email me directly: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>}</form>}
