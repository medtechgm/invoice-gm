<script lang="ts">
	import "../app.css";
	import AppShell from "$lib/components/AppShell.svelte";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { initClients } from "$lib/stores/clients";
	import { initEstimates } from "$lib/stores/estimates";
	import { initInvoices } from "$lib/stores/invoices";
	import { initSettings } from "$lib/stores/settings";
	import { initItems } from "$lib/stores/items";
	import { initPayments } from "$lib/stores/payments";
	import { initHistory } from "$lib/stores/history";
	import { initTaxRates } from "$lib/stores/tax";
	import { initExpenses } from "$lib/stores/expenses";

	let { children, data } = $props();
	let { supabase, session, user } = $derived(data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event: any, _newSession: any) => {
			if (_newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => subscription.unsubscribe();
	});

	let lastUserId: string | null = null;
	$effect(() => {
		const currentUserId = user?.id || null;
		if (currentUserId !== lastUserId) {
			lastUserId = currentUserId;
			if (currentUserId) {
				initClients(supabase, currentUserId);
				initEstimates(supabase, currentUserId);
				initInvoices(supabase, currentUserId);
				initSettings(supabase, currentUserId);
				initItems(supabase, currentUserId);
				initPayments(supabase, currentUserId);
				initHistory(supabase, currentUserId);
				initTaxRates(supabase, currentUserId);
				initExpenses(supabase, currentUserId);
			} else {
				// Clear all stores explicitly on logout so data doesn't leak between sessions
				import("$lib/stores/clients").then((m) => m.clients.set([]));
				import("$lib/stores/estimates").then((m) =>
					m.estimates.set([]),
				);
				import("$lib/stores/invoices").then((m) => m.invoices.set([]));
				import("$lib/stores/settings").then((m) =>
					m.settings.set({
						company: {
							name: "",
							email: "",
							phone: "",
							address: "",
							website: "",
							taxId: "",
							domain: "",
						},
						defaultTaxRate: 0,
						defaultCurrency: "USD",
						defaultNotes: "",
						defaultTerms: "",
					}),
				);
				import("$lib/stores/items").then((m) => m.items.set([]));
				import("$lib/stores/payments").then((m) => m.payments.set([]));
				import("$lib/stores/history").then((m) =>
					m.documentHistory.set([]),
				);
				import("$lib/stores/tax").then((m) => m.taxRates.set([]));
				import("$lib/stores/expenses").then((m) => m.expenses.set([]));
			}
		}
	});

	let isAuthRoute = $derived(
		$page.url.pathname.startsWith("/login") ||
			$page.url.pathname.startsWith("/signup") ||
			$page.url.pathname.startsWith("/view") ||
			$page.url.pathname === "/",
	);
</script>

{#if isAuthRoute}
	{@render children()}
{:else}
	<AppShell {session}>
		{@render children()}
	</AppShell>
{/if}
