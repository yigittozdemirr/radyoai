import React, { useEffect, useState } from 'react';
import parite from '../../tests/parite.json';
import { MODEL_URL, riskOlasiliklari } from '../model/risk.ts';

// ?parite=1 → tests/parite.json'daki girdileri tarayıcıdaki ONNX modeliyle çalıştırır.
// Cypress bu sayfadaki data-cy="p" değerlerini Python kahininin değerleriyle karşılaştırır.
export function ParitePage() {
  const [p, setP] = useState<number[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    riskOlasiliklari(parite.ornekler.map((o) => o.girdi))
      .then(setP)
      .catch((e) => setHata(String(e)));
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F2E6C9] font-body p-4 max-w-lg mx-auto text-xs space-y-3">
      <h1 className="font-pixel text-sm text-[#E8A33D]">Parite: tarayıcı (onnxruntime-web) ve Python</h1>
      <p className="break-all text-[#A6B2C8]">{MODEL_URL}</p>
      {hata && <p data-cy="parite-hata" className="text-[#C8553D]">{hata}</p>}
      <table className="w-full">
        <thead>
          <tr className="text-left text-[#A6B2C8]">
            <th>Örnek</th>
            <th>Tarayıcı p</th>
            <th>Python p</th>
          </tr>
        </thead>
        <tbody>
          {parite.ornekler.map((o, i) => (
            <tr key={o.ad} data-cy="parite-satir">
              <td>{o.ad}</td>
              <td data-cy="p">{p ? String(p[i]) : '…'}</td>
              <td>{o.p}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {p && <p data-cy="parite-hazir">Model {parite.ornekler.length} girdide çalıştı.</p>}
    </main>
  );
}
