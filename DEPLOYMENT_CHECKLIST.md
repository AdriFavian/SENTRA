# ✅ SENTRA Deployment Checklist

## 📦 PERSIAPAN AWAL

### Accounts & Credentials
- [ ] Akun Vercel (https://vercel.com) - **GRATIS**
- [ ] Akun ngrok (https://ngrok.com) - **GRATIS**
- [ ] Telegram Bot Token dari @BotFather
- [ ] Google Maps API Key
- [ ] Fonnte Token untuk WhatsApp

### Software Requirements
- [ ] Node.js v18+ installed
- [ ] Python 3.8+ installed
- [ ] Git installed
- [ ] Vercel CLI: `npm i -g vercel`

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Setup Vercel (Frontend)
- [ ] Push code ke GitHub
- [ ] Import project ke Vercel
- [ ] Create Vercel Postgres database
- [ ] Add environment variables di Vercel
- [ ] Deploy project
- [ ] Run database migration: `node scripts/migrate-to-postgres.js`

### Step 2: Setup ngrok
- [ ] Download & install ngrok
- [ ] Get authtoken dari ngrok.com
- [ ] Setup authtoken: `ngrok config add-authtoken YOUR_TOKEN`
- [ ] Update `ngrok.yml` dengan authtoken

### Step 3: Update Environment Files
- [ ] Update `.env.local` dengan Vercel database URL
- [ ] Update ngrok URLs (temporary, akan berubah)

### Step 4: Test Local Backend
- [ ] Test Flask: `python app.py`
- [ ] Test Socket.IO: `npm run backend`
- [ ] Test ngrok: `ngrok start --all --config ngrok.yml`

---

## 🚀 DAILY OPERATION CHECKLIST

### Setiap Kali Menjalankan:

1. **Start Backend Services**
   - [ ] Double-click `start-production.bat`
   - [ ] Tunggu semua services running (3 windows)

2. **Get ngrok URLs**
   - [ ] Buka http://localhost:4040
   - [ ] Copy URL untuk Flask (port 5000)
   - [ ] Copy URL untuk Socket (port 4001)

3. **Update Vercel**
   - [ ] Buka Vercel Dashboard → Settings → Environment Variables
   - [ ] Update `NEXT_PUBLIC_FLASK_URL` dengan ngrok Flask URL
   - [ ] Update `NEXT_PUBLIC_SOCKET_URL` dengan ngrok Socket URL
   - [ ] Update `NGROK_URL` dengan ngrok Flask URL
   - [ ] Click "Redeploy" di Vercel

4. **Verify Everything Works**
   - [ ] Open your app: https://your-app.vercel.app
   - [ ] Check Socket.IO connected (browser console)
   - [ ] Add test CCTV
   - [ ] Test real-time alerts

---

## 🔧 TROUBLESHOOTING CHECKLIST

### Frontend Issues
- [ ] Check Vercel deployment logs
- [ ] Verify environment variables set correctly
- [ ] Check database connection
- [ ] Clear cache: `vercel --prod --force`

### Backend Issues
- [ ] Check ngrok tunnels running: http://localhost:4040
- [ ] Verify Flask running: `curl http://localhost:5000`
- [ ] Verify Socket.IO: `netstat -ano | findstr :4001`
- [ ] Check firewall settings

### Connection Issues
- [ ] ngrok URLs updated in Vercel
- [ ] Vercel redeployed after env change
- [ ] CORS enabled in Flask & Socket.IO
- [ ] Check browser console for errors

### Database Issues
- [ ] Verify DATABASE_URL correct
- [ ] Check Vercel Postgres status
- [ ] Test connection: `psql DATABASE_URL`
- [ ] Re-run migration if needed

---

## 📊 MONITORING CHECKLIST

### Daily Checks
- [ ] Check Vercel Analytics
- [ ] Monitor ngrok usage (40 req/min limit on free)
- [ ] Check error logs in Vercel
- [ ] Verify Socket.IO connections
- [ ] Check Flask console for errors

### Weekly Checks
- [ ] Review accident detection accuracy
- [ ] Check notification delivery rate
- [ ] Monitor database size
- [ ] Backup database (Vercel dashboard)

---

## 🎯 OPTIMIZATION CHECKLIST (Optional)

### Performance
- [ ] Enable Vercel Edge Functions
- [ ] Optimize images (Next.js Image component)
- [ ] Enable caching strategies
- [ ] Monitor Core Web Vitals

### Cost Reduction
- [ ] Consider ngrok Pro ($8/mo) for static domain
- [ ] Monitor Vercel bandwidth usage
- [ ] Optimize database queries

### Reliability
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Configure laptop auto-restart
- [ ] Disable laptop sleep mode
- [ ] Setup backup ngrok account

---

## ✅ PRODUCTION READY CRITERIA

Before going live, ensure:
- [ ] Frontend accessible from internet
- [ ] Backend services running 24/7
- [ ] Database backed up
- [ ] All notifications working
- [ ] Real-time alerts functional
- [ ] Error handling in place
- [ ] Monitoring setup
- [ ] Documentation complete

---

## 🆘 QUICK FIXES

### ngrok URL Changed
```bash
# Option 1: Manual
1. Get new URLs from http://localhost:4040
2. Update in Vercel dashboard
3. Redeploy

# Option 2: Automated
npm run update-vercel-env
npm run deploy
```

### Services Not Starting
```bash
# Kill all processes
taskkill /F /IM node.exe
taskkill /F /IM python.exe
taskkill /F /IM ngrok.exe

# Restart
start-production.bat
```

### Database Connection Lost
```bash
# Verify connection
psql DATABASE_URL

# Re-run migration
node scripts/migrate-to-postgres.js
```

---

## 📞 SUPPORT RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **ngrok Docs**: https://ngrok.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Flask Docs**: https://flask.palletsprojects.com/

---

## 🎉 SUCCESS INDICATORS

Your deployment is successful when:
- ✅ Can access frontend from anywhere
- ✅ Real-time alerts appear instantly
- ✅ CCTV streams load properly
- ✅ Accidents detected and stored
- ✅ Telegram notifications sent
- ✅ WhatsApp notifications sent
- ✅ Dashboard shows live data
- ✅ No errors in console

**Congratulations! 🎊 Your SENTRA system is live!**
