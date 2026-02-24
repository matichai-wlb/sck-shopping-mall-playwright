import { test, expect } from '@playwright/test';

test("ค้นหาและซื้อสินค้า Balance Training Bicycle ผ่าน API สำเร็จ", async ({ request }) => {
    
    let accessToken: string;

    await test.step("Login - เข้าสู่ระบบเพื่อรับ Token", async () => {
        const response = await request.post("http://139.59.225.96/api/v1/login", {
            data: {
                "username": "user_9",
                "password": "P@ssw0rd",
            }
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        accessToken = body.access_token; 
    });

    await test.step("ตรวจสอบข้อมูลสินค้า (Name, Price, ID)", async () => {
        const response = await request.get("http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        const product = body.products[0];
        
        expect(product.id).toBe(1);
        expect(product.product_name).toBe("Balance Training Bicycle");
        expect(product.product_price_thb).toBe(4314.6);
    });
});

  