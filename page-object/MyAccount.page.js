const{AbstractPage} = require('./Abstract.page');

export class MyAccountPage extends AbstractPage {
    constructor(page) {
        super(page);
        this.items = page.locator('#account-order-0 ul>li');
        this.totalAmountFiled = page.locator('#account-order-0 p', {hasText:'Total Amount:'});
        this.editButton = page.locator('[id="account-edit-button"]');
        this.firstNameInput = page.locator('[id="account-input-firstname"]');
        this.lastNameInput = page.locator('[id="account-input-lastname"]');
        this.phoneInput = page.locator('[id="account-input-phone"]');
        this.streetInput = page.locator('[id="account-input-street"]');
        this.cityInput = page.locator('[id="account-input-city"]');
        this.zipCodeInput = page.locator('[id="account-input-zip"]');
        this.saveButton = page.locator('[id="account-save-button"]');
        this.cancelButton = page.locator('[id="account-cancel-button"]');
        this.logoutButton = page.locator('[id="account-logout-button"]');
    }
    async logout(){
        await this.logoutButton.click();
    }
}