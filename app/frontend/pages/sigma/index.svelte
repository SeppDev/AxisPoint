
<script lang="ts">
    let count = $state(1);
</script>


<p>like for sad sigma</p>


{#each [...Array(count).keys()] as item (item)}
<button onclick={() => {
    count = count * 2
}}>
    <img src="https://chrisvis.me/src/humble.gif" alt="sad sigma like">
</button>
{/each}