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
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: linear-gradient(145deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(107, 114, 128, 0.2);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .stat-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: rgba(147, 197, 253, 0.5);
  }

  .stat-card.active {
    border: 2px solid rgba(96, 165, 250, 0.8);
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
    transform: scale(1.05);
  }

  .stat-total:hover {
    border-color: rgba(96, 165, 250, 0.6);
  }

  .stat-open:hover {
    border-color: rgba(248, 113, 113, 0.6);
  }

  .stat-progress:hover {
    border-color: rgba(251, 191, 36, 0.6);
  }

  .stat-completed:hover {
    border-color: rgba(74, 222, 128, 0.6);
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
    color: rgba(156, 163, 175, 1);
  }

  .stat-value {
    font-size: 1.875rem;
    font-weight: 800;
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }

  .progress-section {
    background: rgba(31, 41, 55, 0.6);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid rgba(107, 114, 128, 0.2);
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
    color: rgba(209, 213, 219, 1);
  }

  .progress-percentage {
    font-size: 1.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .progress-bar {
    height: 1.25rem;
    background: rgba(17, 24, 39, 0.8);
    border-radius: 9999px;
    overflow: hidden;
    border: 1px solid rgba(107, 114, 128, 0.3);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
    border-radius: 9999px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
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
