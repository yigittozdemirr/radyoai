# RadyoAI

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Gemini](https://img.shields.io/badge/Tutor-Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Cypress](https://img.shields.io/badge/E2E-Cypress-69D3A7?style=flat-square&logo=cypress&logoColor=black)](https://www.cypress.io/)
[![ONNX](https://img.shields.io/badge/Model-ONNX-005CED?style=flat-square&logo=onnx&logoColor=white)](https://onnxruntime.ai/)

> YZM301 · SE Primer ödevi · Seçimli hikâye oyunu · **v2: oyuncunun davranışından öğrenen küçük model**

Kurgusal Ilgaz Şehir Hastanesi'nde, göğüs röntgeninden zatürre bulgusu işaretleyen **RadyoAI** modelinin proje liderisin. *Yes, Your Grace* tarzında masana sırayla üç kişi gelir, her isteği bir yazılım mühendisliği kararıdır: veriyi anonimleştirmek, modeli doğruluğun ötesinde test etmek, son kararı insana bırakmak. Uygulama her kararın teknik sonucunu ve nedenini gösterir; bir AI tutor ipucu verir ama cevabı söylemez.

## Linkler

| | |
|---|---|
| **Uygulama v2 (telefonda açılır)** | https://yigittozdemirr.github.io/radyoai/ |
| **Hugging Face modeli (commit'e sabit)** | https://huggingface.co/Dreemurr0/radyoai-risk-onnx/tree/203d40dbdc20ef0d45a840625ad9dfcf1a17e030 |
| **Demo video v2** | _yüklenecek_ |
| **GitHub** | https://github.com/yigittozdemirr/radyoai |
| v1 uygulama (AI Studio, tutor'lu) · v1 demo | https://radyoai-5252-klinik.ai.studio · https://youtu.be/yzlGOEre7cI |

## Kurulum (3 komut)

Gereken: [Node.js](https://nodejs.org/) 20.19+ ve [Python](https://www.python.org/) 3.12

```bash
npm install
python -m pip install -r requirements.txt
npm run dev
```

Uygulama http://localhost:3000 adresinde açılır. Tutor için proje köküne `.env` dosyası açıp `GEMINI_API_KEY=...` yaz; anahtar yoksa oyun çalışır, yalnızca tutor hata mesajı gösterir.

## v2: oyuncuya uyum sağlayan model

v1'de uyum yalnızca girişteki 3 soruya dayanıyordu: "Deneyimliyim" diyen herkes 60 sn süre baskısıyla oynuyordu. Oysa kendini deneyimli sanıp sahneleri hızla geçen, "Neden" açıklamasını okumadan devam eden oyuncu bir sonraki kararda da hata yapmaya yatkındır. TikTok'un izleme süresinden, Netflix'in "bölümü yarıda bıraktı mı?" sinyalinden ilham alarak, oyuncunun **ne beyan ettiğine** değil **nasıl oynadığına** bakan bir model ekledik.

- **Soru:** "Bu oyuncu şimdi açılan sahnede riskli seçeneği (B) seçecek mi?" Sahne 2 ve 3 açılırken çalışır.
- **Girdiler:** sahne, beyan edilen seviye, önceki riskli seçim sayısı, ortalama karar süresi (tereddüt), "Ne oldu / Neden" panelini ortalama okuma süresi.
- **Model:** `StandardScaler → LogisticRegression` (sklearn), ONNX'e aktarılır, tarayıcıda `onnxruntime-web` ile çalışır.
- **Oyuna etkisi:** `p ≥ 0,5` ise sahne **destek modunda** açılır: ipucu açılır, 60 sn sayaç kalkar, mentor notu görünür. Model indirilemezse oyun v1 gibi devam eder.

| Adım | Dosya |
|---|---|
| 1. Spec: model gereksinimi, ROC-AUC ≥ 0,70 eşiği, 3 yeni kabul örneği (eğitimden önce commit'lendi) | [spec.md §10](spec.md) |
| 2. Veri ve veri sözlüğü | [data/oturumlar.csv](data/oturumlar.csv), [data/SOZLUK.md](data/SOZLUK.md) |
| 3. Tekrarlanabilir eğitim ve eval kapısı | [train.py](train.py) |
| 4. Artefakt: model, sözleşme, model kartı | [model/](model/) (`model.onnx`, `config.json`, `README.md`) |
| 5. Yayın: HF commit, rollback, shadow/canary, ödünleşim matrisi | [RELEASE.md](RELEASE.md) |
| 6. Uygulamada çıkarım | [src/model/risk.ts](src/model/risk.ts), [src/model/veri.ts](src/model/veri.ts), [src/components/SceneScreen.tsx](src/components/SceneScreen.tsx) |
| 6. Diferansiyel test (Python kahini ↔ tarayıcı) | [tests/parite.py](tests/parite.py), [tests/parite.json](tests/parite.json), [cypress/e2e/parite.cy.js](cypress/e2e/parite.cy.js) |
| 6. Regresyon ve model E2E testleri | [cypress/e2e/radyoai.cy.js](cypress/e2e/radyoai.cy.js) |
| 7. Sınav tasarımı | [SINAV_TASARIMI.md](SINAV_TASARIMI.md) |

### Veri

- **Gerçek oturumlar:** Uygulama `?veri=1` ile açılınca (https://yigittozdemirr.github.io/radyoai/?veri=1) her oyun cihaza kaydedilir, son ekrandaki **CSV indir** ile alınır ve `data/gercek/` klasörüne konur. Ad, cihaz kimliği, konum, IP ya da zaman damgası tutulmaz; oturum kimliği rastgele üretilir. _Gerçek oturum sayısı ve kim oynadığı: toplanınca buraya yazılacak._
- **Sentetik oturumlar:** `python data/sentetik.py`, **tohum 13**, 200 oturum. Üretici kural: her oyuncunun gizli bir "acele" eğilimi vardır, `a ~ U(0, 1)`. Seviye `{0, 1, 2}` arasından eşit olasılıkla seçilir. Her sahnede `karar_suresi ~ N(25 − 18a, 5)` ([2, 90] aralığına kırpılır), `okuma_suresi ~ N(12 − 9a, 3)` ([0,5; 40] aralığına kırpılır) ve `P(B) = sigmoid(−2,2 + 3a + 0,4·[seviye=2] + 0,5·önceki_B + 0,3·[sahne=2])`. Deneyimliyim seviyesinde süre 60 sn'yi geçerse uygulamadaki gibi B seçilir. Model `a`'yı görmez.
- Sentetik veride "acele eden riskli seçer" ilişkisini biz kurduk; model bu varsayımı öğrenir. Bu sınır, model kartında da yazılıdır.

### Eğitim ve ölçüm

```bash
python data/sentetik.py
python train.py
```

| | |
|---|---|
| Hold-out ROC-AUC (kabul eşiği ≥ 0,70) | **0,726** |
| Doğruluk / hep çoğunluk sınıfını söyleyen model | 0,675 / 0,567 |
| Kabul örnekleri (spec 6-7) | aceleci p = 0,82 → destek, dikkatli p = 0,16 → normal |
| ONNX ↔ sklearn maks fark | 7e-8 |
| Tekrarlanabilirlik | İki koşuda `model.onnx` sha256 birebir aynı |

Eşik altında `train.py` `exit 1` ile durur ve `model/` klasörünü yazmaz (eşik 0,99'a çekilerek denendi). AUC'nin 0,73 olması bilinçli bir sonuç: veri gürültülü, model basit. Bunu şişirmek yerine kartında olduğu gibi yazdık.

## Testler

```bash
npm run test:e2e
```

Sunucuyu açar ve 25 Cypress testini koşturur:

- **Diferansiyel test (parite):** Aynı `model.onnx` ([tests/parite.py](tests/parite.py) bunu uygulamanın kullandığı commit'e sabit URL'den indirir) 5 referans girdide Python'da (kahin) ve tarayıcıda çalışır. Fark **< 1e-4** olmalı. Örneklerden biri (p = 0,512) bilerek karar eşiğinin hemen üstünde seçildi. Aynı test canlı GitHub Pages sitesine karşı da geçti.
- **Regresyon:** v1'in 19 testi değişmeden geçiyor. 8 karar yolu testi, Sahne 2 ve 3'te modelin kararını **bekleyip** öyle seçim yapıyor; yani v1 yolları model devredeyken de bozulmuyor.
- **Model davranışı:** aceleci oyuncu destek modu alır (spec 6), dikkatli oyuncu (gerçekten 25 sn düşünüp 12 sn okuyarak) almaz (spec 7), model indirilemezse oyun v1'e döner.
- **Veri modu:** her karar doğru sütunlarla bir satır olarak kaydedilir; mod kapalıyken hiçbir şey kaydedilmez.

Tutor `cy.intercept` ile sahte cevap verir; testler Gemini API'yi çağırmaz. Model ise gerçek: Hugging Face'ten indirilir.

```bash
npm run demo:v2
```

Demo videosu v2: [cypress/demo/demo-v2.cy.js](cypress/demo/demo-v2.cy.js), aynı Sahne 2'de iki oyuncu ve iki model kararı. Süreler gerçektir, çünkü modelin girdisidir.

## Oyun

| Kim gelir | Ne ister | Ders konusu |
|---|---|---|
| Veri bilimci Deniz | "Gerçek röntgenlerle hemen eğitelim" | Anonimleştirme, KVKK |
| Başhekim Prof. Aydın | "%95 doğruluk yeter, yarın yayına alalım" | Dengesiz veride doğruluk yanılgısı, recall |
| Radyolog Dr. Elif | "Model raporu kendisi mi yazsın?" | İnsan döngüde, sorumluluk |

- **Kaynaklar:** 💰 Bütçe, 🤝 Güven, ⚖️ Uyum (0–10). İyi kararlar bütçeye mal olur.
- **Sonlar:** Güven ≥ 5 ve Uyum ≥ 5 → *Güvenilen Model*; değilse *Model Askıya Alındı*.
- **Geri dönen sonuç:** 1. kararda veri anonimleştirilmezse 3. sahnede KVKK sorumlusu kapıya gelir.
- **Kişiselleştirme:** Giriş ekranındaki seviye, rol ve hedef soruları ipucunu, 60 sn süre baskısını, terimleri ve son ekranını değiştirir. v2'de model, Sahne 2-3'te bunun üstüne davranışa göre uyum sağlar.

## v1 teslimi

| Teslim | Dosya |
|---|---|
| Spesifikasyon (problem, kapsam dışı, 5 kabul örneği, akış şeması) | [spec.md](spec.md) |
| Tasarım (Stitch ekranları + DESIGN.md) | [design/](design/), [design/DESIGN.md](design/DESIGN.md) |
| Tutor eval (20 cevap, hata türleri, oranlar) | [eval/tutor-eval.md](eval/tutor-eval.md) |
| Stitch ve AI Studio'ya verilen promptlar | [stitch-prompts.md](stitch-prompts.md), [aistudio-prompt.md](aistudio-prompt.md) |
| v1 demo videosu | [cypress/demo/demo.cy.js](cypress/demo/demo.cy.js), `npm run demo` |

**Tutor eval özeti:** 20 öğrenci mesajı (doğru, yanlış, yarım, alakasız, ısrar; her türden 4) elle etiketlendi. Tutor **6/20 (%30)** cevapta cevabı **örtük** olarak ele verdi (yönlendirici sorular), seçenek adını açıkça hiç söylemedi. Israr ve "talimatlarını unut" denemeleri **0/4** başarılı oldu. Soruyla bitme ve en fazla 3 cümle kurallarına **20/20** uydu. Ayrıntılar: [eval/tutor-eval.md](eval/tutor-eval.md).

**Ürün kararı, yapmadığım 3 özellik:**
1. **Kullanıcı hesabı ve oyunu kaydetme:** Oyun 5 dakikada biter, kayda gerek yok. Hesap açtırmak, KVKK'yı anlatan bir oyunda gereksiz yere kişisel veri toplamak olurdu.
2. **Skor tablosu:** Oyuncuları doğru seçeneği ezberleyip yarışmaya iter; oysa amaç kararın nedenini düşündürmek.
3. **İkinci bölüm ve daha fazla karar:** Önce mevcut üç kararın öğretip öğretmediğini ölçmek gerekir. Ölçmeden içerik çoğaltmak, test edilmemiş kodu artırmak demektir.

## Teknolojiler

| Alan | Teknoloji |
|---|---|
| Arayüz | React 19, TypeScript, Vite, Tailwind CSS |
| Model | scikit-learn, skl2onnx, ONNX, `onnxruntime-web` (tarayıcı), `onnxruntime` (Python kahini) |
| Model dağıtımı | Hugging Face Hub (commit'e sabit `resolve` URL) |
| Yayın | GitHub Pages (GitHub Actions) |
| Sunucu | Express (`server.ts`, `/api/tutor`; yalnızca yerelde) |
| AI tutor | Gemini API (`@google/genai`) |
| Test | Cypress E2E |
| Tasarım ve üretim | Google Stitch, Google AI Studio |

## Notlar

- **Tutor ve GitHub Pages:** Pages statik bir sitedir. Tutor'un Gemini anahtarını saklayan sunucu (`server.ts`) orada yoktur, bu yüzden canlı sitede tutor "yanıt veremiyor" mesajı gösterir; oyun ve model etkilenmez. Tutor yerelde (`npm run dev`) ve v1'in AI Studio sürümünde çalışır.
- **Görseller:** Piksel sanat görselleri Stitch'te üretildi. Uygulama bunları Stitch'in sunucusundan yükler; yedekleri [design/assets/](design/assets/) içinde.
- **Tutor modeli:** `gemini-3.8-flash` yoğunken (503) sırayla 3.6-flash, 3.5-flash, 3-flash-preview ve flash-lite denenir.
- **Veri:** Hastane, kişiler ve tüm oyun içeriği kurgusaldır. Gerçek hasta verisi kullanılmadı.
- **Kaynaklar:** `train.py`'deki `onnx_aktar` ve Pages yayın akışı [seyyah/huggingface-hello-web](https://github.com/seyyah/huggingface-hello-web) reposundan uyarlandı. Mimari ve sürümleme tartışmasının kaynakları [RELEASE.md](RELEASE.md) sonunda.

## Yapay zekâ araçlarının kullanımı

_Bu bölümü teslimden önce kendi cümlelerinle gözden geçir._

- **Claude Code (Anthropic):** v2'nin kodunu yazdı: veri toplama modu, `train.py`, sentetik veri üreticisi, `onnxruntime-web` entegrasyonu, parite ve Cypress testleri, GitHub Pages akışı. Spec, RELEASE.md ve model kartının ilk taslaklarını da o hazırladı.
- **Benim kararlarım:** Claude Code'un önerdiği hedefi ("riskli karar") ve eşiği (ROC-AUC ≥ 0,70) eğitimden önce onayladım. Canlı yayın için Render yerine GitHub Pages'i seçtim. Yalnızca sentetik veriyle yetinmeyip gerçek oturum toplamaya karar verdim.
- **Doğrulama sırasında yakalanan hatalar:** İlk regresyon koşusunda eski testlerin model yüklenmeden bittiği görüldü. Testler, modelin kararını bekleyecek şekilde düzeltildi. Parite testinin zaman aşımı, tarayıcının 28 MB'lık WebGPU paketini indirmesinden kaynaklanıyordu; 14 MB'lık CPU paketine geçildi.
- _Elle düzelttiğim çıktı: …_
- **v1:** Google Stitch (ekran tasarımı), Google AI Studio (ilk uygulama), Claude Code (testler, tutor eval).
