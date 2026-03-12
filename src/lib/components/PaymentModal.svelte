<script lang="ts">
    import AppButton from "./AppButton.svelte";
    import { addPayment } from "$lib/stores/payments";
    import { fade, scale } from "svelte/transition";
    import { formatCurrency } from "$lib/utils/formatters";

    let {
        invoiceId,
        invoiceTotal,
        invoiceCurrency,
        isOpen = $bindable(false),
        onrecorded,
        onclose,
    } = $props<{
        invoiceId: string;
        invoiceTotal: number;
        invoiceCurrency: string;
        isOpen?: boolean;
        onrecorded?: () => void;
        onclose?: () => void;
    }>();

    let amount = $state(0);
    let paymentDate = $state(new Date().toISOString().split("T")[0]);
    let paymentMethod = $state("");
    let referenceNumber = $state("");
    let notes = $state("");

    // Re-sync amount when modal opens or invoiceTotal prop changes
    $effect(() => {
        if (isOpen) {
            amount = invoiceTotal;
        }
    });

    function handleSubmit() {
        if (!amount || amount <= 0) return;

        addPayment({
            invoiceId,
            amount,
            paymentDate: new Date(paymentDate),
            paymentMethod,
            referenceNumber,
            notes,
        });

        if (onrecorded) onrecorded();
        closeModal();
    }

    function closeModal() {
        isOpen = false;
        if (onclose) onclose();
        // Reset form
        amount = invoiceTotal;
        paymentDate = new Date().toISOString().split("T")[0];
        paymentMethod = "";
        referenceNumber = "";
        notes = "";
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <div
                class="px-6 py-4 border-b border-slate-100 flex justify-between items-center"
            >
                <h3 class="text-xl font-bold text-slate-800 tracking-tight">
                    Record Payment
                </h3>
                <button
                    onclick={closeModal}
                    aria-label="Close dialog"
                    class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div class="p-6">
                <div
                    class="mb-6 bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-100"
                >
                    <span class="text-sm font-medium text-slate-500"
                        >Invoice Total</span
                    >
                    <span class="text-lg font-bold text-slate-900"
                        >{formatCurrency(invoiceTotal, invoiceCurrency)}</span
                    >
                </div>

                <div class="space-y-4">
                    <div>
                        <label
                            for="payment-amount"
                            class="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Amount Received
                        </label>
                        <div class="relative">
                            <span
                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-medium"
                            >
                                {invoiceCurrency}
                            </span>
                            <input
                                id="payment-amount"
                                type="number"
                                bind:value={amount}
                                min="0"
                                step="0.01"
                                class="block w-full pl-12 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="payment-date"
                            class="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Payment Date
                        </label>
                        <input
                            id="payment-date"
                            type="date"
                            bind:value={paymentDate}
                            class="block w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                            required
                        />
                    </div>

                    <div>
                        <label
                            for="payment-method"
                            class="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Payment Method (Optional)
                        </label>
                        <select
                            id="payment-method"
                            bind:value={paymentMethod}
                            class="block w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        >
                            <option value="">Select a method...</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Check">Check</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label
                            for="payment-ref"
                            class="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Reference Number (Optional)
                        </label>
                        <input
                            id="payment-ref"
                            type="text"
                            bind:value={referenceNumber}
                            placeholder="e.g. Transaction ID or Check Number"
                            class="block w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div>
                        <label
                            for="payment-notes"
                            class="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Notes (Optional)
                        </label>
                        <textarea
                            id="payment-notes"
                            bind:value={notes}
                            rows="2"
                            placeholder="Internal notes about this payment"
                            class="block w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div
                class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"
            >
                <AppButton variant="ghost" onclick={closeModal}>
                    Cancel
                </AppButton>
                <AppButton variant="primary" onclick={handleSubmit}>
                    Record Payment
                </AppButton>
            </div>
        </div>
    </div>
{/if}
