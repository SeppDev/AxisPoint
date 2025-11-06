<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
  import { onMount, onDestroy } from "svelte";
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
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
  const totalVal = new Tween(stats.total ?? 0, { duration: 700, easing: cubicOut });
  const openVal = new Tween(stats.open ?? 0, { duration: 700, easing: cubicOut });
  const inProgVal = new Tween(stats.in_progress ?? 0, { duration: 700, easing: cubicOut });
  const completedVal = new Tween(stats.completed ?? 0, { duration: 700, easing: cubicOut });

  $effect(() => {
    totalVal.set(stats.total ?? 0);
    openVal.set(stats.open ?? 0);
    inProgVal.set(stats.in_progress ?? 0);
    completedVal.set(stats.completed ?? 0);
  });

  onMount(() => {
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext("2d");
    if (!ctx) return;

    const centerTextPlugin = {
      id: 'centerText',
      afterDraw(chart: any) {
        const opts = chart.options.plugins?.centerText;
        if (!opts || !opts.text) return;
        const ctx = chart.ctx;
        const { left, right, top, bottom } = chart.chartArea;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        ctx.save();
        ctx.fillStyle = opts.color || 'rgba(255,255,255,0.95)';
        const fontSize = opts.fontSize || Math.max(18, (right - left) / 12);
        ctx.font = `${opts.fontWeight || 700} ${fontSize}px ${opts.fontFamily || 'system-ui, Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(opts.text), centerX, centerY);
        ctx.restore();
      }
    };

    const config: any = {
      type: "doughnut",
      data: {
        labels: ["Open", "In progress", "Completed"],
        datasets: [
          {
            data: [stats.open, stats.in_progress, stats.completed],
            backgroundColor: ["#F59E0B", "#3B82F6", "#10B981"],
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
          legend: { position: "right", labels: { boxWidth: 12, padding: 12, font: { size: 12 } } },
          tooltip: { enabled: true, padding: 10 },
          centerText: { text: stats.total }
        },
        elements: { arc: { borderWidth: 0 } }
      },
      plugins: [centerTextPlugin]
    };

    chartInstance = new Chart(ctx, config);
  });

  $effect(() => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [stats.open, stats.in_progress, stats.completed];
      // update center text
      if (!chartInstance.options.plugins) chartInstance.options.plugins = {};
      chartInstance.options.plugins.centerText = { text: stats.total };
      chartInstance.update();
    }
  })

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });

  type GifEntry = { max: number; url: string; label: string };

  const gifMap: GifEntry[] = [
    { max: 0, url: 'https://media1.tenor.com/m/MNVZ4YfkAAcAAAAC/cat-baby.gif', label: 'All clear' },
    { max: 5, url: 'https://media1.tenor.com/m/XppClGPHUTgAAAAd/cat-kitty.gif', label: 'A few open just relax' },
    { max: 20, url: 'https://media1.tenor.com/m/jTKoN-s5rf4AAAAd/wow-interesting.gif', label: 'Getting busy, start working!' },
    { max: Infinity, url: 'https://media.tenor.com/P2l5BjshgRIAAAAi/cat-meme-gato.gif', label: 'High load, youre throwing' },
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
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
      <div class="col-span-2 p-6 rounded-3xl shadow-2xl h-96 flex items-center justify-center"
           style="background: linear-gradient(135deg, var(--catppuccin-color-mantle), var(--catppuccin-color-crust)); color: var(--catppuccin-color-text);">
        <div class="w-full h-full max-w-2xl max-h-80 relative px-4 py-2">
          <canvas bind:this={chartCanvas} class="w-full h-full rounded-lg"></canvas>

          <!-- quick link to open full map (mp) page -->
          <div class="absolute top-3 right-3">
            <a href="/dashboard/klacht"
               class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold shadow"
               style="background: var(--catppuccin-color-sapphire); color: var(--catppuccin-color-crust);">
              Open map
            </a>
          </div>

        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="p-4 rounded-xl shadow-md"
             style="background: linear-gradient(180deg, var(--catppuccin-color-crust), var(--catppuccin-color-mantle)); color: var(--catppuccin-color-text);">
          <div class="text-sm" style="color: var(--catppuccin-color-mauve);">Open</div>
          <div class="text-2xl font-bold">{Math.round(openVal.current)}</div>
          <div class="text-xs mt-2" style="color: var(--catppuccin-color-text);">In progress: <span class="font-semibold">{Math.round(inProgVal.current)}</span></div>
          <div class="text-xs" style="color: var(--catppuccin-color-text);">Completed: <span class="font-semibold">{Math.round(completedVal.current)}</span></div>
        </div>

        <div class="p-2 rounded-xl bg-ctp-mantle shadow-md overflow-hidden">
          <div class="flex items-center justify-between p-3">
            <div>
              <div class="text-sm text-ctp-text">{gifEntry.label}</div>
            </div>
            <div class="text-xs text-ctp-text">GIF</div>
          </div>
          <div class="h-50 bg-ctp-black">
            <img src={gifEntry.url} alt="fun gif" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <section>
      <h2 class="text-xl font-semibold mb-3">Recent complaints</h2>
      {#if recent && recent.length}
        <div class="grid gap-2">
          {#each recent as k}
            <a class="p-3 rounded bg-ctp-mantle flex justify-between" href={`/dashboard/klacht/${k.id}`}>
              <div>
                <div class="font-semibold">{k.name}</div>
                <div class="text-sm text-ctp-text">{new Date(k.created_at).toLocaleString()}</div>
              </div>
              <div class="text-sm px-3 py-1 rounded bg-ctp-crust">{k.status}</div>
            </a>
          {/each}
        </div>
      {:else}
        <p class="text-sm text-gray-400">No recent complaints.</p>
      {/if}
    </section>
  </div>
</Layout>
