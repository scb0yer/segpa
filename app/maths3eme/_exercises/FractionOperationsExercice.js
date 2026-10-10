"use client";
import {useEffect,useRef,useState} from "react";
import {useStudent} from "../_components/StudentProvider";
import {ClassContribution} from "../_components/WeeklyProgress";
import {exercises} from "../_lib/config";
import {modes,makeSeries,checkMultipliers,checkRewritten,checkAnswer,SERIES_LENGTH} from "./fraction-operations-engine.mjs";
import s from "../maths.module.css";
import f from "./fraction-operations.module.css";
const noop=()=>{};
const points=n=>(n/10).toLocaleString("fr-FR");
function Fraction({top,bottom,label}){return <span className={f.fraction} role="group" aria-label={label}><span>{top}</span><span>{bottom}</span></span>;}
export default function FractionOperationsExercice({onDirtyChange=noop,onSavingChange=noop,onBack,initialMode="same"}){
 const {student,checking,recordAttempt,refresh,openPanel}=useStudent();
 const [mode,setMode]=useState(()=>modes.some(m=>m.id===initialMode)?initialMode:"same");
 const firstMode=useRef(mode),[series,setSeries]=useState(null),[index,setIndex]=useState(0);
 const [values,setValues]=useState({});
 const [stage,setStage]=useState(0);
 const [numerator,setNumerator]=useState(""),[denominator,setDenominator]=useState("");
 const [problemDone,setProblemDone]=useState(false),[feedback,setFeedback]=useState(null);
 const [score,setScore]=useState(0),[started,setStarted]=useState(false),[finished,setFinished]=useState(false);
 const [saveState,setSaveState]=useState("idle"),[saving,setSaving]=useState(false),[message,setMessage]=useState(""),[contribution,setContribution]=useState(null);
 const owner=useRef(undefined),scoreRef=useRef(0),hadMistake=useRef(false),saveLock=useRef(false),answerLock=useRef(false),nextLock=useRef(false),pending=useRef(null),input=useRef(null);
 const total=SERIES_LENGTH;
 useEffect(()=>{setSeries(makeSeries(firstMode.current));},[]);
 useEffect(()=>{onDirtyChange(started&&(!finished||saveState!=="saved"));},[started,finished,saveState,onDirtyChange]);
 useEffect(()=>{nextLock.current=false;if(index>0||stage>0)input.current?.focus();},[index,stage]);
 function begin(){if(owner.current===undefined)owner.current=student?.id||null;setStarted(true);}
 function change(setter,value){begin();setter(value);}
 function clearProblem(){setValues({});setStage(0);setNumerator("");setDenominator("");setProblemDone(false);setFeedback(null);hadMistake.current=false;answerLock.current=false;}
 function restart(nextMode=mode){
  if(saveLock.current)return;
  if(started&&(!finished||saveState!=="saved")&&!window.confirm("Recommencer ? La série en cours ou non enregistrée sera perdue."))return;
  setMode(nextMode);setSeries(makeSeries(nextMode));setIndex(0);clearProblem();setScore(0);scoreRef.current=0;setStarted(false);setFinished(false);setSaveState("idle");setMessage("");setContribution(null);owner.current=undefined;pending.current=null;nextLock.current=false;
 }
 function validate(e){e.preventDefault();if(checking||answerLock.current)return;begin();const p=series[index];
  if(mode!=="same"&&stage<2){
   const correct=stage===0?checkMultipliers(p,values):checkRewritten(p,values);
   if(!correct){hadMistake.current=true;setFeedback({good:false,text:stage===0
    ? `Pour conserver la valeur d’une fraction, multiplie le haut et le bas par le même nombre. Le dénominateur visé est ${p.common}.`
    : "Effectue chaque multiplication au numérateur et au dénominateur, puis réécris les nombres obtenus dans les cases."});return;}
   setStage(v=>v+1);setFeedback({good:true,text:stage===0?"Les multiplicateurs sont corrects. Effectue maintenant les multiplications et réécris les fractions.":"Les dénominateurs sont identiques. Calcule avec les numérateurs et conserve le dénominateur commun."});return;
  }
  if(!checkAnswer(p,numerator,denominator)){hadMistake.current=true;setFeedback({good:false,text:`Calcule ${p.top1} ${p.operation} ${p.top2} au numérateur, et conserve ${p.common} au dénominateur. Tu peux corriger et réessayer.`});return;}
  answerLock.current=true;setProblemDone(true);if(!hadMistake.current){scoreRef.current++;setScore(scoreRef.current);}setFeedback({good:true,text:"Bravo ! Ta fraction est correcte. Une fraction équivalente, simplifiée ou non, convient aussi."});
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
    const exerciceId = exercises.fractionOperations?.exerciceIds?.[mode];
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
 if(!series)return <p role="status">Préparation de la série…</p>;
 const p=series[index],completed=finished?total:index+(problemDone?1:0);
 const field=(label,value,setter,focus=false)=><input ref={focus?input:undefined} aria-label={label} value={value} inputMode="numeric" autoComplete="off" maxLength={6} required disabled={checking||problemDone} onChange={e=>change(setter,e.target.value)} />;
 const box=(name,label,focus=false)=>field(label,values[name]||"",v=>setValues(old=>({...old,[name]:v})),focus);
 function transformedFraction(side){
  const first=side==="left",n=first?p.n1:p.n2,d=first?p.d1:p.d2;
  const name=first?"première":"seconde",factor=p.common/d;
  if(factor===1)return <Fraction top={n} bottom={d} label={`${n} sur ${d}, inchangée`}/>;
  const focus=first||p.d1===p.common;
  if(stage===0)return <Fraction
   top={<span className={f.product}>{n} × {box(`${side}FactorTop`,`Multiplicateur du numérateur de la ${name} fraction`,focus)}</span>}
   bottom={<span className={f.product}>{d} × {box(`${side}FactorBottom`,`Multiplicateur du dénominateur de la ${name} fraction`)}</span>}/>;
  return <Fraction top={box(`${side}Top`,`Numérateur réécrit de la ${name} fraction`,focus)} bottom={box(`${side}Bottom`,`Dénominateur réécrit de la ${name} fraction`)}/>;
 }
 return <>
  <nav className={s.tabs} aria-label="Niveaux de calculs de fractions">{modes.map(m=><button type="button" key={m.id} disabled={saving} className={`${s.tab} ${mode===m.id?s.active:""}`} aria-pressed={mode===m.id} onClick={()=>m.id!==mode&&restart(m.id)}>{m.label}</button>)}</nav>
  <div className={s.bar}><b>{finished?"Série terminée":`Calcul ${index+1} / ${total}`}</b><progress className={s.progress} value={completed} max={total} aria-label="Avancement de la série"/><span className={s.score}>{score} / {completed}</span></div>
  {finished?<section className={s.card}><h2>Série terminée : {score}/{total}</h2><p>{score===total?"Bravo, tu as réussi les cinq calculs sans erreur !":"Chaque entraînement t’aide à progresser. Tu peux réessayer !"}</p><p role="status">{message}</p><ClassContribution contribution={contribution}/><div className={s.actions}>
   {saveState==="error"&&<button className={s.primary} disabled={saving} onClick={save}>Réessayer l’enregistrement</button>}
   <button className={s.primary} disabled={saving} onClick={()=>restart()}>Nouvelle série</button><button className={s.secondary} disabled={saving} onClick={openPanel}>Voir ma progression</button>{onBack&&<button className={s.secondary} disabled={saving} onClick={onBack}>Retour aux activités</button>}
  </div></section>:<section className={s.card} aria-label="Calcul de fractions">
   <h2>Additionner ou soustraire des fractions</h2><p className={s.muted}>La calculatrice est disponible avec le bouton en haut. Tu peux corriger tes erreurs ; le point de bonne réponse compte si tu réussis toutes les étapes du premier coup.</p>
   <div className={f.operation}><Fraction top={p.n1} bottom={p.d1} label={`${p.n1} sur ${p.d1}`}/><b>{p.operation}</b><Fraction top={p.n2} bottom={p.d2} label={`${p.n2} sur ${p.d2}`}/></div>
   <div className={f.help}>{mode==="same"?"Les dénominateurs sont identiques : additionne ou soustrais les numérateurs et conserve le dénominateur.":mode==="multiple"?"Choisis le plus grand dénominateur. Multiplie le haut et le bas de l’autre fraction par 2 ou par 3.":"Multiplie les deux dénominateurs. Pour chaque fraction, multiplie aussi son numérateur par le dénominateur de l’autre fraction."}</div>
   <form onSubmit={validate}>
    {mode!=="same"&&stage<2?<>
     <h3>Étape {stage+1} sur 3 · {stage===0?"Compléter les multiplicateurs":"Réécrire les fractions"}</h3>
     <p>{stage===0?"Écris le multiplicateur dans chaque case, en haut et en bas.":"Calcule les produits, puis complète le numérateur et le dénominateur de chaque fraction transformée."}</p>
     {stage===1&&<div className={f.worked}>{["left","right"].map((side,i)=>{const n=i?p.n2:p.n1,d=i?p.d2:p.d1,k=p.common/d;return <span key={side}>{i>0&&<b> {p.operation} </b>}<Fraction top={k===1?n:`${n} × ${k}`} bottom={k===1?d:`${d} × ${k}`}/></span>;})}</div>}
     <div className={f.operation}>{transformedFraction("left")}<b>{p.operation}</b>{transformedFraction("right")}</div>
    </>:<>
     {mode!=="same"&&<h3>Étape 3 sur 3 · Calculer le résultat</h3>}
     {mode!=="same"&&<div className={f.operation}><Fraction top={p.top1} bottom={p.common}/><b>{p.operation}</b><Fraction top={p.top2} bottom={p.common}/></div>}
     <p>Écris la fraction résultat. Tu peux la simplifier, mais ce n’est pas obligatoire.</p><div className={f.operation}><span>=</span><Fraction top={field("Numérateur du résultat",numerator,setNumerator,true)} bottom={field("Dénominateur du résultat",denominator,setDenominator)}/></div>
    </>}
    {!problemDone&&<button type="submit" className={s.primary} disabled={checking}>{mode==="same"||stage===2?"Valider le résultat":stage===0?"Valider les multiplicateurs":"Valider les fractions"}</button>}
   </form>
   {feedback&&<p role="status" className={feedback.good?f.good:f.warning}>{feedback.text}</p>}
   {problemDone&&<button type="button" className={s.primary} onClick={next}>{index===total-1?"Voir mon résultat":"Calcul suivant →"}</button>}
  </section>}
 </>;
}
