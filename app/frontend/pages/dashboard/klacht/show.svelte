<script lang="ts">
  import KlachtLayout from "@/layouts/KlachtLayout.svelte";

  interface Klacht {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    status?: string;
    email?: string;
  }

  async function onStatusChange(e: Event) {
    const newStatus = (e.target as HTMLSelectElement).value;

    try {
      const res = await fetch(`/api/klacht/${klacht.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          klacht: { status: newStatus, updated_at: Date.now() },
        }),
      });

      if (!res.ok) {
        console.error("Failed to update status", await res.text());
        return;
      }

      const payload = await res.json();
      if (payload.klacht && payload.klacht.status) {
        klacht.status = payload.klacht.status;
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  }

  let { klacht, image_url }: { klacht: Klacht; image_url?: string } = $props();

  const initialView = [klacht.latitude, klacht.longitude];
</script>

<KlachtLayout {initialView} klachten={[klacht]}>
  <div class="relative max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div
      class="relative z-10 bg-ctp-crust backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg h-full"
    >
      {#if image_url}
        <img
          src={image_url}
          alt={klacht?.name}
          class="w-full object-cover h-48 sm:h-72 md:h-96 rounded-md mb-4"
        />
      {/if}

      <h1 class="text-2xl sm:text-3xl md:text-3xl font-extrabold mb-3">
        {klacht?.name}
      </h1>

      {#if klacht?.email}
        <p class="text-base text-gray-300 mb-2">Email: {klacht.email}</p>
      {/if}

      {#if klacht?.description}
        <p class="text-lg sm:text-base leading-relaxed">{klacht.description}</p>
      {:else}
        <p class="text-lg text-gray-500">No description provided.</p>
      {/if}
      <div
        class="mt-4 flex flex-row justify-between sm:flex-row sm:items-center sm:space-x-4"
      >
        <div class="flex-1">
          <p class="block text-lg font-bold mb-2">Status</p>
          <select
            bind:value={klacht.status}
            onchange={onStatusChange}
            class="sm:w-auto block px-3 py-2 rounded bg-neutral-800 text-sm"
          >
            <option value="open">Open</option>
            <option value="in_progress">In behandeling</option>
            <option value="completed">Compleet</option>
          </select>
        </div>

        <div
          class="mt-3 sm:mt-0 text-sm text-gray-400 h-full flex flex-col justify-between"
        >
          <p class="">
            updated: {new Date(klacht.updated_at).toLocaleString()}
          </p>
          <p class="">
            created: {new Date(klacht.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
</KlachtLayout>
