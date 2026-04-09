# อัศวินสูตรคูณ (Multiplication Knight) 🛡️🐲

เกมฝึกสูตรคูณแสนสนุกในธีม Castle Defense พัฒนาด้วย React + Vite + Tailwind CSS

## การติดตั้งและพัฒนา (Local Development)

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. เริ่มต้นเซิร์ฟเวอร์พัฒนา:
   ```bash
   npm run dev
   ```

3. สร้างไฟล์สำหรับ Production:
   ```bash
   npm run build
   ```

## การ Deploy ขึ้น Netlify 🚀

แอปพลิเคชันนี้พร้อมสำหรับการ Deploy บน Netlify ผ่านการเชื่อมต่อกับ GitHub:

1. **GitHub Sync**: 
   - อัปโหลดโค้ดทั้งหมดขึ้น GitHub Repository ของคุณ
   - ตรวจสอบว่ามีไฟล์ `netlify.toml` อยู่ที่ Root ของโปรเจกต์

2. **Netlify Setup**:
   - ไปที่ [Netlify Dashboard](https://app.netlify.com/)
   - เลือก **"Add new site"** > **"Import an existing project"**
   - เชื่อมต่อกับ GitHub และเลือก Repository นี้
   - Netlify จะตรวจพบไฟล์ `netlify.toml` และตั้งค่า Build Command (`npm run build`) และ Publish Directory (`dist`) ให้โดยอัตโนมัติ

3. **Environment Variables**:
   - หากมีการใช้ Gemini API หรือ API อื่นๆ ให้ไปที่ **Site settings** > **Environment variables** ใน Netlify
   - เพิ่ม Key เช่น `GEMINI_API_KEY` ตามที่ระบุในไฟล์ `.env.example`

## ความปลอดภัย 🛡️

ไฟล์ `netlify.toml` ได้ถูกตั้งค่า Header ความปลอดภัยเบื้องต้นไว้แล้ว:
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: upgrade-insecure-requests`

*หมายเหตุ: `X-Frame-Options` ถูกปิดไว้เพื่อให้สามารถแสดงผลใน AI Studio ได้ หากต้องการความปลอดภัยสูงสุดบน Production สามารถเปิดใช้งานเป็น `DENY` ได้ในภายหลัง*
