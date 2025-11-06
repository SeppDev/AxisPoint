<script lang="ts">
  import KlachtLayout from "@/layouts/KlachtLayout.svelte";

  const initialView = [51.924419, 4.477733];
 

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


  let { klachten}: { klachten: Klacht[] } = $props();
  

</script>

<KlachtLayout {klachten} {initialView}>
  {#each klachten as klacht, index}
    {@render Klacht(index, klacht)}
  {/each}
</KlachtLayout>

{#snippet Klacht(index: number, klacht: any)}
  <a class="w-full p-4 rounded-xl bg-neutral-700" href="/dashboard/klacht/{klacht.id}">
    <p class="text-xl">{klacht.name}</p>
    <p class="">{klacht.description}</p>
  </a>
{/snippet}
