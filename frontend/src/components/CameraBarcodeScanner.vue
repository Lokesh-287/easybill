<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between select-none animate-in fade-in duration-200"
  >
    <!-- Top Bar Controls -->
    <div class="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-slate-950/90 to-transparent">
      <div class="flex items-center space-x-2 text-white">
        <Camera class="w-5 h-5 text-indigo-400 animate-pulse" />
        <span class="text-sm font-bold tracking-tight">Scan Product Barcode</span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Torch / Flashlight Toggle -->
        <button
          v-if="hasTorch"
          @click="toggleTorch"
          :class="[
            'p-2 rounded-xl transition',
            isTorchOn ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800/80 text-white hover:bg-slate-700'
          ]"
          title="Toggle Flashlight"
        >
          <Zap class="w-4 h-4" />
        </button>

        <!-- Close Button -->
        <button
          @click="closeScanner"
          class="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition"
          title="Close Scanner"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Center Viewfinder & Video Stream -->
    <div class="relative flex-1 flex items-center justify-center overflow-hidden">
      <!-- HTML5 QR/Barcode Video Container -->
      <div id="barcode-reader-viewport" class="w-full h-full object-cover"></div>

      <!-- Reticle Overlay -->
      <div class="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
        <div class="relative w-64 h-64 border-2 border-indigo-400/60 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
          <!-- Corner Accents -->
          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-xl"></div>

          <!-- Red Scanning Laser Line -->
          <div class="w-full h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-bounce"></div>

          <div class="absolute bottom-3 text-[10px] text-white/80 font-mono bg-black/40 px-2 py-0.5 rounded-full">
            Align barcode inside box
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Controls & Manual Entry Fallback -->
    <div class="p-4 z-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-3">
      <!-- Last Scanned Indicator -->
      <div v-if="lastScannedCode" class="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
        <div class="flex items-center space-x-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span class="font-mono font-bold">{{ lastScannedCode }}</span>
        </div>
        <span class="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-200">Added to Cart</span>
      </div>

      <!-- Manual Code Input Fallback -->
      <div class="flex items-center space-x-2">
        <input
          v-model="manualCode"
          type="text"
          placeholder="Or type barcode (e.g. 8901234001)..."
          class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          @keydown.enter="submitManualCode"
        />
        <button
          @click="submitManualCode"
          class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Add
        </button>
      </div>

      <div class="text-center text-[10px] text-slate-400">
        Supports EAN-13, EAN-8, UPC, Code-128 & QR Code
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick } from 'vue';
import { Camera, X, Zap, CheckCircle2 } from '@lucide/vue';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const emit = defineEmits<{
  (e: 'scan', code: string): void;
  (e: 'close'): void;
}>();

const isOpen = ref(false);
const hasTorch = ref(false);
const isTorchOn = ref(false);
const manualCode = ref('');
const lastScannedCode = ref('');

let html5QrCode: Html5Qrcode | null = null;
let lastScanTimestamp = 0;

// Play sound on barcode detect via Web Audio API
function playScanBeep() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime); // 1.8kHz crisp POS beep
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Audio context silently ignored if user hasn't interacted
  }
}

async function startScanner() {
  isOpen.value = true;
  manualCode.value = '';
  lastScannedCode.value = '';

  await nextTick();

  try {
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.QR_CODE
    ];

    html5QrCode = new Html5Qrcode('barcode-reader-viewport', {
      formatsToSupport,
      verbose: false
    });

    const config = {
      fps: 20,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    await Promise.race([
      html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleCodeDetected(decodedText);
        },
        () => {
          // Scan frame error - ignored in continuous scan
        }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Camera hardware standby')), 1500))
    ]).catch(err => {
      console.log('Camera hardware standby / manual barcode entry ready:', err);
    });

    // Check torch capabilities
    try {
      const capabilities = (html5QrCode as any).getRunningTrackCapabilities();
      if (capabilities && capabilities.torch) {
        hasTorch.value = true;
      }
    } catch (err) {
      hasTorch.value = false;
    }
  } catch (err) {
    console.error('Failed to start camera barcode scanner:', err);
  }
}

function handleCodeDetected(code: string) {
  const now = Date.now();
  // 1.2s debounce to prevent accidental double scans
  if (now - lastScanTimestamp < 1200) return;
  lastScanTimestamp = now;

  playScanBeep();
  lastScannedCode.value = code;
  emit('scan', code);
}

function submitManualCode() {
  const code = manualCode.value.trim();
  if (code) {
    playScanBeep();
    lastScannedCode.value = code;
    emit('scan', code);
    manualCode.value = '';
  }
}

async function toggleTorch() {
  if (!html5QrCode || !hasTorch.value) return;
  try {
    isTorchOn.value = !isTorchOn.value;
    await (html5QrCode as any).applyVideoConstraints({
      advanced: [{ torch: isTorchOn.value }]
    });
  } catch (err) {
    console.log('Torch toggle failed:', err);
  }
}

async function closeScanner() {
  if (html5QrCode) {
    try {
      if (html5QrCode.isScanning) {
        await html5QrCode.stop();
      }
      await html5QrCode.clear();
    } catch (e) {
      // Ignore cleanup error
    }
    html5QrCode = null;
  }
  isOpen.value = false;
  emit('close');
}

onBeforeUnmount(() => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().catch(() => {});
  }
});

defineExpose({
  open: startScanner,
  close: closeScanner
});
</script>
