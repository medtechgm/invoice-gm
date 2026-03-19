<script lang="ts">
    import type { Snippet } from "svelte";

    type Option = { value: string | number; label: string };

    let {
        id,
        label,
        value = $bindable(""),
        type = "text",
        placeholder = "",
        required = false,
        rows = 3,
        error = undefined,
        hint = undefined,
        options = [],
        children,
    } = $props<{
        id: string;
        label: string;
        value?: string | number;
        type?:
            | "text"
            | "email"
            | "number"
            | "date"
            | "tel"
            | "textarea"
            | "select"
            | "url";
        placeholder?: string;
        required?: boolean;
        rows?: number;
        error?: string;
        hint?: string;
        options?: Option[];
        children?: Snippet;
    }>();
</script>

<div class="space-y-1.5">
    <label for={id} class="block text-sm font-medium text-slate-700">
        {label}
        {#if required}
            <span class="text-red-500 ml-0.5">*</span>
        {/if}
    </label>

    {#if type === "textarea"}
        <textarea
            {id}
            name={id}
            bind:value
            {placeholder}
            {required}
            {rows}
            class="input-base resize-none {error ? 'input-error' : ''}"
        ></textarea>
    {:else if type === "select"}
        <select
            {id}
            name={id}
            bind:value
            {required}
            class="input-base {error ? 'input-error' : ''}"
        >
            {#if children}
                {@render children()}
            {:else}
                {#each options as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            {/if}
        </select>
    {:else}
        <input
            {type}
            {id}
            name={id}
            bind:value
            {placeholder}
            {required}
            class="input-base {error ? 'input-error' : ''}"
        />
    {/if}

    {#if error}
        <p class="text-xs text-red-600 flex items-center gap-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-3.5 h-3.5 flex-shrink-0"
            >
                <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                />
            </svg>
            {error}
        </p>
    {:else if hint}
        <p class="text-xs text-slate-500">{hint}</p>
    {/if}
</div>
