<script lang="ts">
    import { goto } from "$app/navigation";
    import { expenses, deleteExpense } from "$lib/stores/expenses";
    import { settings } from "$lib/stores/settings";
    import { formatCurrency } from "$lib/utils/formatters";
    import DataTable from "$lib/components/DataTable.svelte";
    import AppButton from "$lib/components/AppButton.svelte";
    import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";
    import type { Expense } from "$lib/models/expense";

    let dialogOpen = $state(false);
    let expenseToDelete: Expense | null = $state(null);

    const columns = [
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "payee", label: "Payee" },
        { key: "amount", label: "Amount", align: "right" as const },
    ];

    function confirmDelete(expenseRow: any) {
        expenseToDelete = expenseRow.raw;
        dialogOpen = true;
    }

    function handleDelete() {
        if (expenseToDelete) {
            deleteExpense(expenseToDelete.id);
        }
    }

    let tableData = $derived(
        $expenses.map((expense) => ({
            raw: expense,
            date: expense.date.toLocaleDateString(),
            category: expense.category,
            payee: expense.payee || "N/A",
            amount: formatCurrency(
                expense.amount,
                expense.currency || $settings.defaultCurrency,
            ),
        })),
    );
</script>

<svelte:head>
    <title>Expenses - Invoicer App</title>
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100"
>
    <div class="p-8 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div
            class="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4"
        >
            <div>
                <h1 class="text-4xl font-bold text-slate-900 tracking-tight">
                    Expenses
                </h1>
                <p class="text-slate-500 text-sm mt-2">
                    Track your business spending
                </p>
            </div>
            <AppButton href="/expenses/new" variant="primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4 mr-2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Record Expense
            </AppButton>
        </div>

        <!-- Data Table Card -->
        <div
            class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
            <DataTable
                {columns}
                data={tableData}
                emptyMessage="You haven't recorded any expenses yet."
            >
                {#snippet emptyStateAction()}
                    <AppButton
                        href="/expenses/new"
                        variant="primary"
                        size="sm"
                        class="mt-4"
                    >
                        Record your first expense
                    </AppButton>
                {/snippet}

                {#snippet row(row)}
                    <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
                    >
                        {row.date}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {row.category}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-900 font-medium">
                        {row.payee}
                    </td>
                    <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right"
                    >
                        {row.amount}
                    </td>

                    <!-- Actions -->
                    <td
                        class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    >
                        <div
                            class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                        >
                            <button
                                class="text-slate-400 hover:text-red-600 p-1"
                                onclick={(e: MouseEvent) => {
                                    e.stopPropagation();
                                    confirmDelete(row);
                                }}
                                title="Delete"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-4 h-4"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    /></svg
                                >
                            </button>
                        </div>
                    </td>
                {/snippet}
            </DataTable>
        </div>
    </div>
</div>

<ConfirmDialog
    bind:open={dialogOpen}
    title="Delete Expense"
    description={`Are you sure you want to delete this expense?`}
    confirmText="Delete"
    destructive={true}
    onconfirm={handleDelete}
/>
