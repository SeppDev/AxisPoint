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
  }


  async function onStatusChange(e: Event) {
    const newStatus = (e.target as HTMLSelectElement).value;

    try {
      const res = await fetch(`/api/klacht/${klacht.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ klacht: { status: newStatus } })
      });

      if (!res.ok) {
        console.error('Failed to update status', await res.text());
        return;
      }

      const payload = await res.json();
      // update local klacht with returned attributes if present
      if (payload.klacht && payload.klacht.status) {
        klacht.status = payload.klacht.status;
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  }

  let { klacht, image_url }: { klacht: Klacht; image_url?: string } = $props();

  const initialView = [klacht.latitude, klacht.longitude];
  
</script>

<KlachtLayout {initialView} klachten={[klacht]} >
    <div class="max-w-3xl mx-auto p-6">
      {#if image_url}
        <img
          src={image_url}
          alt={klacht?.name}
          class="w-full max-h-[400px] rounded-md mb-4"
        />
      {/if}

      <h1 class="text-2xl font-bold mb-4">{klacht?.name}</h1>
      <div class="mb-4">
        <p class="block text-sm font-medium mb-2">Status</p>
        <select bind:value={klacht.status} onchange={onStatusChange} class="px-3 py-2 rounded bg-neutral-800">
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {#if klacht?.description}
        <p class="text-base leading-relaxed">{klacht.description}</p>
      {:else}
        <p class="text-sm text-gray-500">No description provided.</p>
      {/if}

      <div>
        <p>created at: {klacht.created_at}</p>
      </div>
    </div>

</KlachtLayout>
