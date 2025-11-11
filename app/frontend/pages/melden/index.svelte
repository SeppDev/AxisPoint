<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import Layout from "@/layouts/Layout.svelte";
  import Alert, { openDialog } from "@/components/alert.svelte";
  import { LoaderCircle } from "@lucide/svelte";

  let email = $state("");
  let name = $state("");
  let description = $state("");
  let image: File | null = $state(null);

  let buttonState = $state(false);

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
    if (!image) {
      openDialog("upload een plaatje");
      return;
    }

    const formData = new FormData();
    formData.append("klacht[name]", name);
    formData.append("klacht[description]", description);
    formData.append("klacht[contact_email]", email);
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

  function errorCallback(err: any) {
    openDialog("kon locatie niet opnemen!");
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    buttonState = true;
    getLocation();
    buttonState = false;
  }
</script>

<Layout>
  <Alert />
  <div class="flex items-center justify-center h-full w-full">
    <div
      class="md:w-100 not-md:h-full justify-center md:rounded-xl w-full p-4 flex flex-col"
    >
      <p class="text-2xl font-bold">Melden</p>
      <form class="flex flex-col gap-4">
        <p>Email</p>
        <Input
          placeholder="voorbeeld@hotmail.com"
          bind:value={email}
          type="text"
        />
        <p>Titel</p>
        <Input
          placeholder="Mijn kat is overreden"
          bind:value={name}
          type="text"
        />
        <p>Beschrijving</p>
        <Input bind:value={description} class="h-30" type="area" />
        <p>Foto</p>
        {#if image}
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            class="h-40 object-contain"
          />
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
        <Button disabled={buttonState} onclick={onSubmit}>
          {#if buttonState}
            <LoaderCircle class="h-4 w-4 animate-spin" />
          {/if}
          Meld</Button
        >
      </form>
    </div>
  </div>
</Layout>
