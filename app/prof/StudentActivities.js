"use client";

import { useEffect, useRef, useState } from "react";
import s from "./prof.module.css";
const fmt = value => value == null ? "—" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
const dateTime = value => value && Number.isFinite(new Date(value).getTime())
  ? new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Date inconnue";

export default function StudentActivities({ classId, studentId, request, onAuthError }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const moreController = useRef(null);
  const path = `/classes/${classId}/students/${studentId}/activity`;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setData(null); setError("");
    request(path, { signal: controller.signal }).then(setData).catch(e => {
      if (e.name === "AbortError") return;
      if (e.status === 401) onAuthError(e);
      else setError(e.message || "Impossible de charger les tentatives.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); moreController.current?.abort(); };
  }, [path, request, onAuthError, reload]);

  async function loadMore() {
    if (!data?.nextCursor || moreLoading) return;
    const controller = new AbortController(); moreController.current = controller;
    setMoreLoading(true); setError("");
    try {
      const page = await request(`${path}?cursor=${encodeURIComponent(data.nextCursor)}`, { signal: controller.signal });
      setData(old => ({ ...old, attempts: [...old.attempts, ...page.attempts.filter(a => !old.attempts.some(b => b.id === a.id))], nextCursor: page.nextCursor }));
    } catch (e) {
      if (e.name !== "AbortError") {
        if (e.status === 401) onAuthError(e);
        else setError(e.message || "Impossible de charger la suite.");
      }
    } finally { if (!controller.signal.aborted) setMoreLoading(false); }
  }
  const weaknesses = data?.exercises.filter(ex => ex.needsPractice).slice(0, 3) || [];
  return <div id="student-exercises" className={s.activityDetails}>
    <div className={s.sectionTitle}><div><p className={s.eyebrow}>LE SUIVI DES EXERCICES</p><h3>À retravailler</h3></div><button className={s.secondary} disabled={loading || moreLoading} onClick={() => setReload(v => v + 1)}>Actualiser les tentatives</button></div>
    <p className={s.muted}>Sur tout l’historique de l’élève, indépendamment de la semaine ou de la période sélectionnée. Les priorités reposent sur les 5 dernières tentatives de chaque exercice, ou moins s’il débute.</p>
    {loading && <p role="status">Chargement des exercices et des tentatives…</p>}
    {error && <p role="alert" className={s.error}>{error} {!data && <button className={s.secondary} onClick={() => setReload(v => v + 1)}>Réessayer</button>}</p>}
    {data && <>
      {!data.totalAttempts ? <p className={s.emptyState}>Cet élève n’a pas encore enregistré de tentative.</p> : <>
        {weaknesses.length ? <div className={s.practiceGrid}>{weaknesses.map((ex, i) => <article className={s.practiceCard} key={ex.id}>
          <p className={s.practiceLabel}>PRIORITÉ {i + 1} · {ex.area}</p><h4>{ex.name}</h4><strong className={s.practiceRate}>{fmt(ex.successRate)} % <small>de réussite</small></strong>
          <p>{ex.recentCount} dernière(s) tentative(s)</p><p>Dernier score : <strong>{fmt(ex.lastScore)} / {fmt(ex.lastMaxScore)}</strong></p><small>Dernier essai : {dateTime(ex.lastDate)}</small>
        </article>)}</div> : <p className={s.notice}>{data.exercises.some(ex => ex.successRate != null) ? "Les dernières tentatives des exercices essayés sont toutes réussies à 100 %." : "Les scores disponibles ne permettent pas encore de calculer les priorités."}</p>}
        <div className={s.tableWrap}><table><caption>Exercices essayés, du moins bien réussi au mieux réussi — à égalité, le plus ancien essai passe en premier</caption><thead><tr><th>Exercice</th><th>Réussite récente</th><th>Tentatives au total</th><th>Dernier score</th><th>Dernier essai</th></tr></thead><tbody>{data.exercises.map(ex => <tr key={ex.id}>
          <th scope="row"><small>{ex.area}</small>{ex.name}</th><td className={weaknesses.some(w => w.id === ex.id) ? s.orange : ""}><strong>{fmt(ex.successRate)}{ex.successRate != null && " %"}</strong><small>Sur {ex.recentCount} tentative(s)</small></td><td>{ex.attemptCount}</td><td>{fmt(ex.lastScore)} / {fmt(ex.lastMaxScore)}</td><td>{dateTime(ex.lastDate)}</td>
        </tr>)}</tbody></table></div>
      </>}
      <div className={`${s.sectionTitle} ${s.attemptTitle}`}><h3>Historique des tentatives</h3><span className={s.muted}>{data.totalAttempts} tentative(s) enregistrée(s)</span></div>
      {data.attempts.length > 0 && <div className={s.tableWrap}><table><caption>Du plus récent au plus ancien · dates et heures de Paris · les scores sont distincts des points gagnés</caption><thead><tr><th>Date et heure</th><th>Exercice</th><th>Score</th><th>Réussite</th><th>Points gagnés</th></tr></thead><tbody>{data.attempts.map(a => <tr key={a.id}>
        <td>{dateTime(a.date)}</td><th scope="row"><small>{a.area}</small>{a.name}</th><td><strong>{fmt(a.score)} / {fmt(a.maxScore)}</strong></td><td>{fmt(a.percentage)}{a.percentage != null && " %"}</td><td>+{fmt(a.points)}</td>
      </tr>)}</tbody></table></div>}
      {data.nextCursor && <div className={s.loadMore}><button className={s.secondary} disabled={moreLoading} onClick={loadMore}>{moreLoading ? "Chargement…" : "Afficher les tentatives précédentes"}</button><p className={s.muted}>{data.attempts.length} tentative(s) affichée(s)</p></div>}
    </>}
  </div>;
}
