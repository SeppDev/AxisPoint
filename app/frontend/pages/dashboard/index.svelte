<script lang="ts">
  import L, { Map } from "leaflet";

  import AppLayout from "@/layouts/app-layout.svelte";
  import { dashboardPath } from "@/routes";
  import { type BreadcrumbItem } from "@/types";

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: dashboardPath(),
    },
  ];

  let map: Map;
  const initialView = [51.924419, 4.477733];
  function createMap(container: HTMLElement) {
    let m = L.map(container, { preferCanvas: true }).setView(
      initialView as any,
      13,
    );
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
        // maxZoom: 0,
      },
    ).addTo(m);

    return m;
  }

  function mapAction(container: HTMLElement) {
    map = createMap(container);
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  let klachten: any[] = $state([]);
  async function getKlachten() {
    let response = await fetch("api/klacht");
    let text = await response.text();
    klachten = JSON.parse(text);

    for (let klacht of klachten) {
      new L.Marker([klacht.latitude, klacht.longitude], {
        title: klacht.name,
      }).addTo(map);
    }
  }

  getKlachten();
</script>

<svelte:head>
  <title>{breadcrumbs[breadcrumbs.length - 1].title}</title>
</svelte:head>

<svelte:window on:resize={resizeMap} />
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
<AppLayout {breadcrumbs}>
  <div class="flex flex-row h-full w-full overflow-none">
    <div class="w-2/3 h-full" use:mapAction></div>
    <div
      class="p-4 w-1/3 flex flex-col h-full overflow-scroll items-center gap-2"
    >
      {#each klachten as klacht}
        {@render Klacht(klacht)}
      {/each}
    </div>
  </div>
</AppLayout>

{#snippet Klacht(klacht: any)}
  <div class="w-full p-4 rounded-xl bg-neutral-700">
    <p class="text-xl">{klacht.name}</p>
    <p class="">{klacht.description}</p>
  </div>
{/snippet}
