# Sınav tasarımı: benimle uyumlanan vize sorusu

**Neden bu soru?** Ben görüntü işleme tarafından geliyorum. "Regresyon" ve "hata toleransı" kelimelerini veri setlerinden biliyordum ve bu yüzden kolay sandım. Ama "regresyon testi"nin ML'deki regresyonla hiçbir ilgisi olmadığını bu ödevde fark ettim. Asıl takıldığım kavram ise **test kahini** oldu. Soruyu bu iki zayıf noktanın üstüne, kendi alanımdaki bir senaryoyla kurdum. Benimle uyumlanan bir sınav, bildiğimi sandığım ama karıştırdığım yeri yoklamalı.

## Soru (klasik, 40 dk, 100 puan)

Bir hastane, akciğer röntgenlerinden kanserli bölge olasılığı veren bir modeli Python sunucusunda kullanıyor. Model, ağ olmadan da çalışsın diye ONNX'e çevrilip servis tabletlerine taşınacak. Tablet `p ≥ 0,50` ise görüntüyü "radyolog baksın" diye işaretliyor. Elinizde etiketsiz 300 röntgen var.

1. **(25)** Tabletteki modeli test ederken **test kahininiz** ne olur? Bu kahin neyi garanti eder, neyi **etmez**?
2. **(25)** 300 görüntüyle bir **diferansiyel test** tasarlayın. Hata toleransını kaç seçersiniz ve neden "birebir aynı olmalı" diyemezsiniz? `p = 0,4999` çıkan bir görüntü için tolerans yeterli mi?
3. **(25)** Ekip bir ay sonra modeli v2'ye güncelliyor. Bu durumda **regresyon testi** neyi kontrol eder? Açıklayınız.
4. **(25)** 300 görüntünün hepsinde tablet ile Python farkı < 1e-4 çıktı. Proje lideri "model doğru çalışıyor, yayına alalım" diyor. Bu cümleyi **doğrulama (verification)** ve **geçerleme (validation)** açısından değerlendirin.

## Beklenen ana noktalar

1. Etiket olmadığı için kahin, güvenilen **Python modelinin kendi çıktısıdır**. Bu kahin yalnızca **tutarlılığı** garanti eder: taşıma bozmadı. Modelin doğru olduğunu **garanti etmez**. Python yanlışsa tablet de aynı yanlışı yapar ve test yine geçer.
2. Farklı donanım ve kütüphanelerde kayan nokta hesapları küçük farklar verir; bu yüzden tolerans gerekir (ör. 1e-4). Eşiğe yakın girdilerde (`0,4999`) küçük bir fark kararı çevirir, bu yüzden olasılığın yanında **kararın da** aynı olduğu ayrıca kontrol edilmeli ve eşik çevresine özel örnekler test kümesine konmalı.
3. Regresyon testi: v2'den sonra **daha önce doğru çalışan davranışın bozulmadığını** kontrol eder (eski 300 görüntü, eski arayüz akışları). "Regresyon" burada *gerileme* demektir; sürekli değer tahmin eden modelle ilgisi yoktur.
4. Fark < 1e-4 bir **doğrulama** sonucudur: "ürünü doğru mu yaptık?" (taşıma şartnameye uyuyor). "Doğru ürünü mü yaptık?" sorusu (**geçerleme**) cevapsızdır: modelin gerçek hastalarda kanserli bölgeyi yakalayıp yakalamadığı, etiketli veri ve radyolog değerlendirmesi olmadan bilinemez. Yayın kararı için yeterli değildir.

## Çeldiriciler

- **"Regresyon testi = regresyon modelinin testi"** (madde 3). Benim de neredeyse düştüğüm tuzak: aynı kelime, alakasız iki kavram.
- **"İki sistem aynı sonucu verdi, o zaman model doğru"** (madde 1 ve 4). Diferansiyel test, kahinden daha doğru olamaz.
- **"Tolerans 0 olmalı, yoksa model güvenilmez"** ya da tersi, **"tolerans içindeyse her şey yolunda"** (madde 2). Eşik çevresi ayrı düşünülmeli.

**Neden ezber ölçmüyor?** Hiçbir madde bir tanım sormuyor. Öğrenci kavramı bir senaryoya uygulamak ve **sınırını** söylemek zorunda: kahin neyi garanti etmez, tolerans nerede yetmez, doğrulama neden yayın için yetmez.
