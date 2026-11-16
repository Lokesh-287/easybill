<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-none font-sans">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Logo & Brand Header -->
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-xl shadow-primary-500/30 text-white mb-4">
        <Receipt class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">EasyBill POS</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">
        Fast Shift Login & Cashier PIN Unlock (SCR-A1)
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 shadow-card border border-slate-200/80 rounded-3xl sm:px-10 space-y-6">
        <!-- Staff User Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">Select Active Cashier / Staff</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="user in staffUsers"
              :key="user.id"
              @click="selectedUser = user"
              :class="[
                'p-3 rounded-2xl border flex items-center space-x-3 transition text-left',
                selectedUser.id === user.id
                  ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
              ]"
            >
              <div class="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {{ user.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">{{ user.name }}</div>
                <div class="text-[10px] text-slate-500">{{ user.role }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Mode Toggle: Quick PIN vs Owner Password -->
        <div class="flex items-center justify-center p-1 bg-slate-100 rounded-xl space-x-1">
          <button
            @click="authMode = 'pin'"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition',
              authMode === 'pin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            4-Digit Fast PIN
          </button>
          <button
            @click="authMode = 'password'"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition',
              authMode === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            Owner Password
          </button>
        </div>

        <!-- 4-Digit PIN Interface -->
        <div v-if="authMode === 'pin'" class="space-y-4">
          <!-- PIN Indicator Dots -->
          <div class="flex justify-center space-x-3 my-2">
            <div
              v-for="i in 4"
              :key="i"
              :class="[
                'w-4 h-4 rounded-full transition-all duration-200 border',
                pinDigits.length >= i
                  ? 'bg-primary-600 border-primary-600 scale-110 shadow-sm shadow-primary-500/40'
                  : 'bg-slate-100 border-slate-300'
              ]"
            ></div>
          </div>

          <p v-if="pinError" class="text-xs text-rose-600 text-center font-medium animate-shake">
            {{ pinError }}
          </p>

          <!-- Numeric Keypad -->
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
              :key="num"
              @click="enterDigit(num.toString())"
              class="py-3.5 bg-slate-50 hover:bg-slate-100 active:bg-primary-50 active:text-primary-700 border border-slate-200/80 rounded-2xl text-lg font-bold font-tabular text-slate-800 transition flex items-center justify-center shadow-xs"
            >
              {{ num }}
            </button>
            <button
              @click="clearPin"
              class="py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-center"
            >
              CLEAR
            </button>
            <button
              @click="enterDigit('0')"
              class="py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-lg font-bold font-tabular text-slate-800 transition flex items-center justify-center shadow-xs"
            >
              0
            </button>
            <button
              @click="deleteLastDigit"
              class="py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          <div class="text-center text-[11px] text-slate-400">
            Default Demo PIN: <span class="font-mono font-bold text-slate-600">1234</span>
          </div>
        </div>

        <!-- Password Interface -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Owner Password</label>
            <input
              v-model="passwordInput"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <button
            @click="submitPassword"
            class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 transition"
          >
            Authenticate & Open Register
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Receipt } from '@lucide/vue';

const router = useRouter();

const staffUsers = [
  { id: 'usr-1', name: 'Lokesh K', role: 'Store Cashier' },
  { id: 'usr-2', name: 'Administrator', role: 'Store Owner' }
];

const selectedUser = ref(staffUsers[0]);
const authMode = ref<'pin' | 'password'>('pin');
const pinDigits = ref<string[]>([]);
const pinError = ref('');
const passwordInput = ref('');

function enterDigit(digit: string) {
  if (pinDigits.value.length < 4) {
    pinDigits.value.push(digit);
    pinError.value = '';

    if (pinDigits.value.length === 4) {
      verifyPin();
    }
  }
}

function deleteLastDigit() {
  pinDigits.value.pop();
  pinError.value = '';
}

function clearPin() {
  pinDigits.value = [];
  pinError.value = '';
}

function verifyPin() {
  const entered = pinDigits.value.join('');
  if (entered === '1234' || entered === '0000') {
    // success!
    router.push('/bill/new');
  } else {
    pinError.value = 'Incorrect PIN. Please try again.';
    setTimeout(() => {
      clearPin();
    }, 600);
  }
}

function submitPassword() {
  router.push('/bill/new');
}
</script>
