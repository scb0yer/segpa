"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useStudent } from "./StudentProvider";
import s from "../maths.module.css";
const StudentPanel = dynamic(() => import("./StudentPanel"), {
  ssr: false,
  loading: () => <p role="status">Ouverture de l'espace élève…</p>,
});
export function Avatar({ student }) {
  const [failed, setFailed] = useState(false);
  const value = student?.avatar || "";
  const valid = /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value);
  return (
    <span className={s.avatar}>
      {valid && !failed ? (
        <img src={value} alt="" onError={() => setFailed(true)} />
      ) : (
        student?.name?.trim()?.[0]?.toUpperCase() || "?"
      )}
    </span>
  );
}
export default function StudentAccess() {
  const { student, checking, openPanel, panel } = useStudent();
  return (
    <>
      <button
        type="button"
        className={s.user}
        onClick={openPanel}
        disabled={checking}
        aria-label={
          student
            ? `Ouvrir le tableau de bord de ${student.name}`
            : "Se connecter"
        }
      >
        <Avatar
          key={`${student?.id || "guest"}-${student?.avatar || ""}`}
          student={student}
        />
        <span className={s.who}>
          <strong>
            {checking ? "Chargement…" : student?.name || "Connexion"}
          </strong>
          <small>{student ? "Mon tableau de bord" : "Espace élève"}</small>
        </span>
      </button>
      {panel && <StudentPanel />}
    </>
  );
}
