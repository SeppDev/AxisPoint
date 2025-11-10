<script lang="ts">
  import Layout from "./Layout.svelte";
  import L, { Map } from "leaflet";

  let {
    children,
    klachten,
    initialView,
    showTabs = false,
    selectedStatus = $bindable("all"),
  }: {
    children: any;
    klachten: any[];
    initialView: any[];
    showTabs?: boolean;
    selectedStatus?: string;
  } = $props();

  let map: Map;
  let markers: any[] = [];
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
      const marker = new L.Marker([klacht.latitude, klacht.longitude], {
        title: klacht.name,
      }).addTo(map);
      marker.bindPopup(
        `<a href=\"/dashboard/klacht/${klacht.id}\">${klacht.name}</a><div class=\"text-sm text-gray-400\">Status: ${klacht.status ?? "unknown"}</div>`,
      );
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
  });
</script>

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
      <div class="h-full" use:mapAction></div>
    </div>
    <div
      class="p-4 w-120 flex-col max-h-full overflow-x-none overflow-y-auto items-center gap-2 {showTabs
        ? 'hidden md:flex'
        : 'flex'}"
    >
      {#if showTabs}
        {@render children()}
        {#each klachten.filter((k) => selectedStatus === "all" || k.status === selectedStatus) as klacht}
          <a
            class="klacht-card"
            href={`/dashboard/klacht/${klacht.id}`}
          >
            <div class="klacht-header">
              <h3 class="klacht-name">{klacht.name}</h3>
              <span class="status-badge status-{klacht.status || 'open'}">
                {klacht.status === 'in_progress' ? 'In Behandeling' : klacht.status === 'completed' ? 'Afgerond' : 'Open'}
              </span>
            </div>
            <p class="klacht-description">{klacht.description}</p>
            {#if klacht.email}
              <div class="klacht-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span class="email-text">{klacht.email}</span>
              </div>
            {/if}
          </a>
        {/each}
      {:else}
        {@render children()}
      {/if}
    </div>
  </div>
</Layout>

<style>
  .klacht-card {
    width: 100%;
    padding: 1rem;
    border-radius: 0.75rem;
    background: linear-gradient(145deg, rgba(55, 65, 81, 0.9), rgba(31, 41, 55, 0.9));
    border: 1px solid rgba(75, 85, 99, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .klacht-card:hover {
    transform: translateX(4px);
    border-color: rgba(96, 165, 250, 0.5);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1);
    background: linear-gradient(145deg, rgba(55, 65, 81, 1), rgba(31, 41, 55, 1));
  }

  .klacht-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .klacht-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0;
    flex: 1;
    line-height: 1.3;
  }

  .status-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .status-open {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
  }

  .status-in_progress {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #fff;
  }

  .status-completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
  }

  .klacht-description {
    font-size: 0.875rem;
    color: #d1d5db;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .klacht-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #9ca3af;
    padding-top: 0.25rem;
    border-top: 1px solid rgba(75, 85, 99, 0.3);
  }

  .klacht-meta svg {
    flex-shrink: 0;
  }

  .email-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
