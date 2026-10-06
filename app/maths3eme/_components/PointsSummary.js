"use client";
import { useStudent } from "./StudentProvider";
export default function PointsSummary() {
  const { student, dashboard, checking } = useStudent();
  if (checking || !student) return null;
  const week = dashboard?.weekly?.current;
  return (
    <p aria-live="polite">
      <strong>
        Cette semaine : {week?.gradeOn20?.toLocaleString("fr-FR") ?? "0"} / 20
      </strong>
      {" · Classe : "}
      {(dashboard?.classe?.percentage || 0).toLocaleString("fr-FR", {
        maximumFractionDigits: 2,
      })}{" "}
      %
    </p>
  );
}
