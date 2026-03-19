<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        subtitle = undefined,
        children,
    } = $props<{
        title: string;
        subtitle?: string;
        children?: Snippet;
    }>();
</script>

<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div class="min-w-0">
        <h1 class="page-title">{title}</h1>
        {#if subtitle}
            <p class="text-muted mt-1">{subtitle}</p>
        {/if}
    </div>
    {#if children}
        <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {@render children()}
        </div>
    {/if}
</div>
