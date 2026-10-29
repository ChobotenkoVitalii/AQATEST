import{test,expect}from "@playwright/test";

test.setTimeout(120*1000);

test.describe('Snapshots testing', () => {
    test('Login page - visualRegression', async({page})=>{
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('login-page.png',{
        fullPage:true,
        animation: 'disabled',
    });
})
    test('Catalog page - visualRegression', async({page})=>{
        await page.goto('/catalog');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('catalog-page.png',{
        fullPage:true,
        animation: 'disabled',
    });
})
})
