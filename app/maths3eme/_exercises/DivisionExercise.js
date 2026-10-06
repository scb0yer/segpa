"use client";
import { useEffect, useRef, useState } from "react";
import { useStudent } from "../_components/StudentProvider";
import { exercises } from "../_lib/config";
import { equation, makeQuestion, modes } from "./division-engine.mjs";
import { ClassContribution } from "../_components/WeeklyProgress";
import s from "../maths.module.css";
function Division({ q }) {
  return (
    <div
      className={s.division}
      aria-label={`${q.dividend} divisé par ${q.divisor}, quotient ${q.quotient}, reste ${q.remainder}`}
    >
      <div className={s.dividend}>
        <div>{q.dividend}</div>
        <div className={s.sub}>− {q.divisor * q.quotient}</div>
        <div>{q.remainder}</div>
      </div>
      <div className={s.divisor}>
        <div>{q.divisor}</div>
        <div>{q.quotient}</div>
      </div>
    </div>
  );
}
export default function DivisionExercise({
  onDirtyChange,
  onSavingChange,
  onBack,
}) {
  const { student, checking, recordAttempt, refresh, openPanel } = useStudent();
  const [mode, setMode] = useState("equality");
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(null);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [message, setMessage] = useState("");
  const [contribution, setContribution] = useState(null);
  const answerLock = useRef(false);
  const saveLock = useRef(false);
  const owner = useRef(null);
  const pending = useRef(null);
  const { total, exerciceIds } = exercises.division;
  const exerciceId = exerciceIds[mode];
  const started = index > 0 || choice !== null;
  const saving = saveState === "saving";
  useEffect(() => {
    setQuestion(makeQuestion("equality"));
  }, []);
  useEffect(() => {
    onSavingChange(saving);
  }, [saving, onSavingChange]);
  useEffect(() => {
    onDirtyChange(started && (!finished || saveState !== "saved"));
  }, [started, finished, saveState, onDirtyChange]);
  function restart(nextMode = mode) {
    if (saveLock.current) return;
    if (
      started &&
      (!finished || saveState !== "saved") &&
      !window.confirm(
        "Recommencer ? La série en cours ou non enregistrée sera perdue.",
      )
    )
      return;
    setMode(nextMode);
    setIndex(0);
    setScore(0);
    setChoice(null);
    setFinished(false);
    setSaveState("idle");
    setMessage("");
    setContribution(null);
    pending.current = null;
    owner.current = null;
    answerLock.current = false;
    setQuestion(makeQuestion(nextMode));
  }
  function answer(value) {
    if (answerLock.current || finished || checking) return;
    answerLock.current = true;
    if (index === 0) owner.current = student?.id || null;
    setChoice(value);
    if (value === question.correct) setScore((previous) => previous + 1);
  }
  async function save() {
    if (saveLock.current || saveState === "saved") return;
    if (!owner.current) {
      setSaveState("guest");
      setMessage(
        "Série terminée sans connexion. Connecte-toi avant de commencer la prochaine série pour l'enregistrer.",
      );
      return;
    }
    if (student?.id !== owner.current) {
      setSaveState("error");
      setMessage(
        "Reconnecte-toi avec le compte qui a commencé cette série, puis réessaie.",
      );
      return;
    }
    if (!/^[a-f0-9]{24}$/i.test(exerciceId)) {
      setSaveState("unconfigured");
      setMessage(
        "L'enregistrement de cette activité n'est pas encore activé. Tu peux continuer à t'entraîner.",
      );
      return;
    }
    saveLock.current = true;
    setSaveState("saving");
    setMessage("Enregistrement…");
    try {
      // Le même identifiant est conservé lors de chaque nouvel essai d'envoi.
      if (!pending.current)
        pending.current = {
          exerciceId,
          score,
          maxScore: total,
          submissionId: crypto.randomUUID(),
        };
      const result = await recordAttempt(pending.current);
      const reward = result?.reward;
      setContribution(
        !result?.replayed ? reward?.weeklyContribution || null : null,
      );
      const format = (tenths) => (tenths / 10).toLocaleString("fr-FR");
      let confirmation = "Ta série est enregistrée !";
      if (reward) {
        if (result.replayed) {
          confirmation = `Cette série était déjà enregistrée : aucun point ajouté une seconde fois. Total : ${format(reward.totalTenths)} points.`;
        } else {
          const gain = reward.creditedTenths;
          confirmation =
            gain > 0
              ? `+${format(gain)} point${gain > 10 ? "s" : ""} ! Ta série est enregistrée. `
              : "Ta série est enregistrée. ";
          confirmation +=
            reward.remainingTenths === 0
              ? "Tu as gagné ton point du jour sur cet exercice ! Tu peux continuer à t'entraîner ou essayer une autre activité."
              : `Il te reste ${format(reward.remainingTenths)} point à gagner sur cet exercice aujourd'hui.`;
          confirmation += ` Total personnel : ${format(reward.totalTenths)} points.`;
        }
      }
      setSaveState("saved");
      setMessage(confirmation);
      try {
        await refresh();
      } catch {
        setMessage(
          confirmation + " Le tableau de bord sera actualisé plus tard.",
        );
      }
    } catch (error) {
      setSaveState("error");
      setMessage(`Enregistrement non confirmé. ${error.message}`);
    } finally {
      saveLock.current = false;
    }
  }
  function next() {
    if (choice === null || finished || saveLock.current) return;
    if (index + 1 === total) {
      setFinished(true);
      void save();
      return;
    }
    setIndex((previous) => previous + 1);
    setChoice(null);
    answerLock.current = false;
    setQuestion(makeQuestion(mode));
  }
  if (!question) return <p role="status">Préparation de la série…</p>;
  const { q, correct, target, choices } = question;
  const completed = finished ? total : index + (choice !== null ? 1 : 0);
  return (
    <>
      <nav className={s.tabs} aria-label="Type d'exercice">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${s.tab} ${mode === item.id ? s.active : ""}`}
            aria-pressed={mode === item.id}
            disabled={saving}
            onClick={() => {
              if (mode !== item.id) restart(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className={s.bar}>
        <b>
          {finished ? "Série terminée" : `Question ${index + 1} / ${total}`}
        </b>
        <progress
          className={s.progress}
          value={completed}
          max={total}
          aria-label="Avancement de la série"
        />
        <span className={s.score}>
          {score} / {completed}
        </span>
      </div>
      {finished ? (
        <section className={s.card} aria-labelledby="series-result">
          <h2 id="series-result">
            Série terminée : {score}/{total}
          </h2>
          <p>
            {score === total
              ? "Bravo, tu as réussi toute la série !"
              : "Chaque entraînement t'aide à progresser. Tu peux réessayer !"}
          </p>
          <p role="status">{message}</p>
          <ClassContribution contribution={contribution} />
          <div className={s.actions}>
            {saveState === "error" && (
              <button className={s.primary} disabled={saving} onClick={save}>
                Réessayer l'enregistrement
              </button>
            )}
            {(!student || student.id !== owner.current) && (
              <button className={s.secondary} onClick={openPanel}>
                Se connecter
              </button>
            )}
            <button
              type="button"
              className={s.primary}
              disabled={saving}
              onClick={() => restart()}
            >
              Nouvelle série
            </button>

            <button
              type="button"
              className={s.secondary}
              disabled={saving}
              onClick={openPanel}
            >
              Voir ma progression
            </button>

            <button
              type="button"
              className={s.secondary}
              disabled={saving}
              onClick={onBack}
            >
              ← Retour aux activités
            </button>
          </div>
        </section>
      ) : (
        <div className={s.exerciseGrid}>
          <section className={s.card} aria-label="Question de division">
            <span className={s.type}>
              {modes.find((item) => item.id === mode).label}
            </span>
            {mode === "equality" ? (
              <>
                <p className={s.question}>Sachant que :</p>
                <div className={s.equation}>{equation(q)}</div>
              </>
            ) : (
              <>
                <p className={s.question}>
                  {mode === "operation"
                    ? "Quelle opération correspond à cette division posée ?"
                    : "Observe cette division posée."}
                </p>
                <Division q={q} />
              </>
            )}
            {mode !== "operation" && (
              <p className={s.question}>
                Quel est le{" "}
                <b>{target === "remainder" ? "reste" : "quotient"}</b>
                {mode === "equality"
                  ? ` de l'opération ${q.dividend} ÷ ${q.divisor}`
                  : " de cette division"}{" "}
                ?
              </p>
            )}
            <div className={s.answers}>
              {choices.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={choice !== null || checking}
                  className={`${s.answer} ${choice !== null && value === correct ? s.good : ""} ${choice === value && value !== correct ? s.bad : ""}`}
                  onClick={() => answer(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div
              role="status"
              className={`${s.feedback} ${choice !== null ? (choice === correct ? s.good : s.bad) : ""}`}
            >
              {checking ? (
                "Vérification de la connexion…"
              ) : choice === null ? (
                "Choisis une réponse."
              ) : (
                <>
                  {choice === correct
                    ? "Bonne réponse. "
                    : "Pas tout à fait. La bonne lecture est : "}
                  <b>{equation(q)}</b>
                </>
              )}
            </div>
            {choice !== null && (
              <div className={s.actions}>
                <button className={s.primary} onClick={next}>
                  {index + 1 === total
                    ? "Voir mon résultat"
                    : "Question suivante →"}
                </button>
              </div>
            )}
          </section>
          <aside className={s.side}>
            <details open>
              <summary>💡 Rappel</summary>
              <div>
                <p>Dans une division euclidienne :</p>
                <p className={s.formula}>
                  dividende = diviseur × quotient + reste
                </p>
                <p>
                  Le <b>reste</b> est toujours plus petit que le diviseur.
                </p>
                <p>
                  Les nombres sont choisis pour éviter les confusions :
                  quotient, diviseur et reste non nul sont différents.
                </p>
              </div>
            </details>
          </aside>
        </div>
      )}
    </>
  );
}
