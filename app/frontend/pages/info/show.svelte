<script lang="ts">
  import AppLayout from "@/layouts/app-layout.svelte";
  import { dashboardPath, infoPath } from "@/routes";
  import L, { Map } from "leaflet";

  import { type BreadcrumbItem } from "@/types";

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

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: dashboardPath(),
    },
    {
      title: "klacht",
      href: "",
    },
    {
      title: `klacht: ${klacht.id} "${klacht.name}"`,
      href: infoPath(klacht.id),
    },
  ];

  let map: Map;
  const initialView = [klacht.latitude, klacht.longitude];
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
    let marker = L.marker([klacht.latitude, klacht.longitude]).addTo(map);
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
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
  <div class="flex w-full flex-row h-full">
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

    <div id="map" class="w-full h-full" use:mapAction></div>
  </div>
</AppLayout>
