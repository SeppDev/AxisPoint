<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";

  let name: string = $state("");
  let description: string = $state("");
  let image: File | null = $state(null);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(meld, errorCallback, {
        enableHighAccuracy: true,
      });
    } else {
      console.warn("No location");
    }
  }

  async function meld(position: GeolocationPosition) {
    const formData = new FormData();
    formData.append("klacht[name]", name);
    formData.append("klacht[description]", description);
    formData.append("klacht[longitude]", position.coords.longitude.toString());
    formData.append("klacht[latitude]", position.coords.latitude.toString());

    if (image) {
      formData.append("klacht[image]", image);
    }
    console.log(image); // should show File object
    console.log(formData.get("klacht[image]")); // should not be null

    let response = await fetch("/api/klacht", {
      method: "POST",
      body: formData,
    });
    console.log(response);
  }

  function errorCallback() {
    console.log("Failed to get position");
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    getLocation();
  }
</script>

<div class="flex items-center justify-center min-h-screen w-screen">
  <div
    class="md:w-100 md:rounded-xl not-md:justify-end not-md:w-screen not-md:h-screen p-4 flex flex-col bg-neutral-900"
  >
    <p class="text-2xl font-bold">Melding</p>
    <form class="flex flex-col gap-4">
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
