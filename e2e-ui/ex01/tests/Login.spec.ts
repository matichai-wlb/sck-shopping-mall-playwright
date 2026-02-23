import { test, expect} from '@playwright/test';

//เปิด Browser แล้วไปยังหน้าที่จะทดสอบ
test(`เข้าสู่ระบบ: ]`, async ({ page }) => { 
  await test.step("เปิด Browser แล้วไปยังหน้าที่จะทดสอบ",  async () => {
    await page.goto('https://demo-login-workshop.vercel.app/');
  });
  await test.step("กรอก Username",  async () => {
    await page.locator("[id='username_field']").fill('demo');
  });
  await test.step("กรอก Password",  async () => {
    await page.locator("[id='password_field']").fill('mode');
  });
  await test.step("กดปุ่ม Login",  async () => {
    await page.locator("[id='login_button']").click(); 
  });;
    
  });



//กรอก Username
// test("กรอก Username",  async ({ page }) => {
//   await page.locator("[id='username_field']").fill('demo');
// });

//กรอก Password
//กดปุ่ม Login
//ตรวสอบ Expected Results

