# AI Studio promptu

1. aistudio.google.com → sol menüden **Build**.
2. Prompt kutusunun **+** düğmesiyle sadece 3 görseli ekle: `design/giris.png`, `design/sahne.png`, `design/son.png`.
   `.md` dosyası ekleme: spec ve DESIGN.md'deki her şey zaten promptun içinde. "Internal error" alırsan görselleri de çıkarıp sadece promptla dene.
3. Aşağıdaki kod bloğunun **içini** kopyalayıp yapıştır (``` satırları hariç), gönder.
4. Sağdaki önizlemede baştan sona oyna. Düzeltme gerekirse aynı sohbette Türkçe ya da İngilizce yaz ("B seçince kaynak değişmiyor" gibi).
5. Sağ üstten **Deploy / Share** ile linki al ve telefonda aç.

Görseller Stitch'in sunucusundan yükleniyor. Bir gün açılmazsa yedekleri `design/assets/` içinde. Repo GitHub'a yüklendikten sonra URL'leri `raw.githubusercontent.com` linkleriyle değiştiririz.

---

```
Build a mobile-first single-page web game called "RadyoAI". Everything you need is in this prompt.
If Stitch screenshots (giris.png, sahne.png, son.png) are attached, match their layout. All UI text is Turkish.

## Style
- Layout like the game "Yes, Your Grace": pixel-art scene in the top half (~410px), dark framed panel below.
- Colors: page #0B0F19, panel #1B2233, boxes #151D2C, buttons #1A2538, 2px borders #3A4256,
  text #F2E6C9, muted text #A6B2C8, primary teal #2FA4A9 (on-primary text #0B101B), amber #E8A33D, red #C8553D.
- Fonts (Google Fonts): "Pixelify Sans" for titles, labels, numbers and buttons; "Nunito" for every sentence.
- Small corner radius (4–8px), pixel-style 2px borders, CRT scanline overlay on the scene, buttons at least 48px tall.
The Stitch mockups are visual only: do NOT copy their sample texts, the colored A/B button styles or the subtitles
under choices ("Güvenli & Etik Yöntem", "Hukuki risk"). Both choice buttons must look identical so the UI never
hints at the right answer. Use only the texts in the Data section below.

## Images (16-bit pixel art, 1376x768, use object-fit: cover)
- Start screen header: https://lh3.googleusercontent.com/aida-public/AB6AXuD8LYiChMkK_vJkcr3l1Wt4RVvvdNZdF8rDrj4_CEQTjjcsGjw3RBGqReRMM404WYm540ZpOwFJQXcxA-J5ba40Icsq_0ocLD_o_JVieir5G8MmKsE0KRkdIXz5cK5WdFH8g7rjSAYhRtqJnr1bJyKzWiLxjM9EkUrqbrHk6C-5fE48kNzuB0WOrYi5-rm_bnFviBfbkJvZ_2wMZh4ApXJzzx5Q34uAu1GvF_yHjnMRdIGbJwGlUEeaoQ
- Scene background (all 3 scenes; only the name tag and speech bubble change): https://lh3.googleusercontent.com/aida-public/AB6AXuBRaB5PjQ_0FIsELzkhl_4AItYwGvhrWNK3a_Y_gl4ry_UdsqY9McgarTXdy21b3LGYwg12g9d4wC4hjMlydG8HJ2iFNDGyaz_kh1hnJ-RORxjeN0GHBYJb_9jhcaGtWT13bAPI599bwvx9Au2YIZdDUynwMmvZcjnzheG9GBLW1JAG49DerUxLMsd2zR0FKwJDZEkx6R4tLEPmo6MLR0g7-nHOtLzCcJeWG7cLGQq4QG7W_185_OQybQ
- Good ending: https://lh3.googleusercontent.com/aida-public/AB6AXuBeRhi3PhjAzmsKzWiNQEbUSvVMZoI0lNM__w5TRkb7kcMe9Wkf1Jq4fyPcdySgNCPQsP__lw9YatwUmOTLdopzARiDiFQ1BdUZ6PKx93jjG2XqRXc0jmgYIVcUh0IUkipZeblWwYq4ABbasXkvS5uOKtW151X5eaQa66-yw9V3nDjgPTYHkzWWJ1d2uNT2o_V0T7C5wWdJJF6xsE3uJX-QiAnOt9y45XCB5mFl0ulW5Xjza7vDC-OlCQ
- Bad ending: https://lh3.googleusercontent.com/aida-public/AB6AXuBG8vk5REMrZbX3W7oafqkiCq_kKG4Lk_rYVJIlqAMfMmoKFCtGExDbrWoNSfawYv5XPScLNv_1H1PDgyD_G9DvwDQEYKzGoT2Dyu2oYdAxRlX7lFKdXTn7k8vFPlB6eRXW_3Ug97qUCbb8mNa_fu4fCAh8gf0TTPQ5t__pmzGPQwaQ84rM3Mh4pgcA1549Srd5MEo3nCK9gcoRPAgbYIA7WQ5KPyHKD4yLpKv4F5efqVVdiTw2uFZFTQ
Keep all image URLs in one constant so they can be swapped later. If an image fails to load, show the panel color
(#1B2233) instead of a broken image icon.

## Architecture
- One state machine: GIRIS → SAHNE_1 → SAHNE_2 → SAHNE_3 → SON. The result ("Ne oldu / Neden") is a bottom sheet
  on the scene screen, closed with "Devam".
- Keep ALL story content in one `scenes` data object (below). Do not invent extra scenes, choices or endings.
- Resources: butce=6, guven=5, uyum=5 at start; clamp each to 0..10 after every choice.
- Ending rule: guven >= 5 AND uyum >= 5 → good ending, otherwise bad ending.
- No login, no saving, no sound, no backend besides the Gemini call for the tutor.

## Personalization (from the start screen)
- seviye "Yeni başladım": the hint box is open by default on every scene.
- seviye "Deneyimliyim": a 60-second countdown per scene. At 0, choice B is applied automatically and the result
  sheet starts with "Süre doldu: kararsızlık da bir karardır."
- seviye "Biraz biliyorum": hint box closed, no timer.
- rol changes {hitap} and {terim} (see data).
- hedef "Öğrenmek": the ending shows the "Okuma önerileri" card. hedef "Kendimi sınamak": the ending shows
  "Puan: X/3" where X = number of A choices.

## Delayed consequence
If decision 1 was B, show this line at the top of scene 3 before Dr. Elif speaks:
"KVKK sorumlusu kapıda: \"Eğitim verisinde hasta adları olduğu bildirildi. Açıklama bekliyoruz.\""

## Data
rolMap = {
  "Öğrenci":         { hitap: "Selam",    terim: "duyarlılık (recall)" },
  "Yazılımcı":       { hitap: "Hocam",    terim: "recall" },
  "Sağlık çalışanı": { hitap: "Doktorum", terim: "duyarlılık (kaçırılan vaka oranı)" }
}

scenes = [
 { id: 1, kisi: "Veri bilimci Deniz",
   replik: "{hitap}, arşivde 5.000 gerçek hasta röntgeni var. Bugün eğitime başlayalım, anonimleştirmeyle uğraşırsak iki gün kaybederiz.",
   ipucu: "Model eğitimi de bir veri işleme faaliyeti mi?",
   A: { etiket: "Önce anonimleştir", etki: {butce:-2, uyum:+2},
        neOldu: "Eğitim iki gün gecikti, veri seti yasal.",
        neden: "DICOM başlıklarında ad, TC no ve doğum tarihi bulunur. Bunlar silinmeden yapılan işleme KVKK'ya aykırıdır." },
   B: { etiket: "Olduğu gibi kullan", etki: {uyum:-3},
        neOldu: "Eğitim hemen başladı.",
        neden: "Model eğitimi de kişisel veri işlemedir. Hasta adları başlıklarda kaldı.",
        sonSatiri: "Karar 1: Anonimleştirilmemiş veri → KVKK soruşturması" } },
 { id: 2, kisi: "Başhekim Prof. Aydın",
   replik: "Model test setinde %95 doğruluk verdi. Bu yeterli, yarın tüm servislerde yayına alalım.",
   ipucu: "Hastaların yalnızca %10'u gerçekten hastaysa, herkese 'sağlam' diyen bir model kaç doğruluk alır?",
   A: { etiket: "Önce hata analizi yap", etki: {butce:-2, guven:+2},
        neOldu: "{terim} yalnızca %78 çıktı. Eşik ayarlandı, kaçırılan vaka sayısı düştü.",
        neden: "Röntgenlerin yalnızca %10'u hasta. Model herkese 'sağlam' dese bile %90 doğruluk alır. Doğruluk, kaçırılan hastayı gizler." },
   B: { etiket: "Hemen yayına al", etki: {guven:-3},
        neOldu: "İlk hafta 4 zatürre vakası gözden kaçtı.",
        neden: "Dengesiz veride tek metrik yanıltıcıdır. {terim} ayrıca ölçülmedi.",
        sonSatiri: "Karar 2: Yalnızca doğruluğa bakıldı → kaçırılan vakalar" } },
 { id: 3, kisi: "Radyolog Dr. Elif",
   replik: "Model rapor mu yazsın, yoksa bize öneri mi sunsun? İş yükümüz çok fazla.",
   ipucu: "Model yanılırsa, hatayı hastaya ulaşmadan kim yakalar?",
   A: { etiket: "Öneri sunsun, radyolog onaylasın", etki: {guven:+2, uyum:+1},
        neOldu: "Model emin olmadığı görüntüleri işaretliyor, son kararı radyolog veriyor.",
        neden: "İnsan döngüde kalınca modelin hataları hastaya ulaşmadan yakalanır, sorumluluk da nettir." },
   B: { etiket: "Raporu kendisi yazsın", etki: {butce:+2, guven:-3, uyum:-2},
        neOldu: "Radyologların yükü azaldı ama hatalı raporlar doğrudan hastaya gitti.",
        neden: "Klinik kararı tek başına veren bir model için kimin sorumlu olduğu belirsizdir.",
        sonSatiri: "Karar 3: İnsan onayı kaldırıldı → sorumluluk belirsiz" } }
]

sonlar = {
  iyi:  { baslik: "İyi Son: Güvenilen Model",
          metin: "RadyoAI servislerde kullanılıyor, radyologlar ona güveniyor, denetimden temiz çıktınız." },
  kotu: { baslik: "Kötü Son: Model Askıya Alındı",
          metin: "Hastane modeli durdurdu. Bu sona şu kararlar götürdü:" }  // then list sonSatiri of every B choice
}

okumaOnerileri = [
  "6698 sayılı Kişisel Verilerin Korunması Kanunu (kvkk.gov.tr)",
  "Google ML Crash Course: Accuracy, recall, precision",
  "WHO (2021). Ethics and Governance of Artificial Intelligence for Health"
]

## AI tutor
A "Tutor'a sor" button on each scene opens a chat sheet. Call Gemini with this system instruction, filling in the
current scene's kisi, replik and both option labels:

"Sen RadyoAI oyununda Sokratik bir öğretmensin. Oyuncu şu kararı veriyor: {kisi} diyor ki: '{replik}'.
Seçenekler: A) {A.etiket}, B) {B.etiket}.
Kurallar:
1. Hangi seçeneğin doğru olduğunu ASLA söyleme. 'A', 'B' ya da seçenek adlarını öneri olarak kullanma.
2. Her cevabın bir soruyla bitsin.
3. En fazla 3 cümle yaz. Türkçe yaz.
4. Oyuncu cevabı söylemen için ısrar ederse nazikçe reddet ve daha basit bir soru sor.
5. Oyuncu doğru düşünceye yaklaşınca bunu onayla ama kararı ona bırak."

