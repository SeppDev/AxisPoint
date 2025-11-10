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
    email?: string;
  }

  async function onStatusChange(e: Event) {
    const newStatus = (e.target as HTMLSelectElement).value;

    try {
      const res = await fetch(`/api/klacht/${klacht.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          klacht: { status: newStatus, updated_at: Date.now() },
        }),
      });

      if (!res.ok) {
        console.error("Failed to update status", await res.text());
        return;
      }

      const payload = await res.json();
      if (payload.klacht && payload.klacht.status) {
        klacht.status = payload.klacht.status;
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  }

  let { klacht, image_url }: { klacht: Klacht; image_url?: string } = $props();

  const initialView = [klacht.latitude, klacht.longitude];
</script>

<KlachtLayout {initialView} klachten={[klacht]}>
  <div class="klacht-detail">
    <div class="detail-card">
      {#if image_url}
        <img
          src={image_url}
          alt={klacht?.name}
          class="klacht-image"
        />
      {/if}

      <div class="header-row">
        <h1 class="klacht-title">{klacht?.name}</h1>
        <span class="status-badge status-{klacht.status || 'open'}">
          {klacht.status === 'in_progress' ? 'In Behandeling' : klacht.status === 'completed' ? 'Afgerond' : 'Open'}
        </span>
      </div>

      {#if klacht?.email}
        <div class="email-section">
          <span class="label">Email:</span>
          <span class="value">{klacht.email}</span>
        </div>
      {/if}

      {#if klacht?.description}
        <div class="description-section">
          <span class="label">Beschrijving:</span>
          <p class="description">{klacht.description}</p>
        </div>
      {/if}

      <div class="status-section">
        <label class="label">Status Wijzigen</label>
        <select
          bind:value={klacht.status}
          onchange={onStatusChange}
          class="status-select"
        >
          <option value="open">Open</option>
          <option value="in_progress">In behandeling</option>
          <option value="completed">Afgerond</option>
        </select>
      </div>

      <div class="timestamps">
        <div class="timestamp-item">
          <span class="label">Laatst bijgewerkt</span>
          <span class="value">{new Date(klacht.updated_at).toLocaleDateString('nl-NL')}</span>
        </div>
        <div class="timestamp-item">
          <span class="label">Aangemaakt</span>
          <span class="value">{new Date(klacht.created_at).toLocaleDateString('nl-NL')}</span>
        </div>
      </div>
    </div>
  </div>
</KlachtLayout>

<style>
  .klacht-detail {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
  }

  .detail-card {
    background: var(--catppuccin-color-mantle);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    border: 1px solid var(--catppuccin-color-surface0);
  }

  .klacht-image {
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--catppuccin-color-surface0);
  }

  .klacht-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--catppuccin-color-text);
    margin: 0;
    flex: 1;
  }

  .status-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .status-open {
    background: var(--catppuccin-color-red);
    color: var(--catppuccin-color-crust);
  }

  .status-in_progress {
    background: var(--catppuccin-color-peach);
    color: var(--catppuccin-color-crust);
  }

  .status-completed {
    background: var(--catppuccin-color-green);
    color: var(--catppuccin-color-crust);
  }

  .email-section,
  .description-section,
  .status-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--catppuccin-color-subtext1);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .value {
    font-size: 0.9375rem;
    color: var(--catppuccin-color-text);
  }

  .description {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--catppuccin-color-subtext0);
    margin: 0;
  }

  .status-select {
    background: var(--catppuccin-color-base);
    border: 1px solid var(--catppuccin-color-surface0);
    color: var(--catppuccin-color-text);
    padding: 0.625rem 0.875rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .status-select:hover {
    border-color: var(--catppuccin-color-blue);
  }

  .status-select:focus {
    outline: none;
    border-color: var(--catppuccin-color-blue);
  }

  .status-select option {
    background: var(--catppuccin-color-base);
    color: var(--catppuccin-color-text);
  }

  .timestamps {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--catppuccin-color-surface0);
  }

  .timestamp-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  @media (max-width: 768px) {
    .header-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .timestamps {
      flex-direction: column;
    }
  }
</style>
