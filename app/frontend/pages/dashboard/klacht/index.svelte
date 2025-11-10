<script lang="ts">
  import KlachtLayout from "@/layouts/KlachtLayout.svelte";

  const initialView = [51.924419, 4.477733];

  interface Klacht {
    id: number;
    name: string;
    description: string;
    email?: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    status?: string;
  }

  let { klachten }: { klachten: Klacht[] } = $props();

  let selectedStatus = $state("all");

  // Calculate stats with W sigma energy using runes
  const stats = $derived({
    total: klachten.length,
    open: klachten.filter((k) => k.status === "open").length,
    in_progress: klachten.filter((k) => k.status === "in_progress").length,
    completed: klachten.filter((k) => k.status === "completed").length,
  });

  const completionRate = $derived(
    stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0
  );
</script>

<KlachtLayout {klachten} {initialView} showTabs={true} bind:selectedStatus>
  <div class="sigma-dashboard">
    <!-- W Sigma Stats Header -->
    <div class="stats-container">
      <button 
        class="stat-card stat-total {selectedStatus === 'all' ? 'active' : ''}"
        onclick={() => selectedStatus = "all"}
      >
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-label">Totaal Klachten</div>
          <div class="stat-value">{stats.total}</div>
        </div>
      </button>

      <button 
        class="stat-card stat-open {selectedStatus === 'open' ? 'active' : ''}"
        onclick={() => selectedStatus = "open"}
      >
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-label">Open</div>
          <div class="stat-value">{stats.open}</div>
        </div>
      </button>

      <button 
        class="stat-card stat-progress {selectedStatus === 'in_progress' ? 'active' : ''}"
        onclick={() => selectedStatus = "in_progress"}
      >
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-label">In Behandeling</div>
          <div class="stat-value">{stats.in_progress}</div>
        </div>
      </button>

      <button 
        class="stat-card stat-completed {selectedStatus === 'completed' ? 'active' : ''}"
        onclick={() => selectedStatus = "completed"}
      >
        <div class="stat-icon">✨</div>
        <div class="stat-content">
          <div class="stat-label">Afgerond</div>
          <div class="stat-value">{stats.completed}</div>
        </div>
      </button>
    </div>

    <!-- Completion Progress Bar - Pure W -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Voltooiingspercentage</span>
        <span class="progress-percentage">{completionRate}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {completionRate}%"></div>
      </div>
    </div>
  </div>
</KlachtLayout>

<style>
  .sigma-dashboard {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: linear-gradient(145deg, var(--catppuccin-color-mantle, #1f2937) 80%, var(--catppuccin-color-base, #111827) 100%);
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--catppuccin-color-surface0, #6b7280);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .stat-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: var(--catppuccin-color-blue, #93c5fd);
  }

  .stat-card.active {
    border: 2px solid var(--catppuccin-color-blue, #60a5fa);
    box-shadow: 0 0 20px var(--catppuccin-color-blue, #60a5fa);
    transform: scale(1.05);
  }

  .stat-total:hover {
    border-color: var(--catppuccin-color-blue, #60a5fa);
  }

  .stat-open:hover {
    border-color: var(--catppuccin-color-red, #f87171);
  }

  .stat-progress:hover {
    border-color: var(--catppuccin-color-peach, #fbbf24);
  }

  .stat-completed:hover {
    border-color: var(--catppuccin-color-green, #4ade80);
  }

  .stat-icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }

  .stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--catppuccin-color-subtext1, #9ca3af);
  }

  .stat-value {
    font-size: 1.875rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--catppuccin-color-blue, #60a5fa) 0%, var(--catppuccin-color-mauve, #a78bfa) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }

  .progress-section {
    background: var(--catppuccin-color-mantle, #1f2937);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid var(--catppuccin-color-surface0, #6b7280);
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .progress-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--catppuccin-color-subtext1, #d1d5db);
  }

  .progress-percentage {
    font-size: 1.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--catppuccin-color-green, #34d399) 0%, var(--catppuccin-color-teal, #10b981) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .progress-bar {
    height: 1.25rem;
    background: var(--catppuccin-color-base, #111827);
    border-radius: 9999px;
    overflow: hidden;
    border: 1px solid var(--catppuccin-color-surface0, #6b7280);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--catppuccin-color-teal, #10b981) 0%, var(--catppuccin-color-green, #34d399) 50%, var(--catppuccin-color-mint, #6ee7b7) 100%);
    border-radius: 9999px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 20px var(--catppuccin-color-teal, #10b981);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  @media (max-width: 768px) {
    .stats-container {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .stat-icon {
      font-size: 1.5rem;
    }
  }
</style>
