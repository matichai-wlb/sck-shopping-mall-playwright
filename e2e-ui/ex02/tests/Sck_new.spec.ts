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
            await expect(page.locator("#product-card-name-1")).toContainText('Balance Training Bicycle');
            await page.locator("#product-card-name-1").click();
            await expect(page.locator("#product-detail-product-name")).toContainText('Balance Training Bicycle');
            await expect(page.locator("#product-detail-price-thb")).toContainText('4,314.60');
            await expect(page.locator("#product-detail-point")).toContainText('43');
            await expect(page.locator("#product-detail-stock")).toContainText('90');
        });

        await test.step('3. เพิ่มสินค้าลงตะกร้าและตรวจสอบ', async () => {
            await page.locator("#product-detail-quantity-input").fill('3');
            await page.locator("#product-detail-add-to-cart-btn").click(); 
            await expect(page.locator("#header-menu-cart-badge")).toContainText('1');
            await page.locator("#header-menu-cart-btn").click();
            await expect(page.locator("#product-1-name")).toContainText('Balance Training Bicycle');
            await expect(page.locator("#product-1-price")).toContainText('12,943.80');
            await expect(page.locator("#product-1-point")).toContainText('129');
            await expect(page.locator("#shopping-cart-subtotal-price")).toContainText('12,943.80');
            await expect(page.locator("#product-1-quantity-input")).toHaveValue('3');


        });
    });