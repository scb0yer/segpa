import Image from "next/image";
export default function Home() {
  const Arrow = () => (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-slate-950">
      →
    </span>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Lumières de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute -right-48 top-40 h-[500px] w-[500px] rounded-full bg-blue-700/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-700/10 blur-[140px]" />

        {/* Grille très discrète */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {/* HEADER */}
        <header className="mb-12 text-center sm:mb-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.45em] text-slate-400 sm:text-sm">
            Classes de
          </p>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            Mme{" "}
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-violet-500 bg-clip-text text-transparent">
              Boyer
            </span>
          </h1>

          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

          <p className="mx-auto mt-5 max-w-lg text-sm text-slate-400 sm:text-base">
            Choisis ton espace et lance ton activité.
          </p>
        </header>

        {/* COURS */}
        {/* ESPACES PAR NIVEAU */}
        <section className="space-y-16">
          {[
            {
              niveau: "6ème",
              numero: "06",
              couleur: "green",
              titreCouleur: "text-green-400",
              ligneCouleur: "from-green-400/70",
              matieres: [
                {
                  titre: "Histoire-Géo",
                  description: "Activités et QCM",
                  href: "/histgeo6eme",
                  image: "/geo.png",
                },
                {
                  titre: "Physique Chimie",
                  description: "Activités et QCM",
                  href: "/physchim6eme",
                  image: "/phys.png",
                },
              ],
            },

            {
              niveau: "5ème",
              numero: "05",
              couleur: "blue",
              titreCouleur: "text-blue-400",
              ligneCouleur: "from-blue-400/70",
              matieres: [
                {
                  titre: "Français",
                  description: "Parcours interactifs · Fluence",
                  href: "/francais5eme",
                  image: "/livrev2.png",
                },
              ],
            },

            {
              niveau: "4ème",
              numero: "04",
              couleur: "orange",
              titreCouleur: "text-orange-400",
              ligneCouleur: "from-orange-400/70",
              matieres: [
                {
                  titre: "Maths",
                  description: "Jeux numériques",
                  href: "/maths4eme",
                  image: "/calculatricev2.png",
                },
              ],
            },

            {
              niveau: "3ème",
              numero: "03",
              couleur: "yellow",
              titreCouleur: "text-yellow-400",
              ligneCouleur: "from-yellow-400/70",
              matieres: [
                {
                  titre: "Maths",
                  description: "Jeux numériques",
                  href: "/maths3eme",
                  image: "/calculatricev2.png",
                },
                {
                  titre: "Anglais",
                  description: "Activités",
                  href: "/anglais3eme",
                  image: "/eng.png",
                },
              ],
            },
          ].map((groupe) => {
            const styles = {
              green: {
                border: "border-green-400/25",
                hoverBorder: "hover:border-green-400/60",
                glow: "bg-green-500/15",
                glowHover: "group-hover:bg-green-500/25",
                label: "text-green-300",
                number: "text-green-400",
                line: "bg-green-400",
                button:
                  "border-green-400/30 bg-green-400/10 text-green-300 group-hover:bg-green-400",
                shadow: "hover:shadow-green-950/40",
                gradient: "from-green-950/60 via-[#101a17] to-[#0b0d12]",
              },

              blue: {
                border: "border-blue-400/25",
                hoverBorder: "hover:border-blue-400/60",
                glow: "bg-blue-500/15",
                glowHover: "group-hover:bg-blue-500/25",
                label: "text-blue-300",
                number: "text-blue-400",
                line: "bg-blue-400",
                button:
                  "border-blue-400/30 bg-blue-400/10 text-blue-300 group-hover:bg-blue-400",
                shadow: "hover:shadow-blue-950/40",
                gradient: "from-blue-950/60 via-[#101522] to-[#0b0d12]",
              },

              orange: {
                border: "border-orange-400/25",
                hoverBorder: "hover:border-orange-400/60",
                glow: "bg-orange-500/15",
                glowHover: "group-hover:bg-orange-500/25",
                label: "text-orange-300",
                number: "text-orange-400",
                line: "bg-orange-400",
                button:
                  "border-orange-400/30 bg-orange-400/10 text-orange-300 group-hover:bg-orange-400",
                shadow: "hover:shadow-orange-950/40",
                gradient: "from-orange-950/60 via-[#1b1510] to-[#0b0d12]",
              },

              yellow: {
                border: "border-yellow-400/25",
                hoverBorder: "hover:border-yellow-400/60",
                glow: "bg-yellow-500/15",
                glowHover: "group-hover:bg-yellow-500/25",
                label: "text-yellow-300",
                number: "text-yellow-400",
                line: "bg-yellow-400",
                button:
                  "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 group-hover:bg-yellow-400",
                shadow: "hover:shadow-yellow-950/40",
                gradient: "from-yellow-950/50 via-[#19170f] to-[#0b0d12]",
              },
            };

            const c = styles[groupe.couleur];

            return (
              <div key={groupe.niveau}>
                {/* EN-TÊTE DU NIVEAU */}
                <div className="mb-6 flex items-end gap-5 px-1">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                      Niveau
                    </p>

                    <h2
                      className={`text-4xl font-black tracking-tight sm:text-5xl ${groupe.titreCouleur}`}
                    >
                      {groupe.niveau}
                    </h2>
                  </div>

                  <div
                    className={`mb-2 h-px flex-1 bg-gradient-to-r ${groupe.ligneCouleur} to-transparent`}
                  />

                  <span className="mb-1 hidden text-xs uppercase tracking-[0.25em] text-slate-600 sm:block">
                    Fais défiler →
                  </span>
                </div>

                {/* CARROUSEL */}
                <div
                  className="
            -mx-5 flex snap-x snap-mandatory gap-5
            overflow-x-auto px-5 pb-5
            sm:-mx-8 sm:px-8
            lg:-mx-2 lg:px-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
                >
                  {groupe.matieres.map((matiere, index) => (
                    <a
                      key={matiere.titre}
                      href={matiere.href}
                      className={`
                group relative
                min-h-[300px]
                w-[85vw]
                max-w-[420px]
                shrink-0
                snap-start
                overflow-hidden
                rounded-[2rem]
                border
                bg-gradient-to-br
                p-7
                shadow-2xl
                transition-all
                duration-500

                sm:w-[380px]
                sm:p-9

                hover:-translate-y-1

                ${c.border}
                ${c.hoverBorder}
                ${c.shadow}
                ${c.gradient}
              `}
                    >
                      {/* HALO */}
                      <div
                        className={`
                  absolute -right-24 -top-20
                  h-72 w-72
                  rounded-full
                  blur-[80px]
                  transition-all
                  duration-700

                  ${c.glow}
                  ${c.glowHover}
                `}
                      />

                      {/* FORME DÉCORATIVE */}
                      <div
                        className={`
                  absolute
                  -bottom-28 right-4
                  h-52 w-52
                  rotate-45
                  rounded-[45px]
                  border
                  ${c.border}
                  bg-white/[0.02]
                `}
                      />

                      <div className="relative z-10 flex h-full min-h-[240px] flex-col">
                        {/* Petit badge du niveau */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`
        inline-flex rounded-full border px-3 py-1
        text-[11px] font-bold uppercase tracking-[0.18em]
        ${c.border} ${c.label}
        bg-white/[0.04]
      `}
                          >
                            {groupe.niveau}
                          </span>

                          <span
                            className={`text-sm font-bold tracking-widest opacity-30 ${c.number}`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Contenu principal */}
                        <div className="relative mt-7 flex-1">
                          {/* Matière : information principale */}
                          <h3
                            className="
        relative z-10
        max-w-[65%]
        text-3xl font-black
        uppercase
        leading-[0.95]
        tracking-tight
        text-white
        sm:text-4xl
      "
                          >
                            {matiere.titre}
                          </h3>

                          {/* Trait de couleur */}
                          <div
                            className={`relative z-10 mt-4 h-1 w-12 rounded-full ${c.line}`}
                          />

                          {/* Description */}
                          <p className="relative z-10 mt-5 max-w-[55%] text-base leading-snug text-slate-400">
                            {matiere.description}
                          </p>

                          {/* Illustration */}
                          <div
                            className="
        absolute
        -right-5
        top-1/2
        flex
        h-[190px]
        w-[52%]
        -translate-y-1/2
        items-center
        justify-center
      "
                          >
                            {/* Halo derrière l'image */}
                            <div
                              className={`absolute inset-5 rounded-full ${c.glow} blur-3xl`}
                            />

                            <Image
                              src={matiere.image}
                              alt=""
                              width={230}
                              height={230}
                              className="
          relative
          max-h-[185px]
          w-auto
          object-contain
          drop-shadow-2xl
          transition-all
          duration-500
          group-hover:-rotate-3
          group-hover:scale-110
        "
                            />
                          </div>
                        </div>

                        {/* Bas de carte */}
                        <div className="relative z-10 mt-5 flex items-center justify-between">
                          <span
                            className={`
        text-[11px]
        font-bold
        uppercase
        tracking-[0.25em]
        ${c.label}
        opacity-60
      `}
                          >
                            Ouvrir
                          </span>

                          <div
                            className={`
        flex h-11 w-11
        items-center justify-center
        rounded-full
        border
        text-lg
        transition-all
        duration-300

        group-hover:translate-x-1
        group-hover:text-[#070914]

        ${c.button}
      `}
                          >
                            →
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}

                  {/* ESPACE FINAL DU CARROUSEL */}
                  <div className="w-1 shrink-0" />
                </div>
              </div>
            );
          })}
        </section>

        {/* ACCÈS RAPIDES */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-5 flex items-center gap-5">
            <h2 className="whitespace-nowrap text-xl font-bold sm:text-2xl">
              Accès rapides
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* DACTYLOGRAPHIE */}
            <a
              href="https://bullant.edclub.com/"
              className="group flex items-center gap-5 rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-950/30 to-[#11111a] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:bg-amber-950/40"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-4xl transition-transform duration-300 group-hover:scale-110">
                ⌨️
              </div>

              <div className="flex-1">
                <p className="font-bold sm:text-lg">Dactylographie</p>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/30 text-lg transition-all group-hover:bg-amber-400 group-hover:text-slate-950">
                →
              </span>
            </a>

            {/* PRONOTE */}
            <a
              href="https://0950941g.index-education.net/pronote/"
              className="group flex items-center gap-5 rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-950/30 to-[#11111a] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-950/40"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-3xl font-black text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                P
              </div>

              <div className="flex-1">
                <p className="font-bold sm:text-lg">Pronote</p>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/30 text-lg transition-all group-hover:bg-emerald-400 group-hover:text-slate-950">
                →
              </span>
            </a>

            {/* Athéna */}
            <a
              href="https://cloud.moncollege95.fr/index.php/apps/files/files"
              className="group flex items-center gap-5 rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-950/30 to-[#11111a] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-950/40"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-3xl font-black text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                📂
              </div>

              <div className="flex-1">
                <p className="font-bold sm:text-lg">Athéna cloud</p>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/30 text-lg transition-all group-hover:bg-emerald-400 group-hover:text-slate-950">
                →
              </span>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 border-t border-white/[0.07] py-7 text-center text-xs text-slate-600 sm:text-left">
          Classes de Mme Boyer
        </footer>
      </main>
    </div>
  );
}
