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
