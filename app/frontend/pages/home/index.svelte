<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
</script>

<Layout>
  <main class="min-h-screen w-full text-ctp-text">
    <div class="p-6 max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-8">
        <div
          class="p-6 rounded-3xl shadow-2xl h-80 flex items-center justify-center"
          style="background: linear-gradient(135deg, var(--catppuccin-color-mantle), var(--catppuccin-color-crust)); color: var(--catppuccin-color-text);"
        >
          <div class="w-48 h-48 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              class="w-full h-full animate-sigma-rotate"
              aria-hidden
            >
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%">
                  <stop
                    offset="0%"
                    stop-color="var(--catppuccin-color-mauve-900)"
                  />
                  <stop
                    offset="100%"
                    stop-color="var(--catppuccin-color-sapphire)"
                  />
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                rx="24"
                fill="url(#g1)"
                opacity="0.06"
              />
              <g transform="translate(20,20)">
                <path
                  d="M10 10 H140 L30 90 H140"
                  fill="none"
                  stroke="url(#g1)"
                  stroke-width="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="drop-shadow-sigma"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="8"
                  fill="var(--catppuccin-color-peach)"
                />
              </g>
            </svg>
          </div>
        </div>

        <!-- Right: headline, CTA and stats -->
        <div class="flex-1">
          <h1
            class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style="color: var(--catppuccin-color-text);"
          >
            <span class="text-ctp-sapphire">Axis</span>Point —
            <span style="color: var(--catppuccin-color-sapphire)">Los op</span> wat
            opgelost moet worden.
          </h1>
          <p class="text-lg text-ctp-text/80 mb-4">
            AxisPoint vereenvoudigt het melden van lokale problemen, zodat
            gemeenten en dienstverleners sneller kunnen oplossen. Dien meldingen
            in binnen enkele seconden, voeg foto’s en nauwkeurige
            locatiegegevens toe en ontvang duidelijke statusupdates totdat de
            melding is afgehandeld.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href="/melden"
              class="inline-flex items-center gap-3 px-5 py-2 rounded-full text-sm font-semibold shadow"
              style="background: var(--catppuccin-color-sapphire); color: var(--catppuccin-color-crust);"
            >
              Meld een probleem
            </a>
            <a
              href="/routes"
              class="inline-flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium shadow"
              style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
            >
              Bekijk dekking en routes
            </a>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-4 max-w-md">
            <div
              class="p-4 rounded-xl shadow-md"
              style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
            >
              <div class="text-2xl font-bold">97%</div>
              <div class="text-sm text-ctp-text/80">
                Gerapporteerde problemen opgelost
              </div>
            </div>
            <div
              class="p-4 rounded-xl shadow-md"
              style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
            >
              <div class="text-2xl font-bold">~1m</div>
              <div class="text-sm text-ctp-text/80">
                Gemiddelde routeringstijd
              </div>
            </div>
            <div
              class="p-4 rounded-xl shadow-md"
              style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
            >
              <div class="text-2xl font-bold">σ</div>
              <div class="text-sm text-ctp-text/80">Sigma-nauwkeurigheid</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 max-w-5xl mx-auto pb-12">
      <!-- Trusted by / Testimonials -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <div class="text-sm text-ctp-text/70 mb-2">Vertrouwd door</div>
          <div class="flex gap-4 items-center">
            <div
              class="h-8 w-24 rounded-md bg-ctp-mantle flex items-center justify-center text-xs"
            >
              Gemeente A
            </div>
            <div
              class="h-8 w-24 rounded-md bg-ctp-mantle flex items-center justify-center text-xs"
            >
              Vervoerbedrijf
            </div>
            <div
              class="h-8 w-24 rounded-md bg-ctp-mantle flex items-center justify-center text-xs"
            >
              Openbare Werken
            </div>
          </div>
        </div>

        <div class="max-w-xl">
          <div
            class="p-4 rounded-xl shadow-md"
            style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
          >
            <div class="font-semibold mb-2">
              "AxisPoint heeft onze reactietijd met 40% verminderd en maakte de
              coördinatie met aannemers moeiteloos."
            </div>
            <div class="text-sm text-ctp-text/80">
              — Hoofd Operaties, Gemeente A
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</Layout>

<style>
  :global(.animate-sigma-rotate) {
    animation: sigma-rotate 8s linear infinite;
  }

  @keyframes sigma-rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(6deg) scale(1.02);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  /* small helpers for subtle effects */
  :global(.drop-shadow-sigma) {
    filter: drop-shadow(0 6px 18px rgba(124, 58, 237, 0.25));
  }

  :global(.scale-102) {
    transform: scale(1.02);
  }
</style>
