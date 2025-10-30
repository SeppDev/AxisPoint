<script lang="ts">
  // import { Head } from "@inertiajs/svelte"

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
  <div id="map" class="w-full h-full" use:mapAction></div>
</AppLayout>
