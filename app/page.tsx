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
        <section className="grid gap-5 lg:grid-cols-2">
          {/* FRANÇAIS */}
          <a
            href="/francais5eme"
            className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-rose-400/30 bg-gradient-to-br from-[#32131e] via-[#1d1019] to-[#0e0c14] p-7 shadow-2xl shadow-rose-950/20 transition-all duration-500 hover:-translate-y-1 hover:border-rose-400/60 hover:shadow-rose-900/30 sm:min-h-[570px] sm:p-10"
          >
            {/* Glow */}
            <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-rose-500/30 blur-[80px] transition-all duration-700 group-hover:bg-rose-500/40" />

            {/* Formes décoratives */}
            <div className="absolute right-[-80px] top-[110px] h-64 w-64 rotate-12 rounded-[60px] border border-rose-400/10 bg-rose-400/5" />

            <span className="absolute right-7 top-6 text-4xl font-bold text-rose-300/20">
              01
            </span>

            <div className="relative z-10 flex h-full flex-col">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-rose-200">
                Français
              </p>

              <h2 className="mt-3 text-6xl font-black tracking-tight sm:text-8xl">
                <span className="text-rose-400">5</span>ème
              </h2>

              <div className="mt-4 h-1 w-12 rounded-full bg-rose-400" />

              <p className="mt-6 text-xl font-medium text-slate-200 sm:text-2xl">
                Parcours interactifs
                <br />
                Fluence
              </p>

              {/* Livre */}
              <div className="relative my-auto flex min-h-[150px] items-center justify-center py-5">
                <div className="relative transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105">
                  <div className="absolute inset-0 scale-125 rounded-full bg-rose-500/20 blur-3xl" />

                  <Image src="/livrev2.png" alt="" width={280} height={280} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-200/60">
                  Ouvrir
                </span>
                <Arrow />
              </div>
            </div>
          </a>

          {/* COLONNE MATHS */}
          <div className="grid gap-5">
            {/* MATHS 4e */}
            <a
              href="/maths4eme"
              className="group relative min-h-[270px] overflow-hidden rounded-[2rem] border border-violet-400/30 bg-gradient-to-br from-[#171335] via-[#111126] to-[#0b0b16] p-7 shadow-2xl shadow-violet-950/20 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-violet-900/30 sm:p-9"
            >
              <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[70px]" />
              <div className="absolute bottom-[-100px] right-10 h-52 w-52 rotate-45 rounded-[40px] border border-violet-400/10 bg-violet-500/5" />

              <span className="absolute right-7 top-6 text-4xl font-bold text-violet-300/20">
                02
              </span>

              <div className="relative z-10 flex h-full items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-300">
                    Maths
                  </p>

                  <h2 className="mt-2 text-5xl font-black sm:text-6xl">
                    <span className="text-violet-400">4</span>ème
                  </h2>

                  <div className="mt-3 h-1 w-10 rounded-full bg-violet-400" />

                  <p className="mt-5 text-lg text-slate-300">Jeux numériques</p>

                  <div className="mt-6">
                    <Arrow />
                  </div>
                </div>

                {/* Calculatrice */}
                <div className="relative flex w-[42%] justify-center">
                  <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl" />
                  <Image
                    src="/calculatricev2.png"
                    alt=""
                    width={280}
                    height={280}
                  />
                </div>
              </div>
            </a>

            {/* MATHS 3e */}
            <a
              href="/maths3eme"
              className="group relative min-h-[270px] overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-gradient-to-br from-[#09243a] via-[#0b1728] to-[#090e18] p-7 shadow-2xl shadow-cyan-950/20 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-cyan-900/30 sm:p-9"
            >
              <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[70px]" />
              <div className="absolute bottom-[-100px] right-10 h-52 w-52 rotate-45 rounded-[40px] border border-cyan-400/10 bg-cyan-500/5" />

              <span className="absolute right-7 top-6 text-4xl font-bold text-cyan-300/20">
                03
              </span>

              <div className="relative z-10 flex h-full items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                    Maths
                  </p>

                  <h2 className="mt-2 text-5xl font-black sm:text-6xl">
                    <span className="text-cyan-400">3</span>ème
                  </h2>

                  <div className="mt-3 h-1 w-10 rounded-full bg-cyan-400" />

                  <p className="mt-5 text-lg text-slate-300">Jeux numériques</p>

                  <div className="mt-6">
                    <Arrow />
                  </div>
                </div>

                {/* Même calculatrice */}
                <div className="relative flex w-[42%] justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl" />
                  <Image
                    src="/calculatricev2.png"
                    alt=""
                    width={280}
                    height={280}
                  />
                </div>
              </div>
            </a>
          </div>

          <div className="grid gap-5">
            <a
              href="/histgeo6eme"
              className="group relative min-h-[270px] overflow-hidden rounded-[2rem] border border-green-400/30 bg-gradient-to-br from-[#171335] via-[#111126] to-[#0b0b16] p-7 shadow-2xl shadow-green-950/20 transition-all duration-500 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-green-900/30 sm:p-9"
            >
              <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-green-600/20 blur-[70px]" />
              <div className="absolute bottom-[-100px] right-10 h-52 w-52 rotate-45 rounded-[40px] border border-green-400/10 bg-green-500/5" />

              <span className="absolute right-7 top-6 text-4xl font-bold text-green-300/20">
                04
              </span>

              <div className="relative z-10 flex h-full items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-green-300">
                    Histoire-Géo
                  </p>

                  <h2 className="mt-2 text-5xl font-black sm:text-6xl">
                    <span className="text-green-400">6</span>ème
                  </h2>

                  <div className="mt-3 h-1 w-10 rounded-full bg-green-400" />

                  <p className="mt-5 text-lg text-slate-300">
                    Activités et QCM
                  </p>

                  <div className="mt-6">
                    <Arrow />
                  </div>
                </div>

                {/* Hist-Géo */}
                <div className="relative flex w-[42%] justify-center">
                  <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl" />
                  <Image src="/geo.png" alt="" width={280} height={280} />
                </div>
              </div>
            </a>
          </div>
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
