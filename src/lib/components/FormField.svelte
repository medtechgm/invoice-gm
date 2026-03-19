<script lang="ts">
    let {
        id,
        label,
        value = $bindable(""),
        type = "text",
        placeholder = "",
        required = false,
        rows = 3,
    } = $props<{
        id: string;
        label: string;
        value?: string | number;
        type?: "text" | "email" | "number" | "date" | "tel" | "textarea";
        placeholder?: string;
        required?: boolean;
        rows?: number;
    }>();

    const inputClass =
        "block w-full rounded-md border-0 py-2.5 px-3 text-base sm:text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:leading-6";
</script>

<div class="mb-4 sm:mb-6">
    <label
        for={id}
        class="block text-sm sm:text-base font-medium leading-6 text-slate-700 mb-2"
    >
        {label}
        {#if required}
            <span class="text-red-500">*</span>
        {/if}
    </label>

    <div class="relative rounded-md shadow-sm">
        {#if type === "textarea"}
            <textarea
                {id}
                name={id}
                bind:value
                {placeholder}
                {required}
                {rows}
                class="{inputClass} resize-none"
            ></textarea>
        {:else}
            <input
                {type}
                {id}
                name={id}
                bind:value
                {placeholder}
                {required}
                class={inputClass}
            />
        {/if}
    </div>
</div>