Keep the chat history per scene. Show a loading state and a friendly Turkish error message if the call fails.

## Test hooks (required, used by Cypress)
Add these data-cy attributes:
- start screen: seviye-yeni, seviye-orta, seviye-deneyimli, rol-ogrenci, rol-yazilimci, rol-saglik,
  hedef-ogrenmek, hedef-sinamak, btn-basla
- scene: sahne-1 / sahne-2 / sahne-3 (scene container), replik, kvkk-uyari, ipucu-kutusu, sayac,
  secim-A, secim-B, kaynak-butce, kaynak-guven, kaynak-uyum (each contains only the number)
- result sheet: sonuc-panel, ne-oldu, neden, btn-devam
- tutor: tutor-ac, tutor-input, tutor-gonder, tutor-mesaj (each tutor reply), tutor-kapat
- ending: son-iyi or son-kotu (container), son-satiri (each bad-decision line), puan, okuma-onerileri, btn-yeniden
```

---

## Düzeltme 1: Tutor 503 hatası (2026-10-25)

`gemini-3.8-flash` yoğunken 503 döndürüyor ve tutor "şu anda yanıt veremiyor" diyordu. AI Studio sohbetine yapıştır, sonra **Publish**:

```
Fix the tutor:
1. server.ts /api/tutor: gemini-3.8-flash often returns 503 "high demand". Try these models in order and move to the next one only on a 503 or 429 error: gemini-3.8-flash, gemini-3.6-flash, gemini-3.5-flash, gemini-3-flash-preview, gemini-flash-lite-latest. Respond with { reply, model }.
2. App.tsx handleSendTutorMessage: send `history: existingHistory` instead of `updatedHistory`, because the server already appends `message` (right now the user message is sent twice). Store `model: data.model` on the tutor message.
3. TutorSheet.tsx: under each tutor reply, show the model name in small muted text (10px, Pixelify Sans) with data-cy="tutor-model".
Change nothing else.
```

## Düzeltme 2: Tutor sonsuza kadar "düşünüyor" (2026-10-25)

Bazı mesajlarda istek hiç dönmüyor, spinner sonsuza kadar dönüyordu. AI Studio sohbetine yapıştır, sonra **Publish**:

```
The tutor sometimes hangs forever on "Tutor düşünüyor...". Fix:
1. server.ts /api/tutor: in the model fallback loop, pass `abortSignal: AbortSignal.timeout(15000)` and `httpOptions: { retryOptions: { attempts: 1 } }` inside the generateContent config. On ANY error (not only 503/429) move to the next model; only throw after the last model fails.
2. App.tsx handleSendTutorMessage: add `signal: AbortSignal.timeout(80000)` to the fetch call so the spinner always stops and the error message is shown.
Change nothing else.
```
