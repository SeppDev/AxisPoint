<script lang="ts">
  import KlachtLayout from "@/layouts/KlachtLayout.svelte";

  const initialView = [51.924419, 4.477733];
 

  let klachten: any[] = $state([]);
  async function getKlachten() {
    let response = await fetch("/api/klacht");
    let text = await response.text();
    klachten = JSON.parse(text);

    return klachten
  }

  getKlachten();

</script>

<KlachtLayout {klachten} {initialView}>
  {#await getKlachten()}
    <p>loading...</p>
  {:then klachten} 
  {#each klachten as klacht, index}
    {@render Klacht(index, klacht)}
  {/each}
  {/await}
</KlachtLayout>

{#snippet Klacht(index: number, klacht: any)}
  <div class="w-full p-4 rounded-xl bg-neutral-700">
    <p class="text-xl">{klacht.name}</p>
    <p class="">{klacht.description}</p>
  </div>
{/snippet}
