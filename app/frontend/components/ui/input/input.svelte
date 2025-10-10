<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";

  import { type WithElementRef, cn } from "@/utils";
  import type { ClassValue } from "clsx";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, "type"> &
      (
        | { type: "file"; files?: FileList }
        | { type?: InputType; files?: undefined }
      )
  >;

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();

  function makeClass(className: ClassValue): string {
    return cn(
      "placeholder:text-mauve-300 flex border pt-1.5 font-medium shadow-xs",
      "dark:bg-neutral-800 bg-neutral-200 border-ctp-mauve-900 rounded-md px-3 text-sm h-9 w-full resize-none",
      className,
    );
  }
</script>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot="input"
    class={makeClass(className)}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else if type === "area"}
  <textarea
    bind:value
    placeholder={restProps.placeholder}
    class={makeClass(className)}
  ></textarea>
{:else}
  <input
    bind:this={ref}
    data-slot="input"
    class={makeClass(className)}
    {type}
    bind:value
    {...restProps}
  />
{/if}
