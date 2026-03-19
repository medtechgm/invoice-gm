<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title = undefined,
        action = undefined,
        noPadding = false,
        children,
    } = $props<{
        title?: string;
        action?: Snippet;
        noPadding?: boolean;
        children: Snippet;
    }>();
</script>

<div class="section-card">
    {#if title || action}
        <div
            class="flex items-center justify-between px-5 py-4 border-b border-slate-200"
        >
            {#if title}
                <h2 class="section-title">{title}</h2>
            {/if}
            {#if action}
                <div class="flex-shrink-0">
                    {@render action()}
                </div>
            {/if}
        </div>
    {/if}
    <div class={noPadding ? "" : "p-5 sm:p-6"}>
        {@render children()}
    </div>
</div>
