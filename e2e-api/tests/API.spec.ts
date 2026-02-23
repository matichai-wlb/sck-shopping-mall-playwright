import { test, expect, request } from '@playwright/test';

test("ค้นหาและซื้อสินค้า เลือกวิธีการจัดส่งเป็น Thai Post และเลือกวิธีชำระเงินด้วยบัตรเครดิต สำเร็จ", async ({ request }) => {

    await test.step("ดำเนินการเข้าสู่ระบบ ด้วย username และ password", async () =>{
        const responseLogin = await request.post("http://139.59.225.96/api/v1/login", {
        data: {
            "username" : "user_9",
            "password" : "P@ssw0rd",
        }
    });

    expect(responseLogin.ok()).toBeTruthy();
    expect((await responseLogin.json()).access_token).toBeTruthy();
    
    const accessToken = (await responseLogin.json()).access_token;
    });

    const responseSearchProduct = await request.get("http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20", {
        headers: {
            "Authorization" : "Bearer " + accessToken,
        }
    }
    );
    expect(responseSearchProduct.ok()).toBeTruthy();
    expect((await responseSearchProduct.json()).products[0].product_name).toBe("Balance Training Bicycle");
    expect((await responseSearchProduct.json()).products[0].product_price_thb).toBe(4314.6);

});