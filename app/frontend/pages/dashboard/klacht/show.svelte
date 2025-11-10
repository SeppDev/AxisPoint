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
    contact_email?: string;
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

  let showImageModal = $state(false);
</script>

<KlachtLayout {initialView} klachten={[klacht]}>
  <div class="back-btn-row">
    <a href="/dashboard/klacht" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:0.5em;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Terug naar kaart
    </a>
  </div>
  <div class="klacht-detail">
    <div class="detail-card">
      {#if image_url}
        <img
          src={image_url}
          alt={klacht?.name}
          class="klacht-image clickable"
          onclick={() => showImageModal = true}
          title="Klik om te vergroten"
        />
        {#if showImageModal}
          <div class="modal-overlay" onclick={() => showImageModal = false}>
            <div class="modal-content" >
              <img src={image_url} alt={klacht?.name} class="modal-image" />
              <button class="modal-close" onclick={() => showImageModal = false} title="Sluiten">&times;</button>
            </div>
          </div>
        {/if}
      {/if}

      <div class="header-row">
        <h1 class="klacht-title">{klacht?.name}</h1>
        <span class="status-badge status-{klacht.status || 'open'}">
          {klacht.status === 'in_progress' ? 'In Behandeling' : klacht.status === 'completed' ? 'Afgerond' : 'Open'}
        </span>
      </div>

      {#if klacht?.contact_email}
        <div class="email-section-wrapper">
          <span class="label">Contact Email</span>
          <div class="email-card">
            <div class="email-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="email-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span class="email-address">{klacht.contact_email}</span>
            </div>
            <a 
              href="mailto:{klacht.contact_email}?subject=Re: {encodeURIComponent(klacht.name)}&body=Beste melder,%0D%0A%0D%0ABetreft uw melding: {encodeURIComponent(klacht.name)}%0D%0A%0D%0A" 
              class="email-button"
              title="Email verzenden naar melder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Email Verzenden
            </a>
          </div>
        </div>
      {/if}

      {#if klacht?.description}
        <div class="description-section">
          <span class="label">Beschrijving:</span>
          <p class="description">{klacht.description}</p>
        </div>
      {/if}

      <div class="status-section">
        <p class="label">Status Wijzigen</p>
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

  .clickable {
    cursor: zoom-in;
    transition: box-shadow 0.2s;
  }
  .clickable:hover {
    box-shadow: 0 4px 24px rgba(137,180,250,0.18);
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

  .email-section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .email-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: var(--catppuccin-color-base, #181825);
    border: 1px solid var(--catppuccin-color-surface0, #45475a);
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }

  .email-card:hover {
    border-color: var(--catppuccin-color-blue, #89b4fa);
    box-shadow: 0 4px 12px rgba(137, 180, 250, 0.1);
  }

  .email-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .email-icon {
    flex-shrink: 0;
    color: var(--catppuccin-color-blue, #89b4fa);
  }

  .email-address {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--catppuccin-color-text, #cdd6f4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .email-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.125rem;
    background: var(--catppuccin-color-blue, #89b4fa);
    color: var(--catppuccin-color-crust, #11111b);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(137, 180, 250, 0.2);
    white-space: nowrap;
  }

  .email-button:hover {
    background: var(--catppuccin-color-sapphire, #74c7ec);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(137, 180, 250, 0.3);
  }

  .email-button:active {
    transform: translateY(0);
  }

  .email-button svg {
    flex-shrink: 0;
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
.back-btn-row {
  margin-bottom: 1.25rem;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: var(--catppuccin-color-base, #181825);
  color: var(--catppuccin-color-blue, #89b4fa);
  border: 1px solid var(--catppuccin-color-blue, #89b4fa);
  border-radius: 0.5em;
  padding: 0.5em 1.1em;
  font-size: 1em;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.back-btn:hover {
  background: var(--catppuccin-color-blue, #89b4fa);
  color: var(--catppuccin-color-base, #181825);
  border-color: var(--catppuccin-color-blue, #89b4fa);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: var(--catppuccin-color-base, #181825);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(30,32,48,0.25);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image {
  max-width: 80vw;
  max-height: 70vh;
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(137,180,250,0.18);
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.9rem;
  background: none;
  border: none;
  color: var(--catppuccin-color-text, #cdd6f4);
  font-size: 2.2rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--catppuccin-color-red, #f38ba8);
}
</style>

