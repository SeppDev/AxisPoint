<script lang="ts">
  import Layout from "./Layout.svelte";
  import L, { Map } from "leaflet";
  import "leaflet.markercluster";

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
  let markerClusterGroup: any = null;
  let refreshTimeout: any = null;
  
  // Virtual scrolling state
  let scrollContainer: HTMLElement | null = null;
  let scrollTop = $state(0);
  let containerHeight = $state(0);
  const itemHeight = 140; // Approximate height of each klacht card in pixels
  
  // Calculate visible items for virtual scrolling
  const visibleRange = $derived(() => {
    const filteredKlachten = klachten.filter(
      (k) => selectedStatus === "all" || k.status === selectedStatus
    );
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      filteredKlachten.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + 1
    );
    return { startIndex, endIndex };
  });
  
  const visibleKlachten = $derived(() => {
    const filteredKlachten = klachten.filter(
      (k) => selectedStatus === "all" || k.status === selectedStatus
    );
    const { startIndex, endIndex } = visibleRange();
    return filteredKlachten.slice(startIndex, endIndex).map((klacht, idx) => ({
      ...klacht,
      virtualIndex: startIndex + idx,
    }));
  });
  
  const totalHeight = $derived(() => {
    const filteredCount = klachten.filter(
      (k) => selectedStatus === "all" || k.status === selectedStatus
    ).length;
    return filteredCount * itemHeight;
  });
  
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    scrollTop = target.scrollTop;
    containerHeight = target.clientHeight;
  }
  
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
    
    // Clear timeout if exists to debounce rapid updates
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    refreshTimeout = setTimeout(() => {
      // Remove existing cluster group
      if (markerClusterGroup) {
        map.removeLayer(markerClusterGroup);
      }

      // Create new marker cluster group with optimized settings
      markerClusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      // Filter klachten based on selectedStatus
      const filteredKlachten = klachten.filter(
        (k) => selectedStatus === "all" || k.status === selectedStatus
      );

      // Add markers to cluster group in batches for better performance
      const batchSize = 100;
      for (let i = 0; i < filteredKlachten.length; i += batchSize) {
        const batch = filteredKlachten.slice(i, i + batchSize);
        const markers = batch.map(klacht => {
          const statusLabel = klacht.status === 'in_progress' ? 'In Behandeling' : 
                            klacht.status === 'completed' ? 'Afgerond' : 'Open';
          const marker = L.marker([klacht.latitude, klacht.longitude], {
            title: klacht.name,
          });
          marker.bindPopup(
            `<a href="/dashboard/klacht/${klacht.id}">${klacht.name}</a><div class="text-sm text-gray-400">Status: ${statusLabel}</div>`,
          );
          return marker;
        });
        markerClusterGroup.addLayers(markers);
      }

      map.addLayer(markerClusterGroup);
    }, 150); // Debounce delay
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
      selectedStatus; // track selectedStatus
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
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
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
      onscroll={handleScroll}
      bind:this={scrollContainer}
    >
      {#if showTabs}
        {@render children()}
        <!-- Virtual scrolling container -->
        <div style="height: {totalHeight()}px; position: relative; width: 100%;">
          {#each visibleKlachten() as klacht (klacht.id)}
            <a
              class="klacht-card"
              href={`/dashboard/klacht/${klacht.id}`}
              style="position: absolute; top: {klacht.virtualIndex * itemHeight}px; width: calc(100% - 0.5rem);"
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
        </div>
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
    background: var(--catppuccin-color-mantle, #232634);
    border: 1px solid var(--catppuccin-color-surface0, #45475a);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .klacht-card:hover {
    transform: translateX(4px);
    border-color: var(--catppuccin-color-blue, #89b4fa);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px var(--catppuccin-color-blue, #89b4fa);
    background: var(--catppuccin-color-base, #181825);
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
    color: var(--catppuccin-color-text, #cdd6f4);
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
    background: var(--catppuccin-color-red, #f38ba8);
    color: var(--catppuccin-color-crust, #11111b);
  }

  .status-in_progress {
    background: var(--catppuccin-color-peach, #fab387);
    color: var(--catppuccin-color-crust, #11111b);
  }

  .status-completed {
    background: var(--catppuccin-color-green, #a6e3a1);
    color: var(--catppuccin-color-crust, #11111b);
  }

  .klacht-description {
    font-size: 0.875rem;
    color: var(--catppuccin-color-subtext0, #a6adc8);
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .klacht-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--catppuccin-color-subtext1, #9399b2);
    padding-top: 0.25rem;
    border-top: 1px solid var(--catppuccin-color-surface0, #45475a);
  }

  .klacht-meta svg {
    flex-shrink: 0;
  }

  .email-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Marker Cluster Styling - Catppuccin theme */
  :global(.marker-cluster-small) {
    background-color: var(--catppuccin-color-blue, #89b4fa) !important;
  }

  :global(.marker-cluster-small div) {
    background-color: var(--catppuccin-color-sapphire, #74c7ec) !important;
    color: var(--catppuccin-color-crust, #11111b) !important;
    font-weight: 700;
  }

  :global(.marker-cluster-medium) {
    background-color: var(--catppuccin-color-peach, #fab387) !important;
  }

  :global(.marker-cluster-medium div) {
    background-color: var(--catppuccin-color-yellow, #f9e2af) !important;
    color: var(--catppuccin-color-crust, #11111b) !important;
    font-weight: 700;
  }

  :global(.marker-cluster-large) {
    background-color: var(--catppuccin-color-red, #f38ba8) !important;
  }

  :global(.marker-cluster-large div) {
    background-color: var(--catppuccin-color-maroon, #eba0ac) !important;
    color: var(--catppuccin-color-crust, #11111b) !important;
    font-weight: 700;
  }
</style>
