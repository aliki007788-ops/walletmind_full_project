# Dockerfile - Production-Ready for NestJS

# --- STAGE 1: Builder ---
# در این مرحله، ما تمام وابستگی های توسعه را نصب کرده و اپلیکیشن را می سازیم.
FROM node:18-alpine AS builder

# تنظیم دایرکتوری کاری
WORKDIR /usr/src/app

# کپی کردن package.json و package-lock.json
# استفاده از * باعث میشود هر دو فایل کپی شوند
COPY package*.json ./

# نصب تمام وابستگی ها (شامل devDependencies)
RUN npm install

# کپی کردن تمام فایل های دیگر پروژه
COPY . .

# ساخت (Build) اپلیکیشن برای محیط تولید
# این کار، کدهای TypeScript را به JavaScript تبدیل کرده و در پوشه /dist قرار می دهد.
RUN npm run build


# --- STAGE 2: Production ---
# در این مرحله، ما یک ایمیج بسیار سبک فقط با فایل های ضروری برای اجرا می سازیم.
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /usr/src/app

# کپی کردن package.json و package-lock.json
COPY package*.json ./

# نصب فقط وابستگی های اجرایی (dependencies) و نه devDependencies
# این کار حجم نهایی را به شدت کاهش می دهد.
RUN npm ci --only=production

# کپی کردن پوشه dist (که حاوی کدهای build شده است) از مرحله builder
COPY --from=builder /usr/src/app/dist ./dist

# باز کردن پورت 3000 برای دسترسی به اپلیکیشن
EXPOSE 3000

# دستور نهایی برای اجرای اپلیکیشن
CMD [ "node", "dist/main" ]
