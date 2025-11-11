<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
  import { onMount, onDestroy } from "svelte";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Chart from "chart.js/auto";

  interface Stats {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
  }

  let { stats, recent }: { stats: Stats; recent: any[] } = $props();

  let chartCanvas: HTMLCanvasElement;
  let chartInstance: any = null;

  // animated counters for a cooler feel
  const totalVal = new Tween(stats.total ?? 0, {
    duration: 700,
    easing: cubicOut,
  });
  const openVal = new Tween(stats.open ?? 0, {
    duration: 700,
    easing: cubicOut,
  });
  const inProgVal = new Tween(stats.in_progress ?? 0, {
    duration: 700,
    easing: cubicOut,
  });
  const completedVal = new Tween(stats.completed ?? 0, {
    duration: 700,
    easing: cubicOut,
  });

  $effect(() => {
    totalVal.set(stats.total ?? 0);
    openVal.set(stats.open ?? 0);
    inProgVal.set(stats.in_progress ?? 0);
    completedVal.set(stats.completed ?? 0);
  });


  function getCatppuccinColors() {
    return {
      text: getComputedStyle(document.documentElement).getPropertyValue('--catppuccin-color-text') || '#cdd6f4',
      subtext: getComputedStyle(document.documentElement).getPropertyValue('--catppuccin-color-subtext1') || '#a6adc8',
    };
  }

  function createChart() {
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext("2d");
    if (!ctx) return;
    const { text: catppuccinText, subtext: catppuccinSubtext } = getCatppuccinColors();
    const centerTextPlugin = {
      id: "centerText",
      afterDraw(chart: any) {
        const opts = chart.options.plugins?.centerText;
        if (!opts || !opts.text) return;
        const ctx = chart.ctx;
        const { left, right, top, bottom } = chart.chartArea;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        ctx.save();
        ctx.fillStyle = catppuccinText;
        const fontSize = opts.fontSize || Math.max(18, (right - left) / 12);
        ctx.font = `${opts.fontWeight || 700} ${fontSize}px ${opts.fontFamily || "system-ui, Arial"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(opts.text), centerX, centerY);
        ctx.restore();
      },
    };
    const config: any = {
      type: "doughnut",
      data: {
        labels: ["Open", "In behandeling", "Compleet"],
        datasets: [
          {
            data: [stats.open, stats.in_progress, stats.completed],
            backgroundColor: ["#e78284", "#e5c890", "#a6d189"],
            hoverOffset: 8,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        layout: { padding: { top: 12, bottom: 12, left: 12, right: 12 } },
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 12 },
              color: catppuccinSubtext,
            },
          },
          tooltip: { enabled: true, padding: 10 },
          centerText: { text: stats.total },
        },
        elements: { arc: { borderWidth: 0 } },
      },
      plugins: [centerTextPlugin],
    };
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, config);
  }

  onMount(() => {
    createChart();
    // Listen for color scheme changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      createChart();
    };
    mql.addEventListener('change', handleChange);
    return () => {
      mql.removeEventListener('change', handleChange);
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };
  });

  $effect(() => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [
        stats.open,
        stats.in_progress,
        stats.completed,
      ];
      // update center text
      if (!chartInstance.options.plugins) chartInstance.options.plugins = {};
      chartInstance.options.plugins.centerText = { text: stats.total };
      chartInstance.update();
    }
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });

  type GifEntry = { max: number; url: string; label: string };

  const gifMap: GifEntry[] = [
    {
      max: 0,
      url: "https://media1.tenor.com/m/MNVZ4YfkAAcAAAAC/cat-baby.gif",
      label: "All clear",
    },
    {
      max: 5,
      url: "https://media1.tenor.com/m/XppClGPHUTgAAAAd/cat-kitty.gif",
      label: "A few open just relax",
    },
    {
      max: 20,
      url: "https://media1.tenor.com/m/jTKoN-s5rf4AAAAd/wow-interesting.gif",
      label: "Getting busy, start working!",
    },
    {
      max: Infinity,
      url: "https://media.tenor.com/P2l5BjshgRIAAAAi/cat-meme-gato.gif",
      label: "High load, youre throwing",
    },
  ];

  function gifForOpen(count: number): GifEntry {
    for (const entry of gifMap) {
      if (count <= entry.max) return entry;
    }
    return gifMap[gifMap.length - 1];
  }

  let gifEntry: GifEntry = $state(gifForOpen(stats.open ?? 0));

  $effect(() => {
    // update gif when stats.open changes
    gifEntry = gifForOpen(stats.open ?? 0);
  });
</script>

<Layout>
  <div class="p-6 max-w-5xl mx-auto">

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <a
        href="/dashboard/klacht"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow"
        style="background: var(--catppuccin-color-sapphire); color: var(--catppuccin-color-crust);"
      >
        Open map
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
      <!-- List of klachten on the left (col-span-2 on small screens, col-span-2 on md+) -->
      <div class="md:col-span-2 col-span-3">
        <section>
          <h2 class="text-xl font-semibold mb-3">Recente meldingen</h2>
          {#if recent && recent.length}
            <div class="klachten-list-dashboard">
              {#each recent as k}
                <a
                  class="klacht-card-dashboard"
                  href={`/dashboard/klacht/${k.id}`}
                >
                  <div class="klacht-card-row-dashboard">
                    <div class="klacht-card-in-dashboard w-full">
                      <div class="klacht-header-dashboard w-full">
                        <span class="klacht-name-dashboard">{k.name}</span>
                        <span class="status-badge-dashboard status-{k.status || 'open'}">
                          {k.status === 'in_progress' ? 'In Behandeling' : k.status === 'completed' ? 'Afgerond' : 'Open'}
                        </span>
                      </div>
                      <div class="klacht-meta-dashboard">
                        <span class="meta-item-dashboard">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>
                          <span>{new Date(k.created_at).toLocaleDateString('nl-NL')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-gray-400">Geen recente meldingen.</p>
          {/if}
        </section>
      </div>
      <!-- Graphs and stats on the right (col-span-1) -->

      <div class="flex flex-col gap-4 md:col-span-1 col-span-3">

        <div class="p-2 rounded-xl bg-ctp-mantle shadow-md overflow-hidden">
          <div class="flex items-center justify-between p-3">
            <div>
              <div class="text-sm text-ctp-text">{gifEntry.label}</div>
            </div>
            <div class="text-xs text-ctp-text">GIF</div>
          </div>
          <div class="h-[225px] flex justify-center items-center bg-ctp-black">
            <img
              src={gifEntry.url}
              alt="fun gif"
              class=" h-max-[225px] h-full object-cover"
            />
          </div>
        </div>
        <div
          class="p-4 rounded-xl shadow-md flex flex-row justify-between"
          style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);"
        >
          <div>
            <div
              class="text-sm font-bold"
              style="color: var(--catppuccin-color-red);"
            >
              Open
            </div>
            <div class="text-2xl font-bold">{Math.round(openVal.current)}</div>
          </div>
          <div>
            <div
              class="text-sm font-bold"
              style="color: var(--catppuccin-color-peach);"
            >
              In behandeling
            </div>
            <div class="text-2xl font-bold">
              {Math.round(inProgVal.current)}
            </div>
          </div>
          <div>
            <div
              class="text-sm font-bold"
              style="color: var(--catppuccin-color-green);"
            >
              Compleet
            </div>
            <div class="text-2xl font-bold">
              {Math.round(completedVal.current)}
            </div>
          </div>
        </div>


        <div
          class="p-6 rounded-3xl shadow-2xl flex items-center justify-center"
          style="background: linear-gradient(135deg, var(--catppuccin-color-mantle), var(--catppuccin-color-crust)); color: var(--catppuccin-color-text);"
        >
          <div class="w-full max-w-full relative px-2 py-2">
            <canvas bind:this={chartCanvas} class="w-full rounded-lg"></canvas>
          </div>
        </div>

      </div>
    </div>
  </div>
</Layout>

<style>
.klachten-list-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  margin-top: 0.5rem;
}
.klacht-card-dashboard {
  width: 100%;
  padding: 1.1rem 1.3rem;
  border-radius: 1rem;
  background: var(--catppuccin-color-mantle, #232634);
  border: 1.5px solid var(--catppuccin-color-surface0, #45475a);
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  text-decoration: none;
  display: block;
  box-shadow: 0 2px 8px 0 rgba(30, 32, 48, 0.08);
  position: relative;
}
.klacht-card-dashboard:hover {
  border-color: var(--catppuccin-color-blue, #89b4fa);
  background: var(--catppuccin-color-base, #181825);
  box-shadow: 0 8px 24px 0 rgba(137, 180, 250, 0.10);
  z-index: 2;
}
.klacht-card-row-dashboard {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
}
.klacht-card-main-dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}
.klacht-header-dashboard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.1rem;
}
.klacht-name-dashboard {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--catppuccin-color-text, #cdd6f4);
  margin: 0;
  flex: 1;
  line-height: 1.3;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.status-badge-dashboard {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.status-badge-dashboard.status-open {
  background: var(--catppuccin-color-red, #f38ba8);
  color: var(--catppuccin-color-crust, #11111b);
}
.status-badge-dashboard.status-in_progress {
  background: var(--catppuccin-color-peach, #fab387);
  color: var(--catppuccin-color-crust, #11111b);
}
.status-badge-dashboard.status-completed {
  background: var(--catppuccin-color-green, #a6e3a1);
  color: var(--catppuccin-color-crust, #11111b);
}
.klacht-meta-dashboard {
  display: flex;
  flex-direction: row;
  gap: 1.1rem;
  font-size: 0.85rem;
  color: var(--catppuccin-color-subtext1, #9399b2);
  margin-top: 0.1rem;
  align-items: center;
}
.meta-item-dashboard {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
