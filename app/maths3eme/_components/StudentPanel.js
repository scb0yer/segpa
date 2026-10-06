"use client";
import { Avatar } from "./StudentAccess";
import { useEffect, useRef, useState } from "react";
import { useStudent } from "./StudentProvider";
import WeeklyProgress from "./WeeklyProgress";
import SuggestedActivities from "./SuggestedActivities";
import s from "../maths.module.css";
export default function StudentPanel() {
  const {
    student,
    dashboard,
    sessionError,
    closePanel,
    login,
    logout,
    refresh,
  } = useStudent();
  const dialog = useRef(null);
  const password = useRef(null);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      previous?.focus?.();
    };
  }, []);
  useEffect(() => {
    let live = true;
    if (student?.id)
      refresh().catch((e) => {
        if (live)
          setError(
            e.status === 401
              ? "Ta session a expiré. Reconnecte-toi."
              : e.message,
          );
      });
    return () => {
      live = false;
    };
  }, [student?.id, refresh]);
  async function run(action) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    run(async () => {
      const secret = values.get("password");
      if (password.current) password.current.value = "";
      await login(values.get("name"), secret);
    });
  }
  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      aria-labelledby="student-panel-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) closePanel();
      }}
    >
      <div className={s.panelHeader}>
        <h2 id="student-panel-title">
          {student ? "Mon tableau de bord" : "Connexion élève"}
        </h2>
        <button
          type="button"
          className={s.secondary}
          disabled={busy}
          onClick={closePanel}
        >
          Fermer ✕
        </button>
      </div>
      {(error || sessionError) && (
        <p className={s.error} role="alert">
          {error || sessionError}
        </p>
      )}
      {!student ? (
        <form onSubmit={submit} className={s.login}>
          <p>Connecte-toi pour enregistrer ta progression.</p>
          <label htmlFor="student-name">Pseudo</label>
          <input
            id="student-name"
            name="name"
            autoComplete="username"
            required
            maxLength={100}
            disabled={busy}
          />
          <label htmlFor="student-password">Mot de passe</label>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              ref={password}
              id="student-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              disabled={busy}
              style={{ flex: 1, minWidth: 0 }}
            />

            <button
              type="button"
              className={s.secondary}
              onClick={() => setShowPassword((visible) => !visible)}
              disabled={busy}
              aria-controls="student-password"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>
          <button className={s.primary} disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </button>
          <button
            className={s.secondary}
            type="button"
            disabled={busy}
            onClick={closePanel}
          >
            Continuer sans connexion
          </button>
        </form>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              margin: "16px 0 24px",
            }}
          >
            <Avatar
              key={`${student.id}-${student.avatar || ""}`}
              student={student}
            />

            <div>
              <strong style={{ fontSize: "1.25rem" }}>{student.name}</strong>

              {dashboard.classe?.name && (
                <p className={s.muted} style={{ margin: "4px 0 0" }}>
                  Classe : {dashboard.classe.name}
                </p>
              )}
            </div>
          </div>
          <SuggestedActivities disabled={busy} />
          <WeeklyProgress />
          <div className={s.stats}>
            <div>
              <span>Tentatives</span>
              <b>{dashboard.stats?.attemptCount ?? 0}</b>
            </div>
            <div>
              <span>Moyenne</span>
              <b>
                {dashboard.stats?.averagePercentage == null
                  ? "—"
                  : `${dashboard.stats.averagePercentage} %`}
              </b>
            </div>
            <div>
              <span>Objectif classe</span>
              <b>
                {dashboard.classe?.goalConfigured
                  ? `${dashboard.classe.percentage} %`
                  : "Non défini"}
              </b>
            </div>
          </div>
          <h3>Mes dernières activités</h3>
          <div className={s.tableScroll}>
            {dashboard.recentAttempts?.length ? (
              <table className={s.history}>
                <thead>
                  <tr>
                    <th>Activité</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentAttempts.map((a) => (
                    <tr key={a._id}>
                      <td>{a.exerciceId?.name || "Exercice"}</td>
                      <td>
                        {a.score}/{a.maxScore ?? "?"}
                      </td>
                      <td>{new Date(a.date).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune tentative enregistrée.</p>
            )}
          </div>
          <div className={s.actions}>
            <button
              className={s.secondary}
              disabled={busy}
              onClick={() => run(() => refresh())}
            >
              Actualiser
            </button>
            <button
              className={s.secondary}
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await logout();
                  closePanel();
                })
              }
            >
              Se déconnecter
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
