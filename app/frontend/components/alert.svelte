<script module lang="ts">
  import * as Dialog from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

  let dialogOpen = $state(false);
  let dialogDescription = $state("");

  export function openDialog(description: string) {
    dialogOpen = true;
    dialogDescription = description;
  }
</script>

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
