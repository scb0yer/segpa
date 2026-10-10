"use client";
import {useEffect,useRef,useState} from 'react';
import {initialCalculator,press} from './calculator-engine.mjs';
import c from './calculator.module.css';
const keys=['AC','DEL','ANS','(',')','7','8','9','÷','×','4','5','6','+','−','1','2','3',',','EXE','0'];
export default function Calculator(){
 const [open,setOpen]=useState(false),[state,setState]=useState(initialCalculator);
 const button=useRef(null),screen=useRef(null);
 useEffect(()=>{if(open)screen.current?.focus();},[open]);
 const close=()=>{setOpen(false);button.current?.focus();};
 function keyboard(e){
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
  if(e.target.tagName==='BUTTON'&&(e.key==='Enter'||e.key===' '))return;
  const mapping={'Enter':'EXE','Backspace':'DEL','Delete':'AC','*':'×','/':'÷','-':'−'};
  const key=mapping[e.key]||e.key;
  if(keys.includes(key)||key==='.'){e.preventDefault();setState(s=>press(s,key));}
 }
 return <>
  <button ref={button} type="button" className={c.toggle} aria-expanded={open} aria-controls="maths-calculator" onClick={()=>open?close():setOpen(true)} title="Ouvrir la calculatrice"><svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8v4H8zM8 14h2m4 0h2m-8 4h2m4 0h2"/></svg><span>Calculatrice</span></button>
  {open&&<aside id="maths-calculator" className={c.popup} role="dialog" aria-modal="false" aria-label="Calculatrice d’entraînement" onKeyDown={keyboard}>
   <div className={c.toolbar}><span>Ma calculatrice</span><button type="button" onClick={close} aria-label="Fermer la calculatrice">✕</button></div>
   <div className={c.calc}><div className={c.brand}>CASIO<small>fx-92+ · calculatrice d’entraînement</small></div>
    <div className={c.screen}><label htmlFor="calculator-screen">Calcul</label><input ref={screen} id="calculator-screen" readOnly value={state.expression||'0'} aria-label="Calcul saisi"/><output aria-live="polite">{state.result}</output><small>EXE pour calculer · ANS pour réutiliser</small></div>
    <div className={c.pad}>{keys.map(key=><button type="button" key={key} className={`${c.key} ${key==='ANS'?c.blue:''} ${key==='0'?c.wide:''}`} onClick={()=>setState(s=>press(s,key))}>{key}</button>)}</div>
    {state.history.length>0&&<details className={c.history}><summary>Historique des calculs</summary>{state.history.map((row,i)=><div key={i}>{row}</div>)}</details>}
   </div><p className={c.hint}>Après EXE, une opération repart du résultat. Recopie ensuite ta réponse dans l’exercice.</p>
  </aside>}
 </>;
}
