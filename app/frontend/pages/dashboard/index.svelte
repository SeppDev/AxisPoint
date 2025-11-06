<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";

  interface Stats {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
  }

  let { stats, recent }: { stats: Stats; recent: any[] } = $props();
</script>

<Layout>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="p-4 rounded-lg bg-neutral-800 text-center">
        <p class="text-sm text-gray-400">Total</p>
        <p class="text-2xl font-bold">{stats.total}</p>
      </div>
      <div class="p-4 rounded-lg bg-yellow-700 text-center">
        <p class="text-sm">Open</p>
        <p class="text-2xl font-bold">{stats.open}</p>
      </div>
      <div class="p-4 rounded-lg bg-blue-700 text-center">
        <p class="text-sm">In progress</p>
        <p class="text-2xl font-bold">{stats.in_progress}</p>
      </div>
      <div class="p-4 rounded-lg bg-green-700 text-center">
        <p class="text-sm">Completed</p>
        <p class="text-2xl font-bold">{stats.completed}</p>
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
