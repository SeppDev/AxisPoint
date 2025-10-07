<script lang="ts">
  import type { Snippet } from "svelte"

  import Navbar from "@/components/navbar.svelte";

  interface Props {
    children: Snippet
  }

  let  {children} : Props = $props()
</script>

<Navbar />
{@render children()}