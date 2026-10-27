export class MyAccountPage {
    constructor(page) {
        this.page = page;
        this.items = page.locator('#account-order-0 ul>li');
        this.totalAmountFiled = page.locator('#account-order-0 p', {hasText:'Total Amount:'});
        this.editButton = page.locator('[id="account-edit-button"]');
        this.logoutButton = page.locator('[id="account-logout-button"]');
    }
    async logout(){
        await this.logoutButton.click();
    }
}