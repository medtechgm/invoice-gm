<script lang="ts">
    let {
        title,
        value,
        linkText,
        linkHref,
        icon = undefined,
        accent = "slate",
    } = $props<{
        title: string;
        value: number | string;
        linkText: string;
        linkHref: string;
        icon?: string;
        accent?: "slate" | "emerald" | "red" | "blue";
    }>();

    const defaultIcon =
        "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75";

    const accentColors: Record<string, { icon: string; dot: string }> = {
        slate: { icon: "text-slate-400", dot: "bg-slate-300" },
        emerald: { icon: "text-emerald-500", dot: "bg-emerald-400" },
        red: { icon: "text-red-400", dot: "bg-red-400" },
        blue: { icon: "text-blue-400", dot: "bg-blue-400" },
    };

    let colors = $derived(accentColors[accent] || accentColors.slate);
</script>

<div class="card p-5 sm:p-6 flex flex-col gap-3">
    <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-slate-500">{title}</p>
        <div
            class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center {colors.icon}"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4.5 h-4.5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={icon || defaultIcon}
                />
            </svg>
        </div>
    </div>
    <p class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {value}
    </p>
    <a
        href={linkHref}
        class="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
    >
        {linkText}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
        >
            <path
                fill-rule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clip-rule="evenodd"
            />
        </svg>
    </a>
</div>
