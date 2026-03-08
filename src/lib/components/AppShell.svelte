<script lang="ts">
    import Sidebar from "./Sidebar.svelte";

    let { children } = $props();
</script>

<div class="flex min-h-screen bg-slate-100 font-sans text-slate-800">
    <Sidebar />
    <main class="flex-1 ml-64 min-w-0">
        <!-- Render children passed to this component -->
        {@render children()}
    </main>
</div>
