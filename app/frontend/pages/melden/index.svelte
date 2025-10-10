<script>
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
</script>

<div class="flex items-center justify-center min-h-screen w-screen">
  <div
    class="md:w-100 md:rounded-xl not-md:justify-end not-md:w-screen not-md:h-screen p-4 flex flex-col bg-neutral-900"
  >
    <p class="text-2xl font-bold">Melding</p>
    <form class="flex flex-col gap-4">
      <p>Naam</p>
      <Input placeholder="Bob" type="text" />
      <p>Beschrijving</p>
      <Input class="h-30" placeholder="Rotzooi" type="area" />
      <p>Foto</p>
      <Input type="file" />
      <Button>Meld</Button>
    </form>
  </div>
</div>
