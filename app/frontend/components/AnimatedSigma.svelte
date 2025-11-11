<script lang="ts">
  export let size: number | string = 36;
  export let tilt: number = 45; // degrees
  export let className: string = "text-ctp-text";
  export let title: string = "Sigma";
</script>

<div
  class="animated-sigma block"
  style="width:{size}px; height:{size}px; transform: rotate({tilt}deg);"
>
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    class={className}
  >
    <defs>
      <linearGradient id="asg1" x1="0%" x2="100%">
        <stop offset="0%" stop-color="var(--catppuccin-color-mauve-900)" />
        <stop offset="100%" stop-color="var(--catppuccin-color-sapphire)" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="24" fill="url(#asg1)" opacity="0.06" />
    <g transform="translate(20,20)">
      <path
        d="M10 10 H140 L30 90 H140"
        fill="none"
        stroke="url(#asg1)"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="sigma-path"
      />
      <circle cx="150" cy="150" r="6" fill="var(--catppuccin-color-peach)" />
    </g>
  </svg>
</div>

<style>
  .animated-sigma {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
    transition: transform 200ms ease;
  }

  .animated-sigma:hover {
    transform: scale(1.02) rotate(var(--tilt, 45deg));
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .sigma-path {
    filter: drop-shadow(0 6px 10px rgba(124, 58, 237, 0.22));
    animation: spin-slight 6s linear infinite;
    transform-origin: 50% 50%;
  }

  @keyframes spin-slight {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(6deg) scale(1.03);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .sigma-path {
      animation: none;
    }
    .animated-sigma {
      transition: none;
    }
  }
</style>
