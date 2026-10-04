import Image from "next/image";

const groupes = [
  {
    niveau: "6ème",
    couleur: "green",
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
    couleur: "blue",
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
    couleur: "orange",
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
    couleur: "yellow",
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
] as const;

const styles = {
  green: {
    title: "text-green-400",
    divider: "from-green-400/70",
    border: "border-green-400/30",
    hover: "hover:border-green-400/70",
    glow: "bg-green-500/20",
    label: "text-green-300",
    line: "bg-green-400",
    gradient: "from-green-950/70 via-[#14251e] to-[#10151c]",
    button:
      "border-green-400/40 bg-green-400/10 text-green-300 group-hover:bg-green-400",
  },
  blue: {
    title: "text-blue-400",
    divider: "from-blue-400/70",
    border: "border-blue-400/30",
    hover: "hover:border-blue-400/70",
    glow: "bg-blue-500/20",
    label: "text-blue-300",
    line: "bg-blue-400",
    gradient: "from-blue-950/70 via-[#15223a] to-[#10151c]",
    button:
      "border-blue-400/40 bg-blue-400/10 text-blue-300 group-hover:bg-blue-400",
  },
  orange: {
    title: "text-orange-400",
    divider: "from-orange-400/70",
    border: "border-orange-400/30",
    hover: "hover:border-orange-400/70",
    glow: "bg-orange-500/20",
    label: "text-orange-300",
    line: "bg-orange-400",
    gradient: "from-orange-950/70 via-[#302017] to-[#10151c]",
    button:
      "border-orange-400/40 bg-orange-400/10 text-orange-300 group-hover:bg-orange-400",
  },
  yellow: {
    title: "text-yellow-400",
    divider: "from-yellow-400/70",
    border: "border-yellow-400/30",
    hover: "hover:border-yellow-400/70",
    glow: "bg-yellow-500/20",
    label: "text-yellow-300",
    line: "bg-yellow-400",
    gradient: "from-yellow-950/60 via-[#2b2717] to-[#10151c]",
    button:
      "border-yellow-400/40 bg-yellow-400/10 text-yellow-300 group-hover:bg-yellow-400",
  },
};

const accesRapides = [
  {
    titre: "Dactylographie",
    href: "https://bullant.edclub.com/",
    symbole: "⌨️",
    carte: "border-amber-400/25 from-amber-950/40 hover:border-amber-400/60",
    icone: "bg-amber-400/10 text-amber-300",
    fleche: "border-amber-400/30 text-amber-300 group-hover:bg-amber-400",
  },
  {
    titre: "Pronote",
    href: "https://0950941g.index-education.net/pronote/",
    symbole: "P",
    carte:
      "border-emerald-400/25 from-emerald-950/40 hover:border-emerald-400/60",
    icone: "bg-emerald-400/10 text-emerald-300",
    fleche: "border-emerald-400/30 text-emerald-300 group-hover:bg-emerald-400",
  },
  {
    titre: "Athéna cloud",
    href: "https://cloud.moncollege95.fr/index.php/apps/files/files",
    symbole: "📂",
    carte:
      "border-emerald-400/25 from-emerald-950/40 hover:border-emerald-400/60",
    icone: "bg-emerald-400/10 text-emerald-300",
    fleche: "border-emerald-400/30 text-emerald-300 group-hover:bg-emerald-400",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Lumière de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-48 top-20 h-[600px] w-[600px] rounded-full bg-slate-400/[0.07] blur-[130px]" />
        <div className="absolute -left-60 top-[850px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        {/* En-tête illustré */}
        <header className="relative isolate mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020] text-center shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:mb-16 sm:rounded-[2.5rem]">
          <div className="relative h-[390px] sm:h-[470px]">
            <Image
              src="/college-illustration.png"
              alt="Illustration de l’entrée du collège Jean Bullant"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1072px"
              className="object-cover object-center"
            />

            {/* Fond de lecture derrière le titre */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(7,9,20,0.97) 0%, rgba(7,9,20,0.90) 32%, rgba(7,9,20,0.35) 60%, rgba(7,9,20,0.10) 100%)",
              }}
            />

            <div className="relative z-10 px-5 pt-9 sm:px-8 sm:pt-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200 sm:text-sm">
                Classes de
              </p>

              <h1
                className="text-5xl font-black tracking-[-0.055em] sm:text-7xl"
                style={{ textShadow: "0 3px 18px rgba(0,0,0,0.8)" }}
              >
                <span className="text-white">Mme Boyer</span>
              </h1>

              {/* Signature des quatre niveaux */}
              <div
                aria-hidden="true"
                className="mx-auto mt-5 flex w-32 gap-1.5"
              >
                <span className="h-1 flex-1 rounded-full bg-green-400" />
                <span className="h-1 flex-1 rounded-full bg-blue-400" />
                <span className="h-1 flex-1 rounded-full bg-orange-400" />
                <span className="h-1 flex-1 rounded-full bg-yellow-400" />
              </div>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-slate-100 sm:text-base">
                Choisis ton espace et lance ton activité.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0b1020]/70 to-transparent"
            />
          </div>
        </header>

        {/* Espaces par niveau : même ordre et mêmes carrousels */}
        <section
          aria-label="Espaces par niveau"
          className="space-y-14 sm:space-y-16"
        >
          {groupes.map((groupe) => {
            const c = styles[groupe.couleur];

            return (
              <div key={groupe.niveau}>
                <div className="mb-6 flex items-end gap-5 px-1">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                      Niveau
                    </p>

                    <h2
                      className={`text-4xl font-black tracking-tight sm:text-5xl ${c.title}`}
                    >
                      {groupe.niveau}
                    </h2>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`mb-2 h-px flex-1 bg-gradient-to-r ${c.divider} to-transparent`}
                  />

                  {groupe.matieres.length > 1 && (
                    <span className="mb-1 hidden text-xs uppercase tracking-[0.15em] text-slate-400 sm:block">
                      Fais défiler →
                    </span>
                  )}
                </div>

                <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2 sm:-mx-8 sm:px-8 lg:-mx-2 lg:px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {groupe.matieres.map((matiere, index) => (
                    <a
                      key={matiere.titre}
                      href={matiere.href}
                      className={`
                        group relative min-h-[320px]
                        w-[85vw] max-w-[420px] shrink-0 snap-start
                        overflow-hidden rounded-[2rem] border
                        bg-gradient-to-br p-7
                        shadow-[0_16px_40px_rgba(0,0,0,0.2)]
                        transition duration-300
                        hover:-translate-y-1
                        active:scale-[0.98]
                        focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-4 focus-visible:outline-white
                        motion-reduce:transform-none motion-reduce:transition-none
                        sm:w-[380px] sm:p-9
                        ${c.border} ${c.hover} ${c.gradient}
                      `}
                    >
                      {/* Halo et formes dessinées */}
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-[75px] ${c.glow}`}
                      />

                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -bottom-28 right-4 h-52 w-52 rotate-45 rounded-[45px] border bg-white/[0.025] ${c.border}`}
                      />

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-8 top-20 h-16 w-16 rotate-12 rounded-full border border-white/10"
                      />

                      <div className="relative z-10 flex min-h-[250px] flex-col">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex rounded-full border bg-white/[0.05] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] ${c.border} ${c.label}`}
                          >
                            {groupe.niveau}
                          </span>

                          <span
                            aria-hidden="true"
                            className={`text-sm font-bold tracking-widest opacity-50 ${c.label}`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="relative mt-7 flex-1">
                          <h3 className="relative z-10 max-w-[65%] text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl">
                            {matiere.titre}
                          </h3>

                          <div
                            aria-hidden="true"
                            className={`relative z-10 mt-4 h-1 w-12 rounded-full transition-[width] duration-300 group-hover:w-20 motion-reduce:transition-none ${c.line}`}
                          />

                          <p className="relative z-10 mt-5 max-w-[55%] text-base leading-snug text-slate-200">
                            {matiere.description}
                          </p>

                          <div className="pointer-events-none absolute -right-5 top-1/2 flex h-[190px] w-[50%] -translate-y-1/2 items-center justify-center">
                            <div
                              aria-hidden="true"
                              className={`absolute inset-5 rounded-full blur-3xl ${c.glow}`}
                            />

                            <Image
                              src={matiere.image}
                              alt=""
                              width={230}
                              height={230}
                              sizes="190px"
                              className="relative max-h-[185px] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                            />
                          </div>
                        </div>

                        <div className="relative z-10 mt-6 flex items-center justify-between">
                          <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] ${c.label}`}
                          >
                            Ouvrir
                          </span>

                          <span
                            aria-hidden="true"
                            className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl transition duration-300 group-hover:translate-x-1 group-hover:text-[#070914] motion-reduce:transform-none motion-reduce:transition-none ${c.button}`}
                          >
                            →
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}

                  <div aria-hidden="true" className="w-1 shrink-0" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Accès rapides */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-5 flex items-center gap-5">
            <h2 className="whitespace-nowrap text-xl font-bold sm:text-2xl">
              Accès rapides
            </h2>

            <div
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {accesRapides.map((acces) => (
              <a
                key={acces.titre}
                href={acces.href}
                className={`
                  group flex items-center gap-4 rounded-2xl border
                  bg-gradient-to-r to-[#131827] p-5
                  transition duration-300 hover:-translate-y-1
                  active:scale-[0.98]
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-4 focus-visible:outline-white
                  motion-reduce:transform-none motion-reduce:transition-none
                  ${acces.carte}
                `}
              >
                <div
                  aria-hidden="true"
                  className={`flex h-14 w-16 shrink-0 items-center justify-center rounded-xl text-3xl font-black transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none ${acces.icone}`}
                >
                  {acces.symbole}
                </div>

                <p className="min-w-0 flex-1 font-bold sm:text-lg">
                  {acces.titre}
                </p>

                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition duration-300 group-hover:text-slate-950 motion-reduce:transition-none ${acces.fleche}`}
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 py-7 text-center text-xs text-slate-400 sm:text-left">
          Classes de Mme Boyer
        </footer>
      </main>
    </div>
  );
}
