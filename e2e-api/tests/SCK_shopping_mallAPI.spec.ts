import { test, expect } from '@playwright/test';

test("ค้นหาและซื้อสินค้า เลือกวิธีการจัดส่งเป็น Thai Post และเลือกวิธีชำระเงินด้วยบัตรเครดิต สำเร็จ", async ({ request }) => {
    
    let accessToken: string; // ประกาศไว้ข้างนอกเพื่อให้ step อื่นๆ เรียกใช้ได้

    await test.step("ดำเนินการเข้าสู่ระบบ ด้วย username และ password", async () => {
        const responseLogin = await request.post("http://139.59.225.96/api/v1/login", {
            data: {
                "username": "user_9",
                "password": "P@ssw0rd",
            }
        });

        expect(responseLogin.ok()).toBeTruthy();
        
        const loginData = await responseLogin.json(); 
        expect(loginData.access_token).toBeTruthy();
        accessToken = loginData.access_token; 
    });

    await test.step("ค้นหาสินค้า Bicycle", async () => {
        const responseSearchProduct = await request.get("http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20", {
            headers: {
                "Authorization": `Bearer ${accessToken}`, 
            }
        });

        expect(responseSearchProduct.ok()).toBeTruthy();
        
        const searchData = await responseSearchProduct.json();
        // ตรวจสอบข้อมูลสินค้าตัวแรก
        expect(searchData.products[0].product_name).toBe("Balance Training Bicycle");
        expect(searchData.products[0].product_price_thb).toBe(4314.6);
    });

    await test.step("เพิ่มสินค้า Balance Training Bicycle ลงตะกร้า", async () => {
        const responseAddToCart = await request.post("http://139.59.225.96/api/v1/product/1", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            data: {
                "quantity": 1
            }
        });

        expect(responseAddToCart.ok()).toBeTruthy();
        const addToCartData = await responseAddToCart.json();

    });

    await test.step("เลือกวิธีการจัดส่งเป็น Thai Post และเลือกวิธีชำระเงินด้วยบัตรเครดิต", async () => {
        const responseCheckout = await request.post("http://139.59.225.96/api/v1/checkout", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            data: {
                "shipping_method": "thai post",
                "payment_method": "Credit Card / Debit Card",
                "credit_card": {
                    "full_name": "MATICHAI DUANGJIT",
                    "card_number": "4444555555555555",
                    "expiry_date": "12/26",
                    "cvv": 726
                }
            }
        });

            expect(responseCheckout.ok()).toBeTruthy();
            const checkoutData = await responseCheckout.json();
    
        });
    });