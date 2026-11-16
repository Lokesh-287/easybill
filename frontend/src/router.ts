import { createRouter, createWebHashHistory } from 'vue-router';
import AppShell from './layouts/AppShell.vue';
import BillingView from './pages/sales/BillingView.vue';
import SalesListView from './pages/sales/SalesListView.vue';

const routes = [
  {
    path: '/',
    component: AppShell,
    children: [
      { path: '', component: BillingView },
      { path: 'bill/new', component: BillingView },
      { path: 'sales', component: SalesListView },
      { path: 'items', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-C1: Item Catalog</h1></div>' } },
      { path: 'parties', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-D1: Parties</h1></div>' } },
      { path: 'purchase', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-F1: Purchases</h1></div>' } },
      { path: 'stock', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-G1: Stock Summary</h1></div>' } },
      { path: 'cash', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-I1: Day Book</h1></div>' } },
      { path: 'gst', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-K1: GST Dashboard</h1></div>' } },
      { path: 'reports', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-J1: Reports & Analytics</h1></div>' } },
      { path: 'settings', component: { template: '<div class="p-6"><h1 class="text-2xl font-bold">SCR-B2: Settings</h1></div>' } },
      { path: ':pathMatch(.*)*', redirect: '/' }
    ]
  },
  { path: '/login', component: { template: '<div class="p-12 max-w-md mx-auto"><h1 class="text-2xl font-bold">EasyBill Login (SCR-A1)</h1></div>' } },
  { path: '/setup', component: { template: '<div class="p-12 max-w-2xl mx-auto"><h1 class="text-2xl font-bold">Setup Wizard (SCR-B1)</h1></div>' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
