
export class RegisterPage{
constructor(page) {
    this.page=page;
    this.registerBtn = page.locator('[id="login-register-button"]');
    this.firstNameField = page.locator('[id="register-first-name"]');
    this.lastNameField = page.locator('[id="register-last-name"]');
    this.emailAdressField = page.locator('[id="register-email"]');
    this.passwordField = page.locator('[id="register-password"]');
    this.cityField = page.locator('[id="register-city"]');
    this.countryDropDown = page.locator('[id="register-country"]');
    this.phoneField = page.locator('[id="register-phone"]');
    this.streetAndHouseNumberField = page.locator('[id="register-street"]');
    this.zipCodeField = page.locator('[id="register-zip"]');
    this.submitRegistrationBtn = page.locator('[id="register-button"]');
}
    async openLoginPage(){
        await this.page.goto('/login')
    }
    async fillRegistrrationFrom(testData){
        await this.registerBtn.click();
        await this.firstNameField.fill(testData.firstName);
        await this.lastNameField.fill(testData.lastName);
        await this.emailAdressField.fill(testData.email);
        await this.passwordField.fill(testData.password);
        await this.cityField.fill(testData.city);
        await this.countryDropDown.selectOption(testData.country);
        await this.phoneField.fill(testData.phoneNumber);
        await this.streetAndHouseNumberField.fill(testData.streetAddress);
        await this.zipCodeField.fill(testData.zipCode);
        await this.submitRegistrationBtn.click();
    } 
}