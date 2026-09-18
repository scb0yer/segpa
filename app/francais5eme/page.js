"use client";

const Francais5eme = () => {
  const parcours = [
    {
      numero: "01",
      titre: "Parcours semaine 1 : Poésie et Voyage",
      href: "/francais5eme/semaine1.html",
    },
    {
      numero: "02",
      titre: "Parcours semaine 2 : Poésie et Voyage",
      href: "/francais5eme/semaine2.html",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* Halos de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-rose-600/20 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-700/10 blur-[130px]" />

        {/* Petit halo central */}
        <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-pink-600/[0.06] blur-[120px]" />

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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">
            Français
          </p>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-rose-300 via-rose-400 to-red-500 bg-clip-text text-transparent">
              5ème
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Choisis un parcours interactif pour commencer.
          </p>
        </header>

        {/* Liste des parcours */}
        <section className="grid gap-4">
          {parcours.map((parcours) => (
            <a
              key={parcours.numero}
              href={parcours.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/50 hover:bg-rose-400/[0.06] hover:shadow-2xl hover:shadow-rose-950/30 sm:p-8"
            >
              {/* Halo au survol */}
              <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-rose-500/0 blur-3xl transition-all duration-500 group-hover:bg-rose-500/15" />

              <div className="relative flex items-center gap-5 sm:gap-8">
                {/* Numéro */}
                <div className="text-sm font-bold tracking-widest text-rose-400/60 sm:w-10">
                  {parcours.numero}
                </div>

                {/* Titre */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {parcours.titre}
                  </h2>
                </div>

                {/* Flèche */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 text-xl text-rose-300 transition-all duration-300 group-hover:translate-x-1 group-hover:border-rose-300 group-hover:bg-rose-400 group-hover:text-[#070914]">
                  →
                </div>
              </div>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.07] pt-7 text-xs text-slate-600">
          Classes de Mme Boyer · Français 5ème
        </footer>
      </main>
    </div>
  );
};

export default Francais5eme;
