# ❓ Frequently Asked Questions (FAQ)

## 🎯 Deployment & Hosting

### Q: Apakah saya bisa deploy frontend di Vercel dan backend di laptop saya?
**A: Ya, bisa!** Itulah arsitektur yang direkomendasikan untuk project SENTRA:
- Frontend (Next.js) → Vercel (gratis, fast, global CDN)
- Backend (Flask AI) → Laptop Anda (akses GPU untuk AI processing)
- Database → Vercel Postgres (gratis tier available)
- Koneksi → ngrok tunnel (expose laptop ke internet)

Lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan lengkap.

---

### Q: Apakah Vercel gratis?
**A: Ya!** Vercel memiliki free tier yang sangat generous:
- Unlimited deployments
- 100GB bandwidth/bulan
- Automatic SSL/HTTPS
- Global CDN
- Serverless functions
- Hobbyist projects gratis selamanya

---

### Q: Apakah ngrok gratis?
**A: Ya,** tapi dengan limitasi:
- **Free Plan**: 
  - URL berubah setiap restart
  - 40 requests/minute
  - 1 online ngrok process
- **Pro Plan ($8/bulan)**:
  - Static custom domain
  - Unlimited requests
  - Multiple processes

Untuk development & testing, free plan sudah cukup.

---

### Q: Kenapa tidak deploy Flask juga di Vercel?
**A: Beberapa alasan:**
1. **GPU Access**: YOLOv8 butuh GPU untuk performa optimal. Laptop Anda mungkin punya GPU, Vercel serverless tidak.
2. **Model Size**: YOLO model file besar (>100MB), tidak cocok untuk serverless
3. **Processing Time**: AI detection butuh waktu, bisa exceed serverless timeout
4. **Cost**: GPU cloud hosting mahal, laptop Anda gratis
5. **Flexibility**: Mudah test & update model di laptop

---

### Q: Bagaimana jika laptop saya mati/sleep?
**A: Backend services akan mati.**

**Solusi:**
1. **Disable sleep mode** saat production
   ```powershell
   powercfg -change -standby-timeout-ac 0
   ```
2. **Auto-start on boot**: Taruh `start-production.bat` di startup folder
3. **Upgrade ke VPS**: Deploy backend ke VPS murah (Contabo, DigitalOcean $5/mo)
4. **Keep laptop plugged in** dan ventilasi bagus

---

### Q: Apakah internet saya harus cepat?
**A: Tidak terlalu.**
- **Upload speed** lebih penting (untuk kirim data ke Vercel)
- **Minimal**: 5 Mbps upload sudah cukup untuk 2-3 CCTV
- **Recommended**: 10+ Mbps untuk performa optimal
- **Latency**: Stabil lebih penting dari cepat

---

## 🔧 Technical Questions

### Q: Kenapa pakai Next.js, bukan React biasa?
**A: Next.js memberikan:**
- Server-side rendering (SEO friendly)
- API routes (backend di frontend)
- Automatic code splitting
- Optimized for Vercel
- Better performance out-of-the-box

---

### Q: Kenapa pakai PostgreSQL, bukan MongoDB?
**A: Project ini awalnya pakai MongoDB, tapi migrasi ke PostgreSQL karena:**
- Relational data (CCTV → Contacts relationship)
- Better for structured data
- Vercel Postgres integration
- Better query performance untuk analytics
- Free tier available

---

### Q: Apakah bisa pakai database lain?
**A: Ya, bisa!** Tinggal update:
1. Connection string di `.env.local`
2. Query syntax di models (`models/AccidentModel.js`, `models/CctvModel.js`)
3. Migration script

---

### Q: Berapa banyak CCTV yang bisa dihandle?
**A: Tergantung spesifikasi laptop:**
- **Laptop dengan GPU**: 5-10 CCTV (real-time detection)
- **Laptop tanpa GPU**: 2-3 CCTV (akan lebih lambat)
- **Upgrade ke GPU server**: 20+ CCTV

**Bottleneck**: CPU/GPU untuk processing, bukan network.

---

## 📱 Features & Functionality

### Q: Bagaimana cara menambah CCTV?
**A: Lewat Dashboard:**
1. Login ke aplikasi
2. Pergi ke "CCTV Management"
3. Click "Add New CCTV"
4. Masukkan IP address, location, dll
5. CCTV akan otomatis terdeteksi & mulai monitoring

---

### Q: Format IP address CCTV yang didukung?
**A: Mendukung:**
- RTSP streams: `rtsp://user:pass@192.168.1.100:554/stream`
- HTTP streams: `http://192.168.1.100:8080/video`
- MJPEG streams: `http://192.168.1.100/mjpeg`

---

