import { StudentProvider } from "./_components/StudentProvider";
import StudentAccess from "./_components/StudentAccess";
import s from "./maths.module.css";
export default function Maths3Layout({ children }) {
  return <StudentProvider><div className={s.theme}><div className={s.wrap}>
    <header className={s.top}><a className={s.back} href="/">← Retour à l'accueil</a><StudentAccess /></header>
    <main>{children}</main>
    <footer className={s.footer}>Classes de Mme Boyer · Maths 3ème</footer>
  </div></div></StudentProvider>;
}
