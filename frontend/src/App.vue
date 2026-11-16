<template>
  <div id="easybill-root" class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <router-view />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import AppToast from './components/AppToast.vue';
</script>