### Q: Apakah Telegram notification otomatis?
**A: Ya!** Ketika accident terdeteksi:
1. System deteksi accident via YOLOv8
2. Snapshot otomatis diambil
3. Data disimpan ke database
4. Notification dikirim ke Telegram contacts yang terdaftar
5. User bisa "Tangani" atau "Tolak" via button di Telegram

---

### Q: Bagaimana cara setup Telegram bot?
**A: Ikuti langkah ini:**
1. Chat dengan @BotFather di Telegram
2. Kirim `/newbot` dan ikuti instruksi
3. Dapatkan Bot Token
4. Masukkan ke `.env.local`: `TELEGRAM_BOT_TOKEN=...`
5. Run script: `node scripts/setup-telegram.js`
6. Add contacts via dashboard

---

### Q: WhatsApp notification pakai API apa?
**A: Menggunakan Fonnte API**
- Website: https://fonnte.com
- Cara daftar: WhatsApp ke +62 857-2853-6340
- Gratis untuk testing (limited)
- Paid plan mulai dari Rp 50.000/bulan

**Alternatif:**
- Twilio WhatsApp API
- WhatsApp Business API (official, mahal)
- WA.me API

---

## 🐛 Troubleshooting

### Q: Error: "Cannot connect to database"
**A: Check:**
1. DATABASE_URL benar di `.env.local`
2. PostgreSQL service running
3. Firewall tidak block port 5432
4. Untuk Vercel Postgres: check connection limit

**Fix:**
```bash
# Test connection
psql $DATABASE_URL

# Re-run migration
node scripts/migrate-to-postgres.js
```

---

### Q: Error: "Socket.IO connection failed"
**A: Check:**
1. Socket.IO server running (`npm run socket`)
2. Port 4001 tidak dipakai program lain
3. NEXT_PUBLIC_SOCKET_URL benar di `.env.local`
4. ngrok tunnel aktif (production)

**Fix:**
```bash
# Check port usage
netstat -ano | findstr :4001

# Kill process if needed
taskkill /PID <PID> /F

# Restart
npm run socket
```

---

### Q: Error: "YOLOv8 model not found"
**A: Check:**
1. Model file ada di root: `test5.pt`
2. Path benar di `app.py`: `model = YOLO("test5.pt")`
3. Model tidak corrupt (re-download if needed)

**Fix:**
```bash
# Test model loading
python test.py
```

---

### Q: Flask error: "No module named 'ultralytics'"
**A: Install Python dependencies:**
```bash
pip install -r requirements.txt

# Or specific package
pip install ultralytics
```

---

### Q: Vercel deployment failed
**A: Common causes:**
1. Build error (check Vercel logs)
2. Missing environment variables
3. node_modules atau .next di git (seharusnya di .gitignore)
4. Package.json syntax error

**Fix:**
```bash
# Test build locally
npm run build

# Force clean build
rm -rf .next node_modules
npm install
npm run build
```

---

### Q: ngrok: "ERR_NGROK_4011"
**A: Artinya ngrok free limit exceeded.**

**Solusi:**
1. Tunggu beberapa menit
2. Restart ngrok
3. Atau upgrade ke ngrok Pro

---

### Q: Images tidak muncul di Telegram/WhatsApp
**A: Check:**
1. `NGROK_URL` di `.env.local` benar
2. Snapshot tersimpan di `public/snapshots/`
3. ngrok tunnel expose port 5000 (Flask)
4. URL accessible dari internet

**Test:**
```bash
# Test image URL
curl https://your-ngrok-url.ngrok-free.app/snapshots/test.jpg
```

---

## 💰 Cost & Pricing

### Q: Berapa total biaya untuk menjalankan SENTRA?
**A: Setup minimal (development/MVP):**
- Vercel: **GRATIS** (Hobby plan)
- Vercel Postgres: **GRATIS** (256 MB storage, 60 jam compute)
- ngrok: **GRATIS** (dengan limitasi)
- Laptop electricity: ~Rp 5.000-10.000/hari
- **Total: ~Rp 150.000-300.000/bulan** (listrik saja)

**Production (recommended):**
- Vercel Pro: $20/bulan (~Rp 300.000)
- ngrok Pro: $8/bulan (~Rp 120.000)
- Fonnte WhatsApp: Rp 50.000/bulan
- **Total: ~Rp 470.000/bulan**

**Full Cloud (scalable):**
- Vercel Pro: $20/bulan
- GPU VPS (vast.ai): $0.20/jam = ~$150/bulan
- PostgreSQL (Supabase): GRATIS - $25/bulan
- **Total: ~Rp 2.5-3 juta/bulan**

---

### Q: Apakah ada cara lebih murah?
**A: Ya!**
1. **Tetap pakai Vercel free tier**: Cukup untuk traffic rendah
2. **ngrok free**: Okee untuk development & testing
3. **Self-host database**: PostgreSQL di laptop
4. **Fonnte alternatif**: Cari provider WhatsApp lebih murah
5. **VPS murah**: Contabo (€5/bulan), Hetzner (€4/bulan)

