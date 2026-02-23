import { test, expect } from '@playwright/test';

test(`ค้นหาและซื้อสินค้า เลือกวิธีการจัดส่งเป็น Thai Post และชำระเงินด้วยบัตรเครดิต Visa`, async ({ request }) => {
    const responselogin = await request.post('http://139.59.225.96/api/v1/login', {
        data: {
            username: 'user_9',
            password: 'P@ssw0rd',
        },
    });

    expect(responselogin.ok()).toBeTruthy();
    expect((await responselogin.json()).access_token).toBeTruthy();

    test.info().attach('[POST] /login response', {
        body: JSON.stringify(await responselogin.json()),
    })

    const accessToken = (await responselogin.json()).access_token;

    const responseSearchProduct = await request.get('http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    expect(responseSearchProduct.ok()).toBeTruthy();
    expect((await responseSearchProduct.json()).product_name).toBe(
        'Balance Training Bicycle'
    );
    expect((await responseSearchProduct.json()).product_price, 
    "Verify product price should be equal to 4314.60").toBe(
        4314.60
    );
});