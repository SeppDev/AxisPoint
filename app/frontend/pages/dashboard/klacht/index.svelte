<script lang="ts">
  import KlachtLayout from "@/layouts/KlachtLayout.svelte";

  const initialView = [51.924419, 4.477733];
 

  interface Klacht {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    status?: string;
  }


  let { klachten}: { klachten: Klacht[] } = $props();
  

</script>

<KlachtLayout {klachten} {initialView} showTabs={true} ><p></p></KlachtLayout>
