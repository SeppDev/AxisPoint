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
  let image: File | null = $state(null);

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
    
    const formData = new FormData();
    formData.append("klacht[name]", name);
    formData.append("klacht[description]", description);
    formData.append("klacht[longitude]", position.coords.longitude.toString());
    formData.append("klacht[latitude]", position.coords.latitude.toString());

    if (image) {
      formData.append("klacht[image]", image);
    }

    let response = await fetch("/api/klacht", {
      method: "POST",
      body: formData,
    });

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

<div class="flex items-center justify-center min-h-screen w-screen">
  <div
    class="md:w-100 md:rounded-xl not-md:justify-end not-md:w-screen not-md:h-screen p-4 flex flex-col bg-neutral-900"
  >
    <p class="text-2xl font-bold">Melding</p>
    <form class="flex flex-col gap-4">
      <p>Email</p>
      <Input bind:value={email} type="text" />
      <p>Naam</p>
      <Input bind:value={name} type="text" />
      <p>Beschrijving</p>
      <Input bind:value={description} class="h-30" type="area" />
      <p>Foto</p>
      {#if image}
        <img src={URL.createObjectURL(image)} alt="preview" class="h-40" />
      {/if}
      <input
        type="file"
        accept="image/*"
        onchange={(e) => {
          const target = e.target as HTMLInputElement;
          image = target.files?.[0] ?? null;
          console.log("selected file:", image);
        }}
      />
      <Button onclick={onSubmit}>Meld</Button>
    </form>
  </div>
  </div>
</Layout>
