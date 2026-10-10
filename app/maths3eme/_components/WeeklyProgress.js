"use client";
import { useEffect, useState } from "react";
import { useStudent } from "./StudentProvider";
import s from "./weekly.module.css";
const number = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const percentage = (value) =>
  Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
function date(day) {
  return new Date(day + "T12:00:00Z").toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Paris",
  });
}
export function Gauge({ title, value, label, detail, animateFrom }) {
  const [display, setDisplay] = useState(animateFrom ?? value);
  useEffect(() => {
    if (animateFrom === undefined) {
      setDisplay(value);
      return;
    }
    setDisplay(animateFrom);
    const timer = setTimeout(() => setDisplay(value), 100);
    return () => clearTimeout(timer);
  }, [value, animateFrom]);
  return (
    <div className={s.gauge}>
      <div className={s.row}>
        <strong>{title}</strong>
        <b>{label || `${percentage(value)} %`}</b>
      </div>
      <div
        className={s.track}
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.max(0, value))}
        aria-valuetext={label || `${percentage(value)} %`}
      >
        <div
          className={s.fill}
          style={{ width: `${Math.min(100, Math.max(0, display))}%` }}
        />
      </div>
      {detail && <p>{detail}</p>}
    </div>
  );
}
function History({ rows, personal }) {
  if (!rows?.length) return <p>Aucune semaine terminée pour le moment.</p>;
  const chart = rows.slice(0, 8).reverse();
  return (
    <>
      <div
        className={s.chart}
        role="img"
        aria-label={chart
          .map(
            (r) => `Semaine du ${date(r.week)} : ${percentage(r.percentage)} %`,
          )
          .join(" ; ")}
      >
        {chart.map((r) => (
          <div key={r.week} className={s.column}>
            <span>{number(r.percentage)} %</span>
            <div className={s.chartTrack}>
              <div style={{ height: `${r.percentage}%` }} />
            </div>
            <small>{date(r.week)}</small>
          </div>
        ))}
      </div>
      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Semaine</th>
              <th>Points gagnés</th>
              <th>{personal ? "Participation /20" : "Accomplissement"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.week}>
                <td>
                  {date(r.week)} – {date(r.endDay)}
                </td>
                <td>{number(r.pointsTenths / 10)}</td>
                <td>
                  {personal
                    ? `${number(r.gradeOn20)} / 20`
                    : `${percentage(r.percentage)} %`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default function WeeklyProgress() {
  const { dashboard } = useStudent();
  const personal = dashboard?.weekly?.current;
  const collective = dashboard?.classe?.current;
  if (!personal || !collective)
    return (
      <p>
        Le bilan hebdomadaire sera disponible après la mise à jour du serveur.
      </p>
    );
  return (
    <section className={s.panel} aria-label="Objectifs de la semaine">
      <h3>
        Semaine du {date(personal.week)} au {date(personal.endDay)}
      </h3>
      <Gauge
        title="Mon objectif"
        value={personal.percentage}
        label={`${number(personal.gradeOn20)} / 20`}
        detail={`${number(personal.pointsTenths / 10)} points gagnés cette semaine.${personal.pointsTenths > personal.targetTenths ? " Tes points supplémentaires continuent de faire avancer la classe !" : ""}`}
      />
      <Gauge
        title="Notre objectif de classe"
        value={collective.percentage}
        detail={`${number(collective.pointsTenths / 10)} / ${number(collective.targetTenths / 10)} points${collective.percentage === 100 ? " · Objectif atteint !" : ""}`}
      />
      <p>
        Mon total depuis le début :{" "}
        <strong>
          {number((dashboard.stats?.totalPointsTenths || 0) / 10)} points
        </strong>
      </p>
      <details>
        <summary>Mes semaines précédentes</summary>
        <History rows={dashboard.weekly.history} personal />
      </details>
      <details>
        <summary>La progression de la classe</summary>
        <History rows={dashboard.classe.history} />
      </details>
    </section>
  );
}
export function ClassContribution({ contribution }) {
  if (!contribution) return null;
  const before = contribution.classBefore;
  const after = contribution.classAfter;
  return (
    <section
      className={`${s.panel} ${s.light}`}
      aria-label="Ma contribution à la classe"
    >
      <p role="status">
        {contribution.creditedTenths > 0
          ? `Tu as fait gagner ${number(contribution.creditedTenths / 10)} point${contribution.creditedTenths > 10 ? "s" : ""} à la classe !`
          : "Tu as déjà gagné ton point du jour sur ce thème. Essaie un autre thème pour faire avancer la classe."}
      </p>
      <Gauge
        title="La classe avance"
        value={after.percentage}
        animateFrom={before.percentage}
        label={`${percentage(before.percentage)} % → ${percentage(after.percentage)} %`}
        detail={`${number(after.pointsTenths / 10)} / ${number(after.targetTenths / 10)} points${after.percentage === 100 ? " · Objectif collectif atteint !" : ""}`}
      />
      <Gauge
        title="Mon objectif de la semaine"
        value={contribution.studentAfter.percentage}
        label={`${number(contribution.studentAfter.gradeOn20)} / 20`}
        detail={
          contribution.studentAfter.pointsTenths >
          contribution.studentAfter.targetTenths
            ? "Objectif personnel atteint : tes points supplémentaires comptent pour la classe."
            : undefined
        }
      />
    </section>
  );
}
