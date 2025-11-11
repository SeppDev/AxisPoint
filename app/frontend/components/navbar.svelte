<script lang="ts">
  import { sessionPath } from "@/routes";
  import AnimatedSigma from "./AnimatedSigma.svelte";
  import { Link, page, router } from "@inertiajs/svelte";

  // auth user from Inertia shared props (inertia_share in InertiaController)
  let authUser = $state<any>(null);

  $effect(() => {
    return page.subscribe(($page) => {
      authUser = $page.props?.auth?.user ?? null;
    });
  });

  const handleLogout = () => {
    router.flushAll();
  };
</script>

<div
  class=" p-2 bg-ctp-crust h-12 w-screen top-0 z-50 justify-between flex flex-row items-center text-2xl"
>
  <div class="pl-2">
    <a href="/" class="flex items-center gap-2">
      <!-- animated sigma, tilted to the side -->
      <AnimatedSigma size={36} tilt={0} className="text-ctp-text" />
      <span class="text-lg font-extrabold text-ctp-text"
        ><span class=" text-ctp-sapphire">Axis</span>Point</span
      >
    </a>
  </div>
  <nav class="flex items-center gap-4 pr-4">
    <a href="/">home</a>
    <a href="/melden">melden</a>
    {#if authUser}
      <a href="/dashboard">dashboard</a>
      <a href="/users">gebruikers</a>
      <Link
        class="cursor-pointer"
        onclick={handleLogout}
        method="delete"
        href={sessionPath({ id: $page.props.auth.session.id })}>uitloggen</Link
      >
    {:else}
      <a href="/login">login</a>
    {/if}
  </nav>
</div>
