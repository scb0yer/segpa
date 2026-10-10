"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import s from "../maths.module.css";
import { useStudent } from "./StudentProvider";
import { exercises } from "../_lib/config";
import Calculator from "./Calculator";

const DivisionExercise = dynamic(
  () => import("../_exercises/DivisionExercise"),
  {
    ssr: false,
    loading: () => <p role="status">Chargement de Mission Division…</p>,
  },
);
const DiviseursExercice = dynamic(
  () => import("../_exercises/DiviseursExercice"),
  {
    ssr: false,
    loading: () => <p role="status">Chargement de Mission Diviseurs…</p>,
  },
);
const PGCDExercice = dynamic(() => import("../_exercises/PGCDExercice"), {
  ssr: false,
  loading: () => <p role="status">Chargement de Mission PGCD…</p>,
});
const FractionsExercice = dynamic(
  () => import("../_exercises/FractionsExercice"),
  {
    ssr: false,
    loading: () => <p role="status">Chargement de Mission Fractions…</p>,
  },
);
const FractionOperationsExercice = dynamic(
  () => import("../_exercises/FractionOperationsExercice"),
  {
    ssr: false,
    loading: () => <p role="status">Chargement des calculs de fractions…</p>,
  },
);
const activities = {
  division: {
    Component: DivisionExercise,
    title: "Division",
    initialMode: "equality",
    number: "01",
    description: "Quotient, reste et écriture de la division euclidienne",
    teaser: "S'entraîner avec la division",
  },
  diviseurs: {
    Component: DiviseursExercice,
    title: "Diviseurs",
    initialMode: "recognize",
    number: "02",
    description:
      "Reconnaître un diviseur et trouver tous les diviseurs d'un nombre",
    teaser: "Reconnaître et trouver les diviseurs",
  },
  pgcd: {
    Component: PGCDExercice,
    title: "PGCD",
    initialMode: "choose",
    number: "03",
    description: "Trouver le PGCD par soustractions successives",
    teaser: "Choisir les opérations puis les écrire soi-même",
  },
  fractions: {
    Component: FractionsExercice,
    title: "Fractions",
    initialMode: "factors",
    number: "04",
    description: "Réduire une fraction à sa forme irréductible",
    teaser: "Simplifier les facteurs communs puis utiliser le PGCD",
  },
  fractionOperations: {
    Component: FractionOperationsExercice,
    title: "Additions et soustractions de fractions",
    initialMode: "same",
    number: "05",
    description: "Additionner et soustraire des fractions",
    teaser:
      "Même dénominateur, double ou triple, puis produit des dénominateurs",
  },
};
class ExerciseBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="alert">
        L'activité n'a pas pu être chargée. Recharge la page pour réessayer.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function ActivityHub() {
  const [active, setActive] = useState(null);
  const { registerActivityLauncher } = useStudent();
  const launchSequence = useRef(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const heading = useRef(null);
  const cards = useRef({});
  useEffect(() => {
    if (active) heading.current?.focus();
  }, [active]);
  useEffect(() => {
    if (!dirty && !saving) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving]);
  useEffect(
    () =>
      registerActivityLauncher((exerciceId) => {
        let target = null;
        for (const activity of Object.keys(activities)) {
          const mode = Object.keys(exercises[activity]?.exerciceIds || {}).find(
            (key) =>
              exerciceId && exercises[activity].exerciceIds[key] === exerciceId,
          );
          if (mode) {
            target = { activity, mode };
            break;
          }
        }
        if (!target) return "unavailable";
        if (saving) return "saving";
        if (
          dirty &&
          !window.confirm(
            "Changer d'activité ? La série en cours ou non enregistrée sera perdue.",
          )
        )
          return "cancelled";
        setDirty(false);
        setActive({ ...target, key: ++launchSequence.current });
        return "opened";
      }),
    [registerActivityLauncher, dirty, saving],
  );

  function leave() {
    if (saving) return;
    if (
      dirty &&
      !window.confirm(
        "Quitter l'activité ? La série en cours ou non enregistrée sera perdue.",
      )
    )
      return;
    const activity = active?.activity;
    setActive(null);
    setDirty(false);
    requestAnimationFrame(() => cards.current[activity]?.focus());
  }
  if (active) {
    const activity = activities[active.activity];
    const Exercise = activity.Component;
    return (
      <section>
        <button
          type="button"
          className={s.secondary}
          onClick={leave}
          disabled={saving}
        >
          ← Toutes les activités
        </button>
        <Calculator />
        <div className={s.exerciseHeading}>
          <span className={s.grade}>3e</span>
          <div>
            <h1 ref={heading} tabIndex={-1}>
              Mission <span>{activity.title}</span>
            </h1>
            <p className={s.muted}>{activity.description}</p>
          </div>
        </div>
        <ExerciseBoundary key={active.key}>
          <Exercise
            initialMode={active.mode}
            onDirtyChange={setDirty}
            onSavingChange={setSaving}
            onBack={leave}
          />
        </ExerciseBoundary>
      </section>
    );
  }
  return (
    <>
      <div className={s.hubHeading}>
        <p className={s.eyebrow}>Mathématiques</p>
        <h1>3ème</h1>
        <div className={s.rule} />
        <p className={s.muted}>Choisis un jeu numérique pour commencer.</p>
      </div>
      <section className={s.activities} aria-label="Jeux de mathématiques">
        {Object.entries(activities).map(([key, activity]) => (
          <button
            key={key}
            ref={(element) => {
              cards.current[key] = element;
            }}
            className={s.activity}
            onClick={() =>
              setActive({
                activity: key,
                mode: activity.initialMode,
                key: ++launchSequence.current,
              })
            }
          >
            <span className={s.number}>{activity.number}</span>
            <span>
              <strong>{activity.title}</strong>
              <small>{activity.teaser}</small>
            </span>
            <span aria-hidden="true" className={s.arrow}>
              →
            </span>
          </button>
        ))}
      </section>
    </>
  );
}
