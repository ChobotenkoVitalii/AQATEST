export class LoginPage{
    constructor(page){
        this.page = page;
        this.emailField = page.locator('[id="login-email"]');
        this.passwordField = page.locator('[id="login-password"]');
        this.loginBtn = page.locator('[id="login-button"]');
        this.catalogTitle = page.locator('[id="catalog-title"]');
    }
    async login(email, password){
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginBtn.click();
        await this.catalogTitle.waitFor();
    }
}