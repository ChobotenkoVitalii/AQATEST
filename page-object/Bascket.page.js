import { expect } from "@playwright/test";

export class BascketPage{
    constructor(page, productInfo) {
        this.page = page;
        this.firstProductItem = page.locator('[id="cart-item-name-6"]');
        this.secondProductItem = page.locator('[id="cart-item-name-5"]');

        this.firstItemPrice = page.locator('[id="cart-item-price-6"]');
        this.secondProductPrice = page.locator('[id="cart-item-price-5"]');

        this.totalValue = page.locator('[id="cart-total"]');
        this.checkoutButton = page.locator('[id="cart-checkout-button"]');
        
        this.removeFirstItemButton = page.locator('[id="cart-item-decrease-6"]');
        this.addFirstItemButton = page.locator('[id="cart-item-increase-6"]');
        
        this.tabletNameValue = productInfo.tabletNameValue;
        this.coffeeMachineNameValue = productInfo.coffeeMachineNameValue;
        this.tabletPriceValue = productInfo.tabletPriceValue;
        this.coffeeMachinePriceValue = productInfo.coffeeMachinePriceValue;
    }
    async compareProductsDetails(){
        await expect(this.firstProductItem).toHaveText(this.coffeeMachineNameValue);
        await expect(this.secondProductItem).toHaveText(this.tabletNameValue);
        await expect(this.firstItemPrice).toHaveText(this.coffeeMachinePriceValue);
        await expect(this.secondProductPrice).toHaveText(this.tabletPriceValue);
    }
    async checkTotalPrice(){
        this.firstItemPriceText = await this.firstItemPrice.innerText();
        this.secondItemPriceText = await this.secondProductPrice.innerText();
        const firstProductPriceNumber = Number(this.firstItemPriceText.replace(/\D/g, ''));
        const secondProductPriceNumber = Number(this.secondItemPriceText.replace(/\D/g, ''));
        const totalNumber = parseInt((await this.totalValue.innerText()).replace(/[^\d.]/g, ''),10);
        expect(totalNumber).toBe(firstProductPriceNumber + secondProductPriceNumber);
        await this.checkoutButton.click();
        await this.page.waitForURL('https://aqa-app.vercel.app/checkout');
        }

    }