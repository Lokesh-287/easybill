import { createRouter, createWebHashHistory } from 'vue-router';
import AppShell from './layouts/AppShell.vue';
import BillingView from './pages/sales/BillingView.vue';
import SalesListView from './pages/sales/SalesListView.vue';
import ItemsListView from './pages/items/ItemsListView.vue';
import PartiesListView from './pages/parties/PartiesListView.vue';
import PurchaseListView from './pages/purchase/PurchaseListView.vue';
import PurchaseBillForm from './pages/purchase/PurchaseBillForm.vue';
import StockSummaryView from './pages/stock/StockSummaryView.vue';
import DayBookView from './pages/cash/DayBookView.vue';
import GstDashboardView from './pages/gst/GstDashboardView.vue';

const routes = [
  {
    path: '/',
    component: AppShell,
    children: [
      { path: '', component: BillingView },
      { path: 'bill/new', component: BillingView },
      { path: 'sales', component: SalesListView },
      { path: 'items', component: ItemsListView },
      { path: 'parties', component: PartiesListView },
      { path: 'purchase', component: PurchaseListView },
      { path: 'purchase/new', component: PurchaseBillForm },
      { path: 'purchase/:id', component: PurchaseBillForm },
      { path: 'stock', component: StockSummaryView },
      { path: 'cash', component: DayBookView },
      { path: 'gst', component: GstDashboardView },
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
