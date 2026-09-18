"use client";

const Maths3eme = () => {
  const jeux = [
    {
      numero: "01",
      titre: "Division",
      description: "S'entraîner avec la division",
      href: "/maths3eme/1-division.html",
    },
    {
      numero: "02",
      titre: "Diviseurs",
      description: "Travailler sur les diviseurs",
      href: "/maths3eme/2-diviseurs.html",
    },
    {
      numero: "03",
      titre: "PGCD",
      description: "S'entraîner au calcul du PGCD",
      href: "/maths3eme/3-pgcd.html",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Halos de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Retour accueil */}
        <a
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <span>←</span>
          Retour à l'accueil
        </a>

        {/* Titre */}
        <header className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-cyan-400">
            Mathématiques
          </p>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              3ème
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Choisis un jeu numérique pour commencer.
          </p>
        </header>

        {/* Liste des jeux */}
        <section className="grid gap-4">
          {jeux.map((jeu) => (
            <a
              key={jeu.numero}
              href={jeu.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/[0.06] hover:shadow-2xl hover:shadow-cyan-950/30 sm:p-8"
            >
              {/* Halo au survol */}
              <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-500/0 blur-3xl transition-all duration-500 group-hover:bg-cyan-500/15" />

              <div className="relative flex items-center gap-5 sm:gap-8">
                {/* Numéro */}
                <div className="text-sm font-bold tracking-widest text-cyan-400/60 sm:w-10">
                  {jeu.numero}
                </div>

                {/* Texte */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {jeu.titre}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    {jeu.description}
                  </p>
                </div>

                {/* Bouton */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-300 transition-all duration-300 group-hover:translate-x-1 group-hover:border-cyan-300 group-hover:bg-cyan-400 group-hover:text-[#070914]">
                  →
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.07] pt-7 text-xs text-slate-600">
          Classes de Mme Boyer · Maths 3ème
        </footer>
      </main>
    </div>
  );
};

export default Maths3eme;
