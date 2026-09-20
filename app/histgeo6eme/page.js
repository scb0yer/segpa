"use client";

const Histgeo6eme = () => {
  const activities = [
    {
      numero: "01",
      titre: "Mission cartographie",
      href: "/histgeo6eme/mission_cartographe_1.html",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Halos de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-green-600/20 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-700/15 blur-[130px]" />

        {/* Grille discrète */}
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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-green-400">
            Histoire -Géographie
          </p>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-teal-500 bg-clip-text text-transparent">
              6ème
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Choisis une activité pour commencer.
          </p>
        </header>

        {/* Liste des jeux */}
        <section className="grid gap-4">
          {activities.map((jeu) => (
            <a
              key={jeu.numero}
              href={jeu.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-400/50 hover:bg-green-400/[0.06] hover:shadow-2xl hover:shadow-green-950/30 sm:p-8"
            >
              {/* Halo au survol */}
              <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-green-500/0 blur-3xl transition-all duration-500 group-hover:bg-green-500/15" />

              <div className="relative flex items-center gap-5 sm:gap-8">
                {/* Numéro */}
                <div className="text-sm font-bold tracking-widest text-green-400/60 sm:w-10">
                  {jeu.numero}
                </div>

                {/* Titre */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {jeu.titre}
                  </h2>
                </div>

                {/* Flèche */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10 text-xl text-green-300 transition-all duration-300 group-hover:translate-x-1 group-hover:border-green-300 group-hover:bg-green-400 group-hover:text-[#070914]">
                  →
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.07] pt-7 text-xs text-slate-600">
          Classes de Mme Boyer · Maths 4ème
        </footer>
      </main>
    </div>
  );
};

export default Histgeo6eme;
