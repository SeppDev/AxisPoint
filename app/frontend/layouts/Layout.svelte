<script lang="ts">
  import type { Snippet } from "svelte";

  import Navbar from "@/components/navbar.svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div
  class="flex flex-col flex-grow overflow-none max-h-screen h-screen w-screen"
>
  <Navbar />
  <main class="grow overflow-auto">
    {@render children()}
  </main>
</div>
