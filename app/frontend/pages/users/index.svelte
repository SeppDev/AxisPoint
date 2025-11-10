<script lang="ts">
  import Layout from "@/layouts/Layout.svelte";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { LoaderCircle } from "@lucide/svelte";
  import Alert, { openDialog } from "@/components/alert.svelte";

  let accountEmail = $state("email@email.com");
  let accountUsername = $state("username");
  let accountPassword = $state("wachtwoord");

  let creating = $state(false);
  async function createAccount() {
    creating = true;

    let form = new FormData();
    form.append("email", accountEmail);
    form.append("name", accountUsername);
    form.append("password", accountPassword);
    form.append("password_confirmation", accountPassword);

    fetch("/api/user", {
      method: "POST",
      body: form,
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .then(() => openDialog("Account is aangemaakt"))
      .catch(() =>
        openDialog("Er ging iets fout tijdens het aanmaken van het account"),
      )
      .finally(() => (creating = false));
  }

  type User = {
    id: number;
    email: string;
    name: string;
  };

  const users: User[] = $state([]);
  fetch("/api/user").then(async (data) => {
    const json: User[] = await data.json();
    users.push(...json);
  });
</script>

<Layout>
  <Alert />
  <div
    class="p-6 max-w-5xl mx-auto flex flex-col-reverse justify-center lg:flex-row gap-4"
  >
    <section class="w-full lg:w-100">
      <h3 class="text-xl font-semibold mb-3">Accounts</h3>
      {#each users as user}
        <div class="bg-ctp-mantle p-3 w-full rounded-xl">
          <p class="text-xl">{user.name}</p>
          <p>{user.email}</p>
        </div>
      {/each}
    </section>

    <section class="w-full lg:w-100">
      <h3 class="text-xl font-semibold mb-3">Maak account</h3>
      <div
        class="p-3 rounded-xl bg-ctp-mantle flex flex-col gap-2 justify-between w-full"
      >
        <p>Email</p>
        <Input bind:value={accountEmail} type="text" />
        <p>Gebruikersnaam</p>
        <Input bind:value={accountUsername} type="text" />
        <p>Wachtwoord</p>
        <Input bind:value={accountPassword} type="password" />
        <Button disabled={creating} onclick={createAccount}>
          {#if creating}
            <LoaderCircle class="h-4 w-4 animate-spin" />
          {/if}
          Maak account</Button
        >
      </div>
    </section>
  </div>
</Layout>
