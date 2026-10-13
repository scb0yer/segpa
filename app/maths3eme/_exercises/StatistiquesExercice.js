"use client";
import {useEffect,useRef,useState} from "react";
import {useStudent} from "../_components/StudentProvider";
import {ClassContribution} from "../_components/WeeklyProgress";
import {exercises} from "../_lib/config";
import {modes,makeSeries,checkAnswer,SERIES_LENGTH} from "./statistics-engine.mjs";
import s from "../maths.module.css";
import t from "./statistics.module.css";
const noop=()=>{};
const points=n=>(n/10).toLocaleString("fr-FR");
export default function StatistiquesExercice({onDirtyChange=noop,onSavingChange=noop,onBack,initialMode="frequency"}){
 const {student,checking,recordAttempt,refresh,openPanel}=useStudent();
 const [mode,setMode]=useState(()=>modes.some(m=>m.id===initialMode)?initialMode:"frequency");
 const firstMode=useRef(mode),[series,setSeries]=useState(null),[index,setIndex]=useState(0);
 const [answer,setAnswer]=useState(""),[showHelp,setShowHelp]=useState(false),[showSorted,setShowSorted]=useState(false);
 const [problemDone,setProblemDone]=useState(false),[feedback,setFeedback]=useState(null);
 const [score,setScore]=useState(0),[started,setStarted]=useState(false),[finished,setFinished]=useState(false);
 const [saveState,setSaveState]=useState("idle"),[saving,setSaving]=useState(false),[message,setMessage]=useState(""),[contribution,setContribution]=useState(null);
 const owner=useRef(undefined),scoreRef=useRef(0),hadMistake=useRef(false),saveLock=useRef(false),answerLock=useRef(false),nextLock=useRef(false),pending=useRef(null),input=useRef(null);
 const total=SERIES_LENGTH;
 useEffect(()=>{setSeries(makeSeries(firstMode.current));},[]);
 useEffect(()=>{onDirtyChange(started&&(!finished||saveState!=="saved"));},[started,finished,saveState,onDirtyChange]);
 useEffect(()=>{nextLock.current=false;if(index>0)input.current?.focus();},[index]);
 function begin(){if(owner.current===undefined)owner.current=student?.id||null;setStarted(true);}
 function clearProblem(){setAnswer("");setShowHelp(false);setShowSorted(false);setProblemDone(false);setFeedback(null);hadMistake.current=false;answerLock.current=false;}
 function restart(nextMode=mode){
  if(saveLock.current)return;
  if(started&&(!finished||saveState!=="saved")&&!window.confirm("Recommencer ? La série en cours ou non enregistrée sera perdue."))return;
  setMode(nextMode);setSeries(makeSeries(nextMode));setIndex(0);clearProblem();setScore(0);scoreRef.current=0;setStarted(false);setFinished(false);setSaveState("idle");setMessage("");setContribution(null);owner.current=undefined;pending.current=null;nextLock.current=false;
 }
 function validate(e){e.preventDefault();if(checking||answerLock.current)return;
  const p=series[index],result=checkAnswer(p,answer);
  if(!result.valid){setFeedback({good:false,text:"Écris un nombre. Tu peux utiliser une virgule pour les décimales."});return;}
  begin();
  if(!result.correct){hadMistake.current=true;setShowHelp(true);setFeedback({good:false,text:"Pas encore. "+p.explanation+" Corrige ta réponse pour continuer."});return;}
  answerLock.current=true;setProblemDone(true);if(!hadMistake.current){scoreRef.current++;setScore(scoreRef.current);}
  setFeedback({good:true,text:"Bonne réponse ! "+p.explanation});
 }
  async function save() {
    if (saveLock.current || saveState === "saved") return;
    if (!owner.current) {
      setSaveState("guest");
      setMessage("Série terminée sans connexion. Connecte-toi avant de commencer la prochaine série pour l'enregistrer.");
      return;
    }
    if (student?.id !== owner.current) {
      setSaveState("error");
      setMessage("Reconnecte-toi avec le compte qui a commencé cette série, puis réessaie.");
      return;
    }
    const exerciceId = exercises.statistics?.exerciceIds?.[mode];
    if (!/^[a-f0-9]{24}$/i.test(exerciceId || "")) {
      setSaveState("unconfigured");
      setMessage("L'enregistrement de cette activité n'est pas encore activé. Tu peux continuer à t'entraîner.");
      return;
    }
    saveLock.current = true; setSaving(true); onSavingChange(true); setSaveState("saving");
    setMessage("Enregistrement…");
    try {
      // Le même identifiant est conservé après une erreur réseau pour éviter
      // de compter deux fois une série déjà enregistrée par le serveur.
      if (!pending.current) pending.current = {
        exerciceId, score: scoreRef.current, maxScore: total, submissionId: crypto.randomUUID(),
      };
      const result = await recordAttempt(pending.current);
      const reward = result?.reward;
      setContribution(!result?.replayed ? reward?.weeklyContribution || null : null);
      let confirmation = "Ta série est enregistrée !";
      if (reward) {
        if (result.replayed) confirmation = `Cette série était déjà enregistrée : aucun point ajouté une seconde fois. Total : ${points(reward.totalTenths)} points.`;
        else {
          confirmation = reward.creditedTenths > 0
            ? `+${points(reward.creditedTenths)} point${reward.creditedTenths > 10 ? "s" : ""} ! Ta série est enregistrée. `
            : "Ta série est enregistrée. ";
          confirmation += reward.remainingTenths === 0
            ? "Tu as gagné ton point du jour sur ce thème ! Tu peux continuer à t'entraîner ou essayer un autre thème."
            : `Il te reste ${points(reward.remainingTenths)} point à gagner sur ce thème aujourd'hui.`;
          confirmation += ` Total personnel : ${points(reward.totalTenths)} points.`;
        }
      }
      setSaveState("saved"); setMessage(confirmation);
      try { await refresh(); }
      catch { setMessage(confirmation + " Le tableau de bord sera actualisé plus tard."); }
    } catch (error) {
      setSaveState("error");
      setMessage(`Enregistrement non confirmé. ${error.message}`);
    } finally { saveLock.current = false; setSaving(false); onSavingChange(false); }
  }



 function next(){if(!problemDone||nextLock.current||saveLock.current)return;nextLock.current=true;if(index+1===total){setFinished(true);void save();return;}clearProblem();setIndex(v=>v+1);}
 if(!series)return <p role="status">Préparation des statistiques…</p>;
 const p=series[index],selected=modes.find(m=>m.id===mode),completed=finished?total:index+(problemDone?1:0);
 return <>
  <nav className={s.tabs} aria-label="Exercices de statistiques">{modes.map(m=><button type="button" key={m.id} disabled={saving} className={`${s.tab} ${mode===m.id?s.active:""}`} aria-pressed={mode===m.id} onClick={()=>m.id!==mode&&restart(m.id)}>{m.label} · niveau {m.difficulty}</button>)}</nav>
  <div className={s.bar}><b>{finished?"Série terminée":`Calcul ${index+1} / ${total}`}</b><progress className={s.progress} value={completed} max={total} aria-label="Avancement de la série"/><span className={s.score}>{score} / {completed}</span></div>
  {finished?<section className={s.card}><h2>Série terminée : {score}/{total}</h2><p>{score===total?"Bravo, tu as réussi les cinq calculs sans erreur !":"Tu as terminé la série. Chaque entraînement t’aide à progresser !"}</p><p role="status">{message}</p><ClassContribution contribution={contribution}/><div className={s.actions}>
   {saveState==="error"&&<button className={s.primary} disabled={saving} onClick={save}>Réessayer l’enregistrement</button>}
   <button className={s.primary} disabled={saving} onClick={()=>restart()}>Nouvelle série</button><button className={s.secondary} disabled={saving} onClick={openPanel}>Voir ma progression</button>{onBack&&<button className={s.secondary} disabled={saving} onClick={onBack}>Retour aux activités</button>}
  </div></section>:<section className={s.card} aria-label="Exercice de statistiques">
   <span className={t.badge}>Niveau {selected.difficulty} · {selected.label}</span>
   <h2>{p.prompt}</h2>
   <p className={s.muted}>Utilise la calculatrice si tu en as besoin, puis écris ta réponse. Tu peux faire les calculs en plusieurs étapes.</p>
   <div className={t.data} role="group" aria-label="Série de valeurs"><p className={t.dataTitle}>Les données</p><p className={t.values}>{p.values.join(" ; ")}</p></div>
   <div className={t.reminder}>{p.reminder}</div>
   <div className={s.actions}>
    <button type="button" className={s.secondary} aria-expanded={showHelp} onClick={()=>setShowHelp(v=>!v)}>{showHelp?"Masquer l’aide":"Afficher une aide"}</button>
    {mode==="median"&&<button type="button" className={s.secondary} aria-expanded={showSorted} onClick={()=>setShowSorted(v=>!v)}>{showSorted?"Masquer la série rangée":"M’aider à ranger les valeurs"}</button>}
   </div>
   {showHelp&&<p className={t.help}>{p.hint}</p>}
   {mode==="median"&&showSorted&&<div className={t.data} role="group" aria-label="Série rangée"><p className={t.dataTitle}>Ordre croissant</p><p className={t.values}>{p.sorted.join(" ; ")}</p></div>}
   <form onSubmit={validate} className={t.form}>
    <label htmlFor="statistics-answer">Ma réponse{mode==="frequency"?" en pourcentage":""}</label>
    <div className={t.answer}><input ref={input} id="statistics-answer" value={answer} required maxLength={18} inputMode="decimal" autoComplete="off" disabled={checking||problemDone} aria-describedby="statistics-rounding" onChange={e=>{begin();setAnswer(e.target.value);}}/>{p.unit&&<span>{p.unit}</span>}{!problemDone&&<button type="submit" className={s.primary} disabled={checking}>Valider ma réponse</button>}</div>
    <p id="statistics-rounding" className={s.muted}>{mode==="frequency"||mode==="mean"?"Si nécessaire, arrondis au dixième : un chiffre après la virgule.":mode==="median"?"La médiane peut être un nombre à virgule.":"Soustrais la plus petite valeur à la plus grande."}</p>
   </form>
   {feedback&&<p role="status" className={feedback.good?t.good:t.warning}>{feedback.text}</p>}
   {problemDone&&<button type="button" className={s.primary} onClick={next}>{index===total-1?"Voir mon résultat":"Calcul suivant →"}</button>}
  </section>}
 </>;
}
