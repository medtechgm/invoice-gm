<script lang="ts">
    import { page } from "$app/stores";
    import { onMount, tick } from "svelte";
    import { invoices } from "$lib/stores/invoices";
    import { generateInvoicePdf } from "$lib/services/pdf-service";
    import AppButton from "$lib/components/AppButton.svelte";

    // Get invoice ID from URL
    $: invoiceId = $page.params.id;
    $: invoice = $invoices.find((inv) => inv.id === invoiceId);

    let pdfUrl: string | null = null;
    let loading = true;

    onMount(async () => {
        if (invoice) {
            // Wait a tick to ensure component is mounted
            await tick();
            generatePreview();
        } else {
            loading = false; // No invoice found
        }
    });

    function generatePreview() {
        if (!invoice) return;

        try {
            loading = true;
            const doc = generateInvoicePdf(invoice);
            const pdfBlob = doc.output("blob");
            pdfUrl = URL.createObjectURL(pdfBlob);
        } catch (e) {
            console.error("Error generating PDF preview:", e);
        } finally {
            loading = false;
        }
    }

    function handleDownload() {
        if (!invoice) return;
        const doc = generateInvoicePdf(invoice);
        doc.save(`${invoice.invoiceNumber}.pdf`);
    }
</script>

<svelte:head>
    <title>Preview {invoice?.invoiceNumber || "Invoice"} - Invoicer App</title>
</svelte:head>

<!-- Sticky Header Toolbar -->
<div
    class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between"
>
    <div class="flex items-center gap-4">
        <a
            href="/invoices"
            class="group text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-all"
        >
            <div
                class="p-1 rounded-full group-hover:bg-slate-100 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
            </div>
            Back
        </a>
        <div class="h-6 w-px bg-slate-300 mx-2"></div>
        <h1
            class="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2"
        >
            Invoice Preview
            {#if invoice}
                <span
                    class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest"
                    >{invoice.invoiceNumber}</span
                >
            {/if}
        </h1>
    </div>

    <div class="flex items-center gap-3">
        <AppButton
            variant="secondary"
            size="sm"
            href={`/invoices/${invoiceId}`}
            disabled={!invoice}
        >
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
            </svg>
            Edit
        </AppButton>
        <AppButton
            variant="secondary"
            size="sm"
            on:click={() => window.print()}
            disabled={!invoice}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
            </svg>
            Print
        </AppButton>
        <AppButton
            variant="primary"
            size="sm"
            on:click={handleDownload}
            disabled={!invoice}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
            </svg>
            Download
        </AppButton>
    </div>
</div>

<div
    class="h-[calc(100vh-73px)] bg-slate-100 flex items-center justify-center p-8 overflow-hidden"
>
    {#if loading}
        <div class="flex flex-col items-center">
            <div
                class="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"
            ></div>
            <p
                class="text-slate-500 font-bold uppercase tracking-widest text-[10px]"
            >
                Preparing Document...
            </p>
        </div>
    {:else if !invoice}
        <div
            class="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-slate-200"
        >
            <div
                class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                Invoice Not Found
            </h3>
            <p class="text-slate-500 mb-8">
                The document you're looking for could not be found or has been
                deleted.
            </p>
            <AppButton variant="primary" href="/invoices"
                >Return to List</AppButton
            >
        </div>
    {:else if pdfUrl}
        <div
            class="w-full h-full max-w-5xl bg-white shadow-2xl rounded-xl ring-1 ring-slate-900/10 overflow-hidden relative animate-in zoom-in-95 duration-500"
        >
            <iframe
                src={pdfUrl}
                class="w-full h-full border-0"
                title="PDF Preview"
            ></iframe>
        </div>
    {/if}
</div>
