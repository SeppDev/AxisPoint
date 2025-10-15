<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";

  let name = $state();
  let description = $state();

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
      <Input type="file" />
      <Button onclick={onSubmit}>Meld</Button>
    </form>
  </div>
</div>
