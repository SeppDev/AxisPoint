<script lang="ts">
  import { Button } from "@/components/ui/button";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import Layout from "@/layouts/Layout.svelte";

  let dialogOpen = $state(false);
  let dialogDescription = $state("");
  function openDialog(description: string) {
    dialogOpen = true;
    dialogDescription = description;
  }

  let email = $state("");
  let name = $state("");
  let description = $state("");

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(meld, errorCallback, {
        enableHighAccuracy: true,
      });
    } else {
      openDialog("Locatie opvragen mislukt");
    }
  }

  async function meld(position: GeolocationPosition) {
    if (email.length === 0) {
      openDialog("Vul een email in");
      return;
    }
    if (name.length === 0) {
      openDialog("Vul een naam in");
      return;
    }
    if (description.length === 0) {
      openDialog("Vul een beschrijving in");
      return;
    }

    let response = await fetch("/api/klacht", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        klacht: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          name,
          description,
        },
      }),
    });

    console.log(response);
    openDialog("Melding gestuurd");
  }

  function errorCallback() {}

  function onSubmit(event: Event) {
    event.preventDefault();
    getLocation();
  }
</script>

<Layout>
  <Dialog.Root bind:open={dialogOpen}>
    <Dialog.Portal>
      <Dialog.Overlay class="overlay" />
      <Dialog.Content>
        <Dialog.Title>Melding</Dialog.Title>
        <Dialog.Description>{dialogDescription}</Dialog.Description>
        <Dialog.Close>
          <Button>Sluit</Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>

  <div class="flex items-center justify-center h-full w-full">
    <div
      class="md:w-100 md:rounded-xl not-md:justify-end not-md:w-screen not-md:h-screen p-4 flex flex-col bg-ctp-crust"
    >
      <p class="text-2xl font-bold">Melding</p>
      <form class="flex flex-col gap-2">
        <p>Email</p>
        <Input bind:value={email} type="text" />
        <p>Naam</p>
        <Input bind:value={name} type="text" />
        <p>Beschrijving</p>
        <Input bind:value={description} class="h-30" type="area" />
        <p>Foto</p>
        <Input type="file" />
        <Button onclick={onSubmit}>Meld</Button>
      </form>
    </div>
  </div>
</Layout>
