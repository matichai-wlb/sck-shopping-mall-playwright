import { test, expect } from '@playwright/test';

const shoppingData = [
    {
    ItemName: "Balance Training Bicycle",
    ItemPrice: "4,314.60",
    ItemPoint: "43",
    ItemQuantity: "1",
    ExpectedCartCount: "1",
    SubtotalPrice: "4,314.60", 
    ShippingFee: "50.00",
    TotalPayment: "4,364.60",
    RecivePoint: "43",
    Fullname: "MATICHAI DUANGJIT",
    CreditCard: "4444 5555 5555 5555",
    ExpirationDate: "12/26",
    SecurityCode: "726",
    FirstName: "Matichai",
    LastName: "Duangjit",
    Address: "123 หมู่ 6, ถนนสุขุมวิท",
    SubDistrict: "บางนา",
    District: "เขตบางนา",
    Province: "กรุงเทพมหานคร",
    ExpectedPostalCode: "10260",
    PhoneNumber: "0625928956",
    Email: "matichai.dua@welovebug.com",
    Date: "21/02/2026",
    // ... ข้อมูลอื่นๆ
    }
];

shoppingData.forEach((data) => {
    test(`ทดสอบซื้อสินค้า: ${data.ItemName}`, async ({ page }) => {
        
        await page.goto('http://139.59.225.96/');

        const [shopPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('link', { name: 'Shopping mall' }).click(),
        ]);

        
        await shopPage.waitForLoadState();

        // --- เข้าสู่ระบบ ---
        await shopPage.locator("#login-username-input").fill('user_9');
        await shopPage.locator("#login-password-input").fill('P@ssw0rd');
        await shopPage.click("#login-btn");

        // --- ค้นหาสินค้า ---
        await shopPage.fill("#search-product-input", data.ItemName);
        await shopPage.click("#search-product-btn");

        // --- ตรวจสอบและเลือกสินค้า ---
        const productCard = shopPage.locator("#product-card-name-2");
        await expect(productCard).toContainText(data.ItemName);
        await productCard.click();

        // --- ตรวจสอบราคาในหน้า Detail ---
        // await expect(shopPage.locator("#product-detail-price-thb")).toContainText(data.ItemPrice);
        await expect(shopPage.locator("#product-detail-point")).toContainText(data.ItemPoint);
        await expect(shopPage.locator("#product-detail-product-name")).toContainText(data.ItemName);

        // --- เพิ่มสินค้าลงตะกร้า ---
        await shopPage.click("#product-detail-add-to-cart-btn");
        await expect(shopPage.locator("#header-menu-cart-badge")).toContainText(data.ExpectedCartCount);
        await shopPage.click("#header-menu-cart-badge");

        // --- ตรวจสอบรายละเอียดสินค้าในตะกร้าและกด Checkout ---
        await expect(shopPage.locator("#shopping-cart-header")).toContainText('Shopping cart');
        await expect(shopPage.locator("#product-2-name")).toContainText(data.ItemName);
        await expect(shopPage.locator("#product-2-price")).toContainText(data.ItemPrice);
        await expect(shopPage.locator("#product-2-point")).toContainText(data.ItemPoint);
        await expect(shopPage.locator("#shopping-cart-subtotal-price")).toContainText(data.SubtotalPrice);
        await shopPage.click("#shopping-cart-checkout-btn");

        // --- ตรวจสอบราคารวม checkout---
        await expect(shopPage.locator("#order-summary-shipping-fee-price")).toContainText(data.ShippingFee);
        await expect(shopPage.locator("#order-summary-total-payment-price")).toContainText(data.TotalPayment);
        await expect(shopPage.locator("#order-summary-receive-point-price")).toContainText(data.RecivePoint);

        // --- ระบุที่อยู่จัดส่ง ---
        await shopPage.fill("#shipping-form-first-name-input", data.FirstName);
        await shopPage.fill("#shipping-form-last-name-input", data.LastName);
        await shopPage.fill("#shipping-form-address-input", data.Address);
        await shopPage.selectOption("#shipping-form-province-select", data.Province);
        await shopPage.selectOption("#shipping-form-district-select", data.District);
        await shopPage.selectOption("#shipping-form-sub-district-select", data.SubDistrict);
        await expect(shopPage.locator("#shipping-form-zipcode-input")).toContainText(data.ExpectedPostalCode);
        await shopPage.fill("#shipping-form-mobile-input", data.PhoneNumber);

        // --- ระบุวิธีการจัดส่งและข้อมูลการชำระเงิน กด PAYNOW ---
        await shopPage.click("#shipping-method-2-name");
        await shopPage.click("#payment-credit-input");
        await shopPage.fill("#payment-credit-form-fullname-input", data.Fullname);
        await shopPage.fill("#payment-credit-form-card-number-input", data.CreditCard);
        await shopPage.fill("#payment-credit-form-expiry-input", data.ExpirationDate);
        await shopPage.fill("#payment-credit-form-cvv-input", data.SecurityCode);
        await shopPage.click("#payment-now-btn");

        // --- ยืนยันรหัส OTP และตรวจสอบข้อความยืนยันการสั่งซื้อ ---
        await expect(shopPage.getByText("SCK Shopping Mall")).toBeVisible();
        await expect(shopPage.getByText(data.Date)).toBeVisible();
        await shopPage.fill("#otp-input", '123456');
        await shopPage.getByRole('button', { name: 'OK' }).click();
        
        // --- ตรวจสอบข้อมูล order หลังจากสั่งซื้อสำเร็จ ส่งแจ้งเตือน---
        await expect(shopPage.getByText("Thank you for your order")).toBeVisible();
        await expect(shopPage.locator("#order-success-order-payment-date")).toContainText(data.Date);
        // await expect(shopPage.locator("#order-success-order-id")).toContainText("xxxxxxxxxxx")
        // await expect(shopPage.locator("#order-success-tracking-id")).toContainText("xxxxxxxxxxx")
        await shopPage.fill("#notification-form-email-input", data.Email);
        await shopPage.fill("#notification-form-mobile-input", data.PhoneNumber);
        await shopPage.click("#send-notification-btn");


    });
});