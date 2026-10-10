"use client";
import { useState } from "react";
import { useStudent } from "./StudentProvider";
import s from "./suggestions.module.css";

const labels = { discover: "À découvrir", practice: "Pour progresser", review: "À revoir" };
function explanation(item) {
  if (item.neverAttempted) return "Tu n'as pas encore essayé cette activité.";
  if (item.recentAveragePercentage === null) return "Une activité à reprendre pour faire le point.";
  const average = item.recentAveragePercentage.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  return `${average} % de bonnes réponses sur ${item.recentAttemptCount === 1
    ? "ta dernière série" : `tes ${item.recentAttemptCount} dernières séries`}.`;
}

export default function SuggestedActivities({ disabled = false }) {
  const { dashboard, launchActivity, closePanel } = useStudent();
  const [error, setError] = useState("");
  const suggestions = dashboard?.suggestions;
  if (!suggestions) return <section className={s.panel} aria-label="Mes activités conseillées">
    <h3>Mes activités conseillées</h3>
    <p>Les suggestions seront disponibles après la mise à jour du serveur.</p>
  </section>;

  function start(exerciceId) {
    setError("");
    const result = launchActivity(exerciceId);
    if (result === "opened") closePanel();
    else if (result === "saving") setError("Attends la fin de l'enregistrement de ta série.");
    else if (result === "unavailable") setError("Cette activité n'est pas disponible ici. Ouvre la page Maths 3ème.");
  }

  return <section className={s.panel} aria-labelledby="suggested-activities-title">
    <h3 id="suggested-activities-title">Mes activités conseillées aujourd'hui</h3>
    <p>Découvre une activité ou entraîne-toi sur ce qui te demande encore un peu de pratique.</p>
    {error && <p role="alert">{error}</p>}
    {suggestions.items.length ? <>
      <div className={s.grid}>
        {suggestions.items.map(item => <article className={s.card} key={item.exerciceId}>
          <span className={s.badge}>{labels[item.reason] || "À revoir"}</span>
          <h4>{item.name}</h4>
          <p>{explanation(item)}</p>
          {item.lastAttemptAt && <small>Dernière série : {new Date(item.lastAttemptAt).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })}</small>}
          <button type="button" className={s.start} disabled={disabled}
            aria-label={`Commencer : ${item.name}`} onClick={() => start(item.exerciceId)}>
            Commencer →
          </button>
        </article>)}
      </div>
      <p className={s.note}>Après chaque série enregistrée, tes suggestions s'actualisent.
        {suggestions.items.length === 1 ? " Il reste un thème à explorer aujourd'hui." : ""}</p>
    </> : <p className={s.empty}>{suggestions.totalActivities > 0
      ? "Tu as déjà pratiqué tous les thèmes disponibles aujourd'hui ! Tu peux continuer à t'entraîner librement et gagner des points dans la limite quotidienne."
      : "Aucune activité conseillée n'est disponible pour le moment."}</p>}
  </section>;
}
