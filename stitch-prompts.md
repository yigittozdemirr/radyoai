# Stitch promptları

stitch.withgoogle.com → **Mobile** modunu seç → promptları sırayla yapıştır. Önce 1. promptla giriş ekranını üret, sonra aynı projede "add screen" ile 2. ve 3. promptları ver ki stil tutarlı kalsın.

Bitince:
- 3 ekranın görsellerini `design/` klasörüne koy (`giris.png`, `sahne.png`, `son.png`).
- Stitch'in tasarım sistemini **DESIGN.md** olarak dışa aktar ve repo köküne koy.
- AI Studio'ya geçerken bu 3 görseli de yükleyeceğiz.

> Stil açıklamaları İngilizce, çünkü Stitch stil tarifini İngilizcede daha tutarlı uyguluyor. Ekrandaki metinler Türkçe, tırnak içinde olduğu gibi kalmalı.

---

## Ortak stil (her promptun başında var)

```
Mobile game UI, portrait, 390x844. Visual style inspired by the game "Yes, Your Grace":
a pixel-art scene in the top half, a dark ornate text panel in the bottom half.
Setting: a modern Turkish hospital's radiology AI office, drawn in 16-bit pixel art
(desk, monitor showing a chest X-ray, door, window, potted plant).
Palette: deep navy panel (#1B2233), slate stone borders (#3A4256), warm parchment text (#F2E6C9),
hospital teal accent (#2FA4A9), alert amber (#E8A33D), danger red (#C8553D).
Fonts: pixel display font for titles (Pixelify Sans), clean readable sans-serif for body text (Nunito).
All text is in Turkish and must render Turkish characters (ş, ğ, ı, İ, ç, ö, ü).
Buttons are large (min 48px tall), thumb-friendly, with a 2px pixel-style border.
```

---

## 1. Giriş ekranı

```
[ORTAK STİL]

Screen: start / onboarding screen of the game "RadyoAI".
Top: pixel-art illustration of the hospital entrance at morning, a sign reading "Ilgaz Şehir Hastanesi".
Title in pixel font: "RadyoAI". Subtitle: "Modeli sen onaylıyorsun. Sonuçlarına da sen katlanıyorsun."

Below, three question groups, each with selectable pill/cards (one choice per group, selected state uses teal fill):
1. "Seviyen?" → "Yeni başladım" / "Biraz biliyorum" / "Deneyimliyim"
2. "Rolün?" → "Öğrenci" / "Yazılımcı" / "Sağlık çalışanı"
3. "Hedefin?" → "Öğrenmek" / "Kendimi sınamak"

Small muted disclaimer text: "Hastane, kişiler ve veriler kurgusaldır."
Bottom: full-width primary button "Başla" (disabled look until all three are chosen).
```

## 2. Sahne ekranı

```
[ORTAK STİL]

Screen: decision scene. Layout like "Yes, Your Grace" throne room, but it is an office.
Top 50%: pixel-art radiology AI office. The player's desk is on the right with a monitor showing a chest X-ray.
A pixel character (a young data scientist with a laptop, name tag "Deniz") stands in front of the desk.
A speech bubble above the character: "Arşivde 5.000 gerçek hasta röntgeni var. Bugün eğitime başlayalım, anonimleştirmeyle uğraşırsak iki gün kaybederiz."
Top-left small banner: "Ziyaretçi 1/3". Top-right: a small round pixel timer badge "60" (amber).

Bottom 50%: dark ornate panel.
- A collapsible hint box with a lightbulb icon, titled "İpucu", text: "Model eğitimi de bir veri işleme faaliyeti mi?"
- Two large stacked choice buttons:
  "A) Önce anonimleştir"
  "B) Olduğu gibi kullan"
- A resource bar row with pixel icons and numbers: 💰 Bütçe 6 · 🤝 Güven 5 · ⚖️ Uyum 5
- A small secondary button with a chat icon: "Tutor'a sor"

Also show a second state of this screen: a bottom sheet sliding over the panel titled "Ne oldu?" and "Neden?",
showing resource changes as small chips ("Bütçe −2" in red, "Uyum +2" in teal), and a "Devam" button.
```

## 3. Son ekranı

```
[ORTAK STİL]

Screen: ending screen. Two variants side by side.

Variant 1 (good ending): pixel-art scene of radiologists smiling around a monitor, teal glow.
Title: "İyi Son: Güvenilen Model".
Text: "RadyoAI servislerde kullanılıyor, radyologlar ona güveniyor, denetimden temiz çıktınız."

Variant 2 (bad ending): same office, dark, a red "ASKIDA" stamp over the monitor.
Title: "Kötü Son: Model Askıya Alındı".
A list of decisions that caused it, each with a red marker, e.g.
"Karar 1: Anonimleştirilmemiş veri → KVKK soruşturması".

Both variants show:
- Final resource values with icons (💰 Bütçe, 🤝 Güven, ⚖️ Uyum).
- A "Kararların" list of the three choices made.
- A "Okuma önerileri" card with three short links (for players whose goal is learning).
- Full-width button "Yeniden oyna".
```
