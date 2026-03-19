<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let { children, session } = $props<{ children: any; session: any }>();
    let isSidebarOpen = $state(false);

    // Close sidebar when navigating on mobile
    $effect(() => {
        $page.url.pathname;
        isSidebarOpen = false;
    });

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    // Close sidebar on escape key
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape" && isSidebarOpen) {
            isSidebarOpen = false;
        }
    }
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="flex min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Mobile Sidebar Overlay -->
    <div
        class="fixed inset-0 z-40 lg:hidden {isSidebarOpen
            ? 'block'
            : 'hidden'}"
    >
        <!-- Overlay -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onclick={() => (isSidebarOpen = false)}
        ></div>

        <div
            class="relative flex w-full max-w-xs flex-1 flex-col bg-slate-800 focus:outline-none h-full overflow-y-auto"
        >
            <Sidebar
                {session}
                isMobile={true}
                onclose={() => (isSidebarOpen = false)}
            />
        </div>
    </div>

    <!-- Desktop Sidebar -->
    <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 lg:overflow-y-auto">
        <Sidebar {session} />
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col lg:pl-64 min-w-0">
        <!-- Mobile Top Header -->
        <div
            class="sticky top-0 z-20 flex h-14 sm:h-16 shrink-0 items-center gap-x-3 sm:gap-x-4 border-b border-slate-200 bg-white px-3 sm:px-4 md:px-6 shadow-sm lg:hidden"
        >
            <button
                type="button"
                class="-m-2 p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors lg:hidden min-h-[44px] min-w-[44px]"
                aria-label="Open sidebar"
                onclick={toggleSidebar}
            >
                <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            <div class="flex-1 min-w-0">
                <h1 class="font-bold text-sm sm:text-base text-slate-900 truncate">
                    Invoicer
                </h1>
            </div>

            <div class="flex items-center gap-x-2 sm:gap-x-4 flex-shrink-0">
                <div
                    class="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase flex-shrink-0"
                >
                    {session?.user?.email?.charAt(0) || "U"}
                </div>
            </div>
        </div>

        <main class="flex-1 min-w-0 overflow-y-auto">
            <div class="container-responsive py-4 sm:py-6 md:py-8">
                {@render children()}
            </div>
        </main>
    </div>
</div>
