import {test, expect} from "@playwright/test";
import {LoginPage} from "../page-object/Login.page";
import {CatalogPage} from "../page-object/Catalog.page";

test.setTimeout(120*1000);

const screenshotDefaults = {
    fullPage: true,
    animation: 'disabled',
};

test.describe('Snapshots testing', () => {
    test('Login page - visualRegression', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.openPage('/login');
        await expect(page).toHaveScreenshot('login-page.png', {
            ...screenshotDefaults,
            maxDiffPixels: 100,
        });
    });
    test('Catalog page - visualRegression', async({page})=>{
        const catalogPage = new CatalogPage(page);
        await catalogPage.openPage('/');
        await expect(page).toHaveScreenshot('catalog-page.png', {
            ...screenshotDefaults,
            maxDiffPixelRatio: 0.01,
        });
    });
});
