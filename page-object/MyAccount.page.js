import { expect } from '@playwright/test';
export class MyAccountPage {
    constructor(page) {
        this.page = page;
        this.items = page.locator('#account-order-0 ul>li');
        this.totalAmountFiled = page.locator('#account-order-0 p', {hasText:'Total Amount:'});
        this.editButton = page.locator('[id="account-edit-button"]');
        this.logoutButton = page.locator('[id="account-logout-button"]');
    }

    async checkFinalOrder(firstItemPrice, secondItemPrice) {
        const totalPrice = Number(firstItemPrice.replace(/\D/g, '')) + Number(secondItemPrice.replace(/\D/g, ''));
        console.log(totalPrice);
        const totalAmountFiledNumber = parseInt((await this.totalAmountFiled.innerText()).replace(/[^\d.]/g, ''), 10);
        expect(totalAmountFiledNumber).toBe(totalPrice);
    }
    async checkTwoItems(){
        await expect(this.items.first()).toBeVisible();
        await expect(this.items.last()).toBeVisible();
        await expect(this.logoutButton).toBeEnabled();
        await expect(this.editButton).toBeEnabled();
    }
    async logout(){
        await this.logoutButton.click();
    }
}