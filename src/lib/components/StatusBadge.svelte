<script lang="ts">
    export let status: "draft" | "sent" | "viewed" | "paid" | "overdue";

    const styles = {
        draft: "bg-slate-100 text-slate-600",
        sent: "bg-blue-100 text-blue-700",
        viewed: "bg-teal-100 text-teal-700",
        paid: "bg-emerald-100 text-emerald-700",
        overdue: "bg-red-100 text-red-700",
    };

    const labels = {
        draft: "Draft",
        sent: "Sent",
        viewed: "Viewed",
        paid: "Paid",
        overdue: "Overdue",
    };
</script>

<span
    class="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full {styles[
        status
    ]} capitalize"
>
    {labels[status]}
</span>