---

## 🚀 Performance & Optimization

### Q: Bagaimana meningkatkan detection speed?
**A: Cara optimize:**
1. **Pakai GPU**: NVIDIA GPU jauh lebih cepat dari CPU
2. **Lower resolution**: Process frame di 640x640 instead of 1080p
3. **Skip frames**: Process setiap 2-3 frame, bukan setiap frame
4. **Smaller model**: YOLOv8n (nano) lebih cepat dari YOLOv8x
5. **Batch processing**: Process multiple frames sekaligus

---

### Q: Berapa accuracy detection?
**A: Tergantung:**
- **Model quality**: Custom-trained model lebih akurat
- **Camera angle**: Angle bagus = accuracy tinggi
- **Lighting**: Siang hari lebih baik dari malam
- **Weather**: Hujan/fog bisa kurangi accuracy
- **Typical accuracy**: 85-95% dengan model yang baik

---

### Q: Bagaimana meningkatkan accuracy?
**A: Tips:**
1. **Train custom model** dengan data accident lokal
2. **Adjust confidence threshold** (default 0.6-0.7)
3. **Better camera placement** (angle, height, lighting)
4. **Filter false positives** dengan business logic
5. **Ensemble models** (combine multiple models)

---

## 🔐 Security & Privacy

### Q: Apakah data aman?
**A: Ya, dengan beberapa layer:**
- HTTPS untuk semua komunikasi
- Database credentials di environment variables
- API keys tidak di-commit ke git
- Vercel automatic SSL/TLS
- ngrok secure tunnels

---

### Q: Siapa yang bisa akses dashboard?
**A: Saat ini tidak ada authentication.**

**TODO untuk production:**
- Add NextAuth.js untuk login
- Role-based access control
- Admin vs User permissions

---

### Q: Apakah CCTV footage disimpan?
**A: Tidak.** System hanya:
- Stream real-time dari CCTV
- Ambil snapshot saat accident
- Snapshot disimpan di `public/snapshots/`
- Bisa setup auto-delete snapshot lama

---

## 📚 Learning & Documentation

### Q: Saya tidak familiar dengan Next.js, bagaimana belajar?
**A: Resources:**
- [Next.js Tutorial](https://nextjs.org/learn) (official)
- [Next.js Docs](https://nextjs.org/docs)
- [YouTube: Next.js Crash Course](https://www.youtube.com/results?search_query=nextjs+crash+course)

---

### Q: Bagaimana cara contribute ke project?
**A: Welcome!**
1. Fork repository
2. Create feature branch
3. Make changes
4. Submit Pull Request
5. Atau report bugs via Issues

---

### Q: Dimana saya bisa dapat support?
**A: Check:**
1. **Documentation**: Baca semua .md files
2. **Issues**: Check GitHub issues
3. **Logs**: Browser console, terminal logs, Vercel logs
4. **Community**: Stack Overflow, Reddit r/nextjs

---

## 🎓 Advanced Topics

### Q: Bagaimana scale untuk 100+ CCTVs?
**A: Architecture changes needed:**
1. **Horizontal scaling**: Multiple Flask instances dengan load balancer
2. **GPU cluster**: Multiple GPU servers
3. **Distributed processing**: Celery + Redis untuk task queue
4. **CDN**: CloudFlare untuk static assets
5. **Database optimization**: Read replicas, connection pooling
6. **Monitoring**: Prometheus + Grafana

---

### Q: Apakah bisa integrate dengan sistem lain?
**A: Ya! Via API:**
- POST to external endpoints saat accident
- Webhook untuk real-time events
- REST API untuk data access
- WebSocket untuk live updates

**Example integrations:**
- Traffic management systems
- Emergency response systems
- Government dashboards
- Insurance systems

---

### Q: Bagaimana backup data?
**A: Strategies:**
1. **Database**: 
   - Vercel Postgres automatic backups
   - Manual: `pg_dump DATABASE_URL > backup.sql`
2. **Snapshots**: 
   - Upload to cloud storage (S3, Google Cloud Storage)
   - Cron job untuk backup harian
3. **Code**: 
   - Git repository (already backed up)

---

### Q: Roadmap untuk SENTRA kedepannya?
**A: Planned features:**
- [ ] User authentication & authorization
- [ ] Mobile app (React Native)
- [ ] Advanced analytics & ML insights
- [ ] Multi-city support
- [ ] Traffic prediction
- [ ] Integration dengan 911/emergency services
- [ ] Video recording capability
- [ ] AI model auto-improvement
- [ ] Multi-language support

---

## 📞 Still Have Questions?

Create an issue di GitHub atau hubungi maintainer!

**Happy coding! 🚀**
