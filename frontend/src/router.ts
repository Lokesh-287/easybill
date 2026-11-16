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
import ReportsAnalyticsView from './pages/reports/ReportsAnalyticsView.vue';
import SettingsView from './pages/settings/SettingsView.vue';
import MobileOwnerDashboard from './pages/mobile/MobileOwnerDashboard.vue';
import LoginView from './pages/auth/LoginView.vue';
import SetupWizardView from './pages/setup/SetupWizardView.vue';

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
      { path: 'reports', component: ReportsAnalyticsView },
      { path: 'settings', component: SettingsView },
      { path: 'mobile/owner', component: MobileOwnerDashboard },
      { path: ':pathMatch(.*)*', redirect: '/' }
    ]
  },
  { path: '/login', component: LoginView },
  { path: '/setup', component: SetupWizardView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
