"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "./prof.module.css";
import StudentActivities from "./StudentActivities";

const API = "/api/segpa/prof";
const fmt = (n) => n == null ? "—" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n);
const date = (day) => new Date(day + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const shift = (day, n) => new Date(new Date(day + "T12:00:00Z").getTime() + n * 86400000).toISOString().slice(0, 10);
async function api(path, { body, method = "GET", signal } = {}) {
  const res = await fetch(API + path, { method, credentials: "include", cache: "no-store", signal,
    ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Erreur ${res.status}. Réessayez.`), { status: res.status });
  return data;
}
function Avatar({ name, avatar }) {
  const [failed, setFailed] = useState(false);
  const image = typeof avatar === "string" && (/^https:\/\//i.test(avatar) || /^\/(?!\/)/.test(avatar));
  return <span className={s.avatar} aria-hidden="true">{image && !failed
    ? /* Les avatars existants ne nécessitent pas de configuration next/image. */
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="" onError={() => setFailed(true)} referrerPolicy="no-referrer" />
    : (avatar && !image && avatar.length < 12 ? avatar : name.slice(0, 1).toUpperCase())}</span>;
}
function Bar({ percentage, label }) {
  return <div className={s.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.max(0, percentage || 0))}>
    <span style={{ width: `${Math.min(100, Math.max(0, percentage || 0))}%` }} />
  </div>;
}

export default function Prof() {
  const [auth, setAuth] = useState("checking");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [week, setWeek] = useState("");
  const [data, setData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [periodId, setPeriodId] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStart, setNewStart] = useState("");
  const [firstStart, setFirstStart] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [version, setVersion] = useState(0);
  const heading = useRef(null);
  const fail = useCallback((e) => {
    if (e.name === "AbortError") return;
    if (e.status === 401) { setAuth("login"); setData(null); setSelectedStudent(null); }
    setError(e.message || "Connexion au serveur impossible.");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api("/auth/me", { signal: controller.signal }).then(() => setAuth("ready")).catch(e => {
      if (e.name !== "AbortError") { setAuth("login"); if (e.status !== 401) setError(e.message); }
    });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (auth !== "ready") return;
    const controller = new AbortController();
    setLoading(true);
    api("/classes", { signal: controller.signal }).then(d => {
      setClasses(d.classes); setClassId(id => d.classes.some(c => c._id === id) ? id : d.classes[0]?._id || "");
    }).catch(fail).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [auth, fail]);
  useEffect(() => {
    if (auth !== "ready" || !classId) return;
    const controller = new AbortController();
    setLoading(true); setError(""); setData(null);
    api(`/classes/${classId}/dashboard${week ? `?week=${week}` : ""}`, { signal: controller.signal }).then(d => {
      setData(d); setFirstStart(d.settings.periods[0]?.startWeek || d.currentWeek);
      setNewStart(shift(d.currentWeek, 7));
    }).catch(fail).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [auth, classId, week, version, fail]);
  useEffect(() => { heading.current?.focus(); }, [selectedStudent]);

  async function login(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { await api("/auth/login", { method: "POST", body: { password } }); setPassword(""); setAuth("ready"); }
    catch (e) { fail(e); } finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError("");
    try { await api("/auth/logout", { method: "POST", body: {} }); setData(null); setAuth("login"); setSelectedStudent(null); }
    catch (e) { fail(e); } finally { setBusy(false); }
  }
  async function mutate(path, method, body, message) {
    setBusy(true); setError(""); setNotice("");
    try {
      await api(`/classes/${classId}${path}`, { method, body: { ...body, revision: data.settings.revision } });
      setNotice(message); setVersion(v => v + 1); return true;
    } catch (e) { fail(e); return false; } finally { setBusy(false); }
  }
  const student = data?.students.find(p => p.id === selectedStudent);
  const periods = student?.periods || [];
  const activePeriod = [...periods].reverse().find(p => p.startWeek <= data?.currentWeek);
  const period = periods.find(p => p.id === periodId) || activePeriod || periods[0];
  const excludedWeek = data?.settings.exclusions.some(e => e.studentId === "*" && e.week === data.week);

  return <main className={s.page}>
    <div className={s.shell}>
      <header className={s.header}><div><p className={s.eyebrow}>MATHÉMATIQUES · 3ᵉ SEGPA</p><h1>Espace professeur<span>.</span></h1><p className={s.muted}>Suivre les efforts, accompagner les progrès.</p></div>
        <nav className={s.actions} aria-label="Navigation"><a href="/maths3eme" className={s.secondary}>Activités élèves ↗</a>{auth === "ready" && <button className={s.secondary} onClick={logout} disabled={busy}>Déconnexion</button>}</nav>
      </header>
      {error && <p role="alert" className={s.error}>{error} {auth === "ready" && <button className={s.secondary} onClick={() => setVersion(v => v + 1)}>Actualiser</button>}</p>}
      {notice && auth === "ready" && <p role="status" className={s.notice}>{notice}</p>}
      {auth === "checking" && <p role="status">Vérification de la connexion…</p>}
      {auth === "login" && <section className={`${s.panel} ${s.login}`}><p className={s.eyebrow}>ACCÈS RÉSERVÉ</p><h2>Bienvenue dans ton espace</h2><p className={s.muted}>Connecte-toi pour consulter le suivi de tes élèves.</p>
        <form onSubmit={login}><label htmlFor="prof-password">Mot de passe professeur</label><div className={s.password}><input id="prof-password" required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} maxLength={1024} /><button type="button" className={s.secondary} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)}>{showPassword ? "Masquer" : "Afficher"}</button></div><button className={s.primary} disabled={busy}>{busy ? "Connexion…" : "Se connecter →"}</button></form>
      </section>}
      {auth === "ready" && <>
        <div className={s.toolbar}><label>Classe<select value={classId} disabled={busy} onChange={e => { setClassId(e.target.value); setSelectedStudent(null); setPeriodId(""); setSettingsOpen(false); setNotice(""); }}>{classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
          <label>Semaine du lundi<input type="date" value={week || data?.week || ""} max={data?.currentWeek} disabled={busy} onChange={e => { setWeek(e.target.value); setNotice(""); }} /></label>
          <button className={s.secondary} disabled={busy || loading} onClick={() => { setWeek(""); setVersion(v => v + 1); }}>Cette semaine</button>
          <button className={s.secondary} disabled={!data || busy} onClick={() => setSettingsOpen(v => !v)} aria-expanded={settingsOpen}>Périodes et moyennes</button>
        </div>
        {loading && <p role="status">Chargement du suivi…</p>}
        {!loading && !classes.length && <p className={s.panel}>Aucune classe disponible.</p>}
        {data && <>
          {settingsOpen && <section className={s.panel} aria-label="Gestion des périodes"><h2>Périodes et moyennes</h2><p className={s.muted}>Les moyennes portent sur les semaines terminées, y compris celles à 0 point, sauf les semaines exclues. Les dates de début sont des lundis.</p>
            <ol className={s.periods}>{data.settings.periods.map((p, i, all) => <li key={p._id}><strong>{p.name}</strong> · du {date(p.startWeek)} {all[i + 1] ? `au ${date(shift(all[i + 1].startWeek, -1))}` : "jusqu’à la prochaine période"}</li>)}</ol>
            <form className={s.formRow} onSubmit={async e => { e.preventDefault(); await mutate("/first-period", "PATCH", { startWeek: firstStart }, "Début de la première période mis à jour."); }}><label>Début de la première période<input type="date" required value={firstStart} onChange={e => setFirstStart(e.target.value)} /></label><button className={s.secondary} disabled={busy}>Corriger le début</button></form>
            <form className={s.formRow} onSubmit={async e => { e.preventDefault(); if (await mutate("/periods", "POST", { name: newName, startWeek: newStart }, "Nouvelle période enregistrée. L’historique est conservé.")) setNewName(""); }}><label>Nouvelle période<input placeholder="Ex. Trimestre 2" required maxLength={80} value={newName} onChange={e => setNewName(e.target.value)} /></label><label>Premier lundi<input type="date" required value={newStart} onChange={e => setNewStart(e.target.value)} /></label><button className={s.primary} disabled={busy}>Commencer une nouvelle période</button></form>
            <p className={s.muted}>La période précédente se termine la veille de cette date. Chaque semaine appartient à une seule période ; une date passée recalcule les moyennes concernées.</p>
            <label className={s.check}><input type="checkbox" checked={!!excludedWeek} disabled={busy} onChange={e => mutate("/exclusions", "PUT", { studentId: "*", week: data.week, excluded: e.target.checked }, "Prise en compte de la semaine mise à jour.")} />Exclure la semaine du {date(data.week)} des moyennes de toute la classe (vacances, interruption…)</label>
          </section>}
          {student ? <section className={s.panel}>
            <button className={s.secondary} onClick={() => setSelectedStudent(null)}>← Retour à la classe</button>
            <div className={s.studentHeading}><Avatar name={student.name} avatar={student.avatar} /><div><h2 ref={heading} tabIndex={-1}>{student.name}</h2><p className={s.muted}>Historique des notes de participation</p></div></div>
            <div className={s.summary}><label>Période de la moyenne<select value={period?.id || ""} onChange={e => setPeriodId(e.target.value)}>{periods.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select></label><div><p className={s.eyebrow}>MOYENNE DE LA PÉRIODE</p><strong className={s.big}>{fmt(period?.average)}<small> / 20</small></strong><p className={s.muted}>{period?.count || 0} semaine(s) terminée(s) comptée(s)</p></div></div>
            <p><a className={s.secondary} href="#student-exercises">Voir les exercices et les difficultés ↓</a></p>
            <div className={s.tableWrap}><table><caption>Toutes les semaines, de la plus récente à la plus ancienne</caption><thead><tr><th>Semaine du</th><th>Note / 20</th><th>Points gagnés</th><th>Prise en compte</th></tr></thead><tbody>{student.history.map(row => {
              const inPeriod = period && row.week >= period.startWeek && (!period.endWeek || row.week < period.endWeek);
              return <tr key={row.week} className={row.excluded || !inPeriod ? s.dimRow : ""}><th scope="row">{date(row.week)}{row.provisional && <small className={s.tag}>En cours</small>}</th><td><strong>{fmt(row.gradeOn20)}</strong></td><td>{fmt(row.pointsTenths / 10)}</td><td><label className={s.check}><input type="checkbox" aria-label={`Exclure la semaine du ${date(row.week)} pour ${student.name}`} disabled={busy || row.classExcluded} checked={row.excluded} onChange={e => mutate("/exclusions", "PUT", { studentId: student.id, week: row.week, excluded: e.target.checked }, "Historique et moyenne mis à jour.")} />{row.classExcluded ? "Exclue pour la classe" : "Exclure de la moyenne"}</label><small>{row.provisional ? "Note provisoire, hors moyenne" : !inPeriod ? "Hors de la période sélectionnée" : row.excluded ? "Non comptée" : "Comptée dans la moyenne"}</small></td></tr>;
            })}</tbody></table></div>
            <StudentActivities key={student.id} classId={classId} studentId={student.id} request={api} onAuthError={fail} />
          </section> : <>
            <section className={`${s.panel} ${s.collective}`}><div className={s.sectionTitle}><div><p className={s.eyebrow}>OBJECTIF COLLECTIF</p><h2>{data.classe.name} · Ensemble, on avance</h2><p className={s.muted}>Du {date(data.week)} au {date(shift(data.week, 6))} · {data.classe.studentCount} élèves</p></div><strong className={s.big}>{fmt(data.classe.weekly.rawPercentage)}<small> %</small></strong></div><Bar percentage={data.classe.weekly.percentage} label="Objectif collectif de la semaine" /><p className={s.progressLabel}><strong>{fmt(data.classe.weekly.pointsTenths / 10)} / {fmt(data.classe.weekly.targetTenths / 10)} points</strong><span>{data.classe.weekly.percentage >= 100 ? "Objectif atteint !" : "Chaque effort fait avancer la classe."}</span></p></section>
            <section aria-label="Classement des élèves"><div className={s.sectionTitle}><h2>Les élèves</h2><p className={s.muted}>Notes de la semaine · ordre décroissant</p></div><div className={s.students}>{data.students.map((p, i) => <button key={p.id} className={s.studentCard} onClick={() => { setSelectedStudent(p.id); setPeriodId(""); }}><span className={s.rank}>{i + 1}</span><Avatar name={p.name} avatar={p.avatar} /><strong>{p.name}</strong><span className={s.grade}>{fmt(p.weekly.gradeOn20)}<small> / 20</small></span><Bar percentage={p.weekly.percentage} label={`Progression de ${p.name}`} /><span className={s.cardLink}>Voir l’historique →</span></button>)}</div>{!data.students.length && <p>Aucun élève dans cette classe.</p>}</section>
            <section className={s.panel}><div className={s.sectionTitle}><div><p className={s.eyebrow}>LES ACTIVITÉS</p><h2>Pratique et réussite</h2></div><span className={s.legend}>● Sous la moyenne des exercices</span></div><p className={s.muted}>Référence : {fmt(data.exercises.attemptsBenchmark)} tentative(s) par élève ayant essayé · {fmt(data.exercises.successBenchmark)} % de réussite.</p>
              <div className={s.tableWrap}><table><caption>Activité des élèves actuels de la classe, pour la semaine sélectionnée</caption><thead><tr><th>Exercice</th><th>Élèves ayant essayé</th><th>Tentatives / élève ayant essayé</th><th>Réussite</th></tr></thead><tbody>{data.exercises.rows.map(ex => <tr key={ex.id}><th scope="row"><small>{ex.area}</small>{ex.name}</th><td>{ex.participants} / {data.classe.studentCount}</td><td className={ex.lowAttempts ? s.orange : ""}>{fmt(ex.attemptsPerStudent)}{ex.lowAttempts && <small>Sous la moyenne</small>}</td><td className={ex.lowSuccess ? s.orange : ""}>{ex.successRate == null ? "Aucune tentative" : `${fmt(ex.successRate)} %`}{ex.lowSuccess && <small>Sous la moyenne</small>}</td></tr>)}</tbody></table></div>
              <p className={s.footnote}>Tentatives par élève : toutes les tentatives de l’exercice divisées uniquement par le nombre d’élèves qui l’ont essayé. Les exercices sans tentative sont exclus de cette référence. Réussite : moyenne des taux des élèves ayant essayé, avec le même poids pour chacun. Les exercices sans tentative ne comptent pas dans la référence de réussite.</p>
            </section>
          </>}
        </>}
      </>}
      <footer className={s.footer}>Espace réservé au professeur · Les notes en cours restent provisoires.</footer>
    </div>
  </main>;
}
