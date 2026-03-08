<script lang="ts">
    export let id: string;
    export let label: string;
    export let value: string | number = "";
    export let type: "text" | "email" | "number" | "date" | "tel" | "textarea" =
        "text";
    export let placeholder = "";
    export let required = false;
    export let rows = 3; // for textarea

    const inputClass =
        "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6";
</script>

<div class="mb-4">
    <label
        for={id}
        class="block text-sm font-medium leading-6 text-slate-700 mb-1"
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
                class={inputClass}
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
