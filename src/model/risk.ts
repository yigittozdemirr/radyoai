// Yalnızca CPU (wasm) çekirdeği: varsayılan paketin WebGPU'lu 28 MB'lık wasm'ı yerine 14 MB
import * as ort from 'onnxruntime-web/wasm';

// Model commit'e sabitlenir, main'den okunmaz (RELEASE.md). Boş bırakılırsa model kapalı: oyun v1 gibi çalışır.
// Sürüm geçmişi (rollback için):
//   v2.0.0  203d40dbdc20ef0d45a840625ad9dfcf1a17e030  sentetik veri, AUC 0.726 (gerçekte %93 destek modu)
//   v2.2.0  fddc655de8537e0c9980a8ca01cdbe4da2eeb545  kalibre sentetik + 15 gerçek oturum, AUC 0.723
export const MODEL_URL =
  'https://huggingface.co/Dreemurr0/radyoai-risk-onnx/resolve/fddc655de8537e0c9980a8ca01cdbe4da2eeb545/model.onnx';

// spec.md §10: p ≥ 0.5 → sahne destek modunda açılır (model/config.json → decision_threshold)
export const KARAR_ESIGI = 0.5;

// wasm dosyaları paketle aynı sürümden CDN'den gelir; tek iş parçacığı (SharedArrayBuffer/COOP gerekmesin)
ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ort.env.versions.web}/dist/`;
ort.env.wasm.numThreads = 1;

let oturum: Promise<ort.InferenceSession> | null = null;

export function modelYukle() {
  if (!MODEL_URL) return Promise.reject(new Error('model kapalı'));
  oturum ??= ort.InferenceSession.create(MODEL_URL);
  oturum.catch(() => (oturum = null)); // indirme başarısızsa sonraki sahnede yeniden denenir
  return oturum;
}

// Girdi: her satır OZELLIKLER sırasında 5 sayı (src/model/veri.ts). Çıktı: riskli seçim olasılıkları.
export async function riskOlasiliklari(girdiler: number[][]): Promise<number[]> {
  const model = await modelYukle();
  const x = new ort.Tensor('float32', Float32Array.from(girdiler.flat()), [girdiler.length, girdiler[0].length]);
  const { probabilities } = await model.run({ input: x });
  return girdiler.map((_, i) => Number(probabilities.data[i * 2 + 1]));
}
