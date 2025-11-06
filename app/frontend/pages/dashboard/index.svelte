<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
  import { onMount, onDestroy } from "svelte";
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

  onMount(() => {
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext("2d");
    if (!ctx) return;

    chartInstance = new Chart(ctx, {
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
        cutout: "70%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } },
          tooltip: { enabled: true },
        },
      },
    });
  });

  $effect(() => { if (chartInstance) {
    chartInstance.data.datasets[0].data = [stats.open, stats.in_progress, stats.completed];
    chartInstance.update();
  }})

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
</script>

<Layout>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center">
      <div class="col-span-2 p-6 rounded-lg bg-neutral-800 h-64 flex items-center justify-center">
        <div class="w-full h-full max-w-md max-h-56 relative">
          <canvas bind:this={chartCanvas}></canvas>
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div class="text-center">
              <div class="text-sm text-gray-400">Total!</div>
              <div class="text-2xl font-bold">{stats.total}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-lg bg-neutral-800 text-center h-64 flex flex-col justify-center">
        <p class="text-sm text-gray-400">Open</p>
        <p class="text-2xl font-bold">{stats.open}</p>
        <p class="text-sm mt-2 text-gray-400">In progress: {stats.in_progress}</p>
        <p class="text-sm mt-1 text-gray-400">Completed: {stats.completed}</p>
      </div>
    </div>

    <section>
      <h2 class="text-xl font-semibold mb-3">Recent complaints</h2>
      {#if recent && recent.length}
        <div class="grid gap-2">
          {#each recent as k}
            <a class="p-3 rounded bg-neutral-700 flex justify-between" href={`/dashboard/klacht/${k.id}`}>
              <div>
                <div class="font-semibold">{k.name}</div>
                <div class="text-sm text-gray-400">{new Date(k.created_at).toLocaleString()}</div>
              </div>
              <div class="text-sm px-3 py-1 rounded bg-neutral-800">{k.status}</div>
            </a>
          {/each}
        </div>
      {:else}
        <p class="text-sm text-gray-400">No recent complaints.</p>
      {/if}
    </section>
  </div>
</Layout>
