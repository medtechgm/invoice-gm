<script lang="ts">
    let {
        title,
        amount,
        linkText,
        linkHref,
        type = "invoiced",
    } = $props<{
        title: string;
        amount: number | string;
        linkText: string;
        linkHref: string;
        type?: "invoiced" | "owing" | "overdue";
    }>();

    const icons: Record<string, string> = {
        invoiced:
            "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
        owing: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        overdue: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    };

    let formattedAmount = $derived(
        typeof amount === "number"
            ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
              }).format(amount)
            : amount,
    );
</script>

<div
    class="card-responsive flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
>
    <div class="flex items-center gap-3 flex-1">
        <div class="text-slate-400 flex-shrink-0">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 sm:w-8 sm:h-8"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={icons[type]}
                />
            </svg>
        </div>
        <div class="min-w-0">
            <h3 class="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                {title}
            </h3>
            <div class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-1">
                {formattedAmount}
            </div>
        </div>
    </div>
    <div class="flex-shrink-0">
        <a
            href={linkHref}
            class="inline-block text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors"
        >
            {linkText}
        </a>
    </div>
</div>
