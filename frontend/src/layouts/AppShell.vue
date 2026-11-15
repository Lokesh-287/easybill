<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden">
    <!-- Desktop Sidebar (Section 7.3) -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800">
      <div class="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-lg text-white tracking-wide">
        EasyBill
      </div>
      <nav class="flex-1 px-4 py-4 space-y-1">
        <router-link to="/bill/new" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-white">
          ⚡ Billing (F8)
        </router-link>
        <router-link to="/sales" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          📄 Sales Bills
        </router-link>
        <router-link to="/items" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          📦 Items & Stock
        </router-link>
        <router-link to="/parties" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          👥 Customers & Vendors
        </router-link>
        <router-link to="/purchase" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          📥 Purchases
        </router-link>
        <router-link to="/cash" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          💵 Cash & Day Close
        </router-link>
        <router-link to="/gst" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          🏛️ GST & Compliance
        </router-link>
        <router-link to="/reports" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          📊 Reports
        </router-link>
        <router-link to="/settings" class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-300">
          ⚙️ Settings
        </router-link>
      </nav>
    </aside>

    <!-- Main Content View -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div class="font-semibold text-slate-800">EasyBill Store</div>
        <div class="flex items-center space-x-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            ● Synced
          </span>
          <span class="text-sm font-medium text-slate-700">Owner</span>
        </div>
      </header>
      <main class="flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
