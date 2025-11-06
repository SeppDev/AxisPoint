<script lang="ts">
  import Layout from "./Layout.svelte";
  import L, { Map } from "leaflet";

  let {
    children,
    klachten,
    initialView,
  }: { children: any; klachten: any[]; initialView: any[] } = $props();

  let selectedStatus: string = $state('all');

  let map: Map;
  let markers: any[] = [];
  function createMap(container: HTMLElement) {
    let m = L.map(container, { preferCanvas: true }).setView(
      initialView as any,
      13
    );
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
        // maxZoom: 0,
      }
    ).addTo(m);

    return m;
  }
  function refreshMarkers() {
    if (!map) return;
    // remove existing markers
    for (const m of markers) {
      try {
        m.remove();
      } catch (e) {
        /* ignore */
      }
    }
    markers = [];

    for (let klacht of klachten) {
      // filter by selectedStatus
      if (selectedStatus !== 'all' && klacht.status !== selectedStatus) continue;

      const marker = new L.Marker([klacht.latitude, klacht.longitude], {
        title: klacht.name,
      }).addTo(map);
      marker.bindPopup(`<a href=\"/dashboard/klacht/${klacht.id}\">${klacht.name}</a><div class=\"text-sm text-gray-400\">Status: ${klacht.status ?? 'unknown'}</div>`);
      markers.push(marker);
    }
  }

  function mapAction(container: HTMLElement) {
    map = createMap(container);
    refreshMarkers();
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  $effect(() => {
    if (map && klachten) {
      refreshMarkers();
    }
  });

  // react to status changes and refresh markers
  $effect(() => {
  if (map) {
      refreshMarkers();
  }
  }) 
</script>

<style>
  .klacht-tabs { display: flex; gap: 0.5rem; margin: 0.5rem; }
  .klacht-tab { padding: 0.35rem 0.6rem; border-radius: 6px; cursor: pointer; }
  .klacht-tab.active { background: #374151; color: white; }
</style>

<svelte:window on:resize={resizeMap} />
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>

<Layout>
  <div class="flex flex-row flex-grow h-full w-full overflow-none">
    <div class="grow h-full">
      <div class="klacht-tabs" >
        <button class="klacht-tab {selectedStatus === 'all' ? 'active' : ''}" onclick={() => (selectedStatus = 'all')}>All</button>
        <button class="klacht-tab {selectedStatus === 'open' ? 'active' : ''}" onclick={() => (selectedStatus = 'open')}>Open</button>
        <button class="klacht-tab {selectedStatus === 'in_progress' ? 'active' : ''}" onclick={() => (selectedStatus = 'in_progress')}>In progress</button>
        <button class="klacht-tab {selectedStatus === 'completed' ? 'active' : ''}" onclick={() => (selectedStatus = 'completed')}>Completed</button>
      </div>
      <div class="h-full" use:mapAction></div>
    </div>
    <div
      class="p-4 w-120 flex flex-col max-h-full overflow-x-none overflow-y-auto items-center gap-2"
    >
      {@render children()}
    </div>
  </div>
</Layout>
