<template>
  <div class="fixed top-5 right-5 z-[100] flex flex-col space-y-2.5 max-w-sm pointer-events-none">
    <transition-group
      enter-active-class="transform ease-out duration-200 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'pointer-events-auto flex items-start p-3.5 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-medium transition-all select-none',
          t.type === 'success' ? 'bg-emerald-900/90 text-white border-emerald-700/80 shadow-emerald-950/20' :
          t.type === 'error' ? 'bg-rose-900/90 text-white border-rose-700/80 shadow-rose-950/20' :
          t.type === 'warning' ? 'bg-amber-900/90 text-white border-amber-700/80 shadow-amber-950/20' :
          'bg-slate-900/90 text-white border-slate-700/80 shadow-slate-950/20'
        ]"
      >
        <div class="flex-shrink-0 mr-2.5 pt-0.5">
          <CheckCircle2 v-if="t.type === 'success'" class="w-4 h-4 text-emerald-400" />
          <XCircle v-else-if="t.type === 'error'" class="w-4 h-4 text-rose-400" />
          <AlertTriangle v-else-if="t.type === 'warning'" class="w-4 h-4 text-amber-400" />
          <Info v-else class="w-4 h-4 text-primary-400" />
        </div>

        <div class="flex-1 mr-2 leading-relaxed">
          {{ t.message }}
        </div>

        <button
          @click="remove(t.id)"
          class="flex-shrink-0 text-white/60 hover:text-white p-0.5 rounded transition"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../services/toast';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X
} from '@lucide/vue';

const { toasts, remove } = useToast();
</script>
