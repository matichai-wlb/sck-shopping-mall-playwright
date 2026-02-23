import { test, expect } from '@playwright/test';

    
    test("ทดสอบเลือกสินค้าลงตะกร้า", async ({ page, context }) => {
        await test.step('1. เปิดหน้าเว็บและเข้าสู่ระบบ Shopping Mall', async () => {
            await page.goto('http://139.59.225.96/auth/login');
            await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
            await page.locator("#login-username-input").fill('user_9');
            await page.locator("#login-password-input").fill('P@ssw0rd');
            await page.locator("#login-btn").click();
        });

        await test.step('2. ค้นหาและตรวจสอบรายละเอียดสินค้า', async () => {
            await page.locator("#search-product-input").fill('Balance Training Bicycle');
            await page.locator("#search-product-btn").click(); 
            await expect(page.locator("#product-card-name-1")).toHaveText('Balance Training Bicycle');
            await page.locator("#product-card-name-1").click();
            await expect(page.locator("#product-detail-product-name")).toHaveText('Balance Training Bicycle');
            await expect(page.locator("#product-detail-price-thb")).toHaveText(/4,314\.60/);
            await expect(page.locator("#product-detail-point")).toHaveText(/43/);
            // await expect(page.locator("#product-detail-stock")).toHaveText(/90/);
        });

        await test.step('3. เพิ่มสินค้าลงตะกร้าและตรวจสอบและกด checkout', async () => {
            await page.locator("#product-detail-quantity-input").fill('3');
            await page.locator("#product-detail-add-to-cart-btn").click(); 
            await expect(page.locator("#header-menu-cart-badge")).toHaveText('1');
            await page.locator("#header-menu-cart-btn").click();
            await expect(page.locator("#product-1-name")).toHaveText('Balance Training Bicycle');
            await expect(page.locator("#product-1-quantity-input")).toHaveValue('3');
            await expect(page.locator("#product-1-price")).toHaveText(/12,943\.80/);
            await expect(page.locator("#product-1-point")).toHaveText(/129/);
            // await expect(page.locator("#shopping-cart-subtotal-price")).toHaveText('12,943.80');
            await page.locator("#shopping-cart-checkout-btn").click();
        });

        await test.step(`4.ใส่ข้อมูลที่อยู่สำหรับจัดส่งและตรวจสอบเลขไปรษณีย์`, async () => {
            await page.locator("#shipping-form-first-name-input").fill('Matichai');
            await page.locator("#shipping-form-last-name-input").fill('Duangjit');
            await page.locator("#shipping-form-address-input").fill('123 หมู่ 6, ถนนสุขุมวิท');
            await page.locator("#shipping-form-province-select").selectOption('กรุงเทพมหานคร');
            await page.locator("#shipping-form-district-select").selectOption('เขตบางนา');
            await page.locator("#shipping-form-subdistrict-select").selectOption('บางนา');
            await expect(page.locator("#shipping-form-zipcode-input")).toHaveValue('10260');
            await page.locator("#shipping-form-mobile-input").fill('0625928956');
        });

        await test.step(`5.เลือกวิธีการจัดส่งและวิธีการชำระเงินเพื่อใส่ข้อมูลบัตรเครดิต`, async () => {
            await page.locator("#shipping-method-2-time").click();
            await page.locator("#payment-credit-input").click();
            await page.locator("#payment-credit-form-fullname-input").fill('MATICHAI DUANGJIT');
            await page.locator("#payment-credit-form-card-number-input").fill(`4444 5555 5555 5555`);
            await page.locator("#payment-credit-form-expiry-input").fill(`12/26`);
            await page.locator("#payment-credit-form-cvv-input").fill(`726`);
        });

        await test.step(`6.ตรวจสอบราคาสินค้า ค่าจัดส่ง และยอดชำระทั้งหมดในหน้า checkout`, async () => {
            await expect(page.locator("#order-summary-subtotal-price")).toHaveText(/12,943\.80/);
            await expect(page.locator("#order-summary-shipping-fee-price")).toHaveText(/50\.00/);
            await expect(page.locator("#order-summary-total-payment-price")).toHaveText(/12,993\.80/);
            await expect(page.locator("#order-summary-receive-point-price")).toHaveText(/129/);
        });
    });