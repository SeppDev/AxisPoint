<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  let accountEmail = $state("");
  let accountPassword = $state("");
  async function createAccount() {}
</script>

<Layout>
  <div class="p-6 max-w-5xl mx-auto flex flex-col gap-4">
    <section>
      <h3 class="text-xl font-semibold mb-3">Maak account</h3>
      <div
        class="p-3 rounded bg-ctp-mantle flex flex-col gap-2 justify-between max-w-full w-120"
      >
        <p>Email</p>
        <Input bind:value={accountEmail} type="text" />
        <p>Wachtwoord</p>
        <Input bind:value={accountPassword} type="password" />
        <Button onclick={createAccount}>Maak account</Button>
      </div>
    </section>
  </div>
</Layout>
