exports.AbstractPage = class AbstractPage {
    constructor(page) {
        this.page = page;
    }

    async openPage(url){
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }
}
