<script lang="ts">
  import Logo from "./logo.svelte";
  import { page } from "@inertiajs/svelte";

  // auth user from Inertia shared props (inertia_share in InertiaController)
  let authUser = $state<any>(null);

  $effect(() => {
    return page.subscribe(($page) => {
      authUser = $page.props?.auth?.user ?? null;
    });
  });
</script>

<div
  class=" p-2 bg-ctp-crust h-12 w-screen top-0 z-50 justify-between flex flex-row text-2xl"
>
  <div>
    <!-- <Logo /> -->
  </div>
  <nav>
    <a href="/">home</a>
    <a href="/melden">melden</a>
    {#if authUser}
      <a href="/dashboard">dashboard</a>
    {:else}
      <a href="/login">login</a>
    {/if}
  </nav>
</div>
