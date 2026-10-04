"use client";

import Image from "next/image";

const sections = [
  {
    titre: "La fluence",
    liens: [
      {
        numero: "01",
        titre: "Fluence niveau 1 : même mot ? 🔎",
        href: "/francais5eme/fluence_niveau1.html",
      },
      {
        numero: "02",
        titre: "Fluence niveau 2 : construire des mots 🧩",
        href: "/francais5eme/fluence_niveau2.html",
      },
      {
        numero: "03",
        titre: "Fluence niveau 3 : J'écoute et je reconnais 🎧",
        href: "/francais5eme/fluence_niveau3.html",
      },
      {
        numero: "04",
        titre: "Fluence niveau 4 : Le mot éclair ⚡️",
        href: "/francais5eme/fluence_niveau4.html",
      },
    ],
  },
  {
    titre: "Conjugaison",
    liens: [
      {
        numero: "01",
        titre: "Repérer le verbe",
        href: "/francais5eme/conjugaison_1.html",
      },
      {
        numero: "02",
        titre: "Classer les verbes",
        href: "/francais5eme/conjugaison_2.html",
      },
      {
        numero: "03",
        titre: "Conjuguer au présent",
        href: "/francais5eme/conjugaison_3.html",
      },
    ],
  },
  {
    titre: "Dictées",
    liens: [
      {
        numero: "01",
        titre: "Adverbes",
        href: "/francais5eme/dictee_1.html",
      },
    ],
  },
  {
    titre: "Les chatbox littéraires",
    liens: [
      {
        numero: "01",
        titre: "Entretien avec Joachim du Bellay",
        href: "https://mizou.com/login-thread?ID=e_IQ_WV85Sz2H4lb0o1Q5ZpI1pcF1S3rD0Zd19z2kjM-146931",
      },
    ],
  },
];

const Francais5eme = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070914] text-[#f5f5fa]">
      {/* Halos bleus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#162456]/50 blur-[130px]" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#3080ff]/[0.08] blur-[130px]" />

        <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#54a2ff]/[0.05] blur-[120px]" />

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
        <a
          href="/"
          className="mb-12 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-[#adb5c7] transition-colors hover:text-[#90c5ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#90c5ff]"
        >
          <span aria-hidden="true">←</span>
          Retour à l'accueil
        </a>

        <header className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#54a2ff]">
            Français
          </p>

          <h1 className="text-5xl font-black tracking-tight text-[#90c5ff] sm:text-7xl">
            5ème
          </h1>

          <div className="mt-8 flex justify-center">
            <a
              href="https://cloud.moncollege95.fr/index.php/s/AgxGW63tGpC2frn"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#54a2ff] bg-[#54a2ff] px-6 py-4 font-bold text-[#070914] transition-colors hover:border-[#90c5ff] hover:bg-[#90c5ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#90c5ff]"
            >
              <Image
                src="/submit.png"
                alt=""
                width={40}
                height={40}
                className="shrink-0 object-contain"
              />

              <span className="text-base sm:text-lg">Rendre un travail</span>
            </a>
          </div>
        </header>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={section.titre} aria-labelledby={`section-${index}`}>
              <h2
                id={`section-${index}`}
                className="mb-4 text-lg font-bold tracking-tight text-[#90c5ff] sm:text-xl"
              >
                {section.titre}
              </h2>

              <div className="grid gap-4">
                {section.liens.map((lien) => (
                  <a
                    key={lien.href}
                    href={lien.href}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#54a2ff]/50 hover:bg-[#54a2ff]/[0.06] hover:shadow-2xl hover:shadow-[#162456]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#90c5ff] motion-reduce:transform-none motion-reduce:transition-none sm:p-8"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#54a2ff]/0 blur-3xl transition-colors duration-500 group-hover:bg-[#54a2ff]/15 motion-reduce:transition-none"
                    />

                    <div className="relative flex items-center gap-4 sm:gap-8">
                      <span className="shrink-0 text-sm font-bold tracking-widest text-[#54a2ff]/70 sm:w-10">
                        {lien.numero}
                      </span>

                      <h3 className="min-w-0 flex-1 text-lg font-bold tracking-tight sm:text-2xl">
                        {lien.titre}
                      </h3>

                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#54a2ff]/30 bg-[#54a2ff]/10 text-xl text-[#90c5ff] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#54a2ff] group-hover:bg-[#54a2ff] group-hover:text-[#070914] motion-reduce:transform-none motion-reduce:transition-none sm:h-12 sm:w-12"
                      >
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-white/[0.07] pt-7 text-xs text-[#adb5c7]">
          Classes de Mme Boyer · Français 5ème
        </footer>
      </main>
    </div>
  );
};

export default Francais5eme;
