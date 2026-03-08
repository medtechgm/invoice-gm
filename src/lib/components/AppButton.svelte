<script lang="ts">
    export let href: string | undefined = undefined;
    export let type: "button" | "submit" | "reset" = "button";
    export let variant: "primary" | "secondary" | "danger" | "ghost" =
        "primary";
    export let size: "sm" | "md" | "lg" = "md";
    export let fullWidth = false;

    const baseStyle =
        "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary:
            "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm",
        secondary:
            "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
    };

    $: classes = `${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}`;
</script>

{#if href}
    <a {href} class={classes} {...$$restProps}>
        <slot />
    </a>
{:else}
    <button {type} class={classes} on:click {...$$restProps}>
        <slot />
    </button>
{/if}
