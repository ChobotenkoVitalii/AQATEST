export class BascketPage{
    constructor(page, productInfo) {
        this.page = page;
        this.firstProductItem = page.locator('[id="cart-item-name-6"]');
        this.secondProductItem = page.locator('[id="cart-item-name-5"]');

        this.firstItemPrice = page.locator('[id="cart-item-price-6"]');
        this.secondItemPrice = page.locator('[id="cart-item-price-5"]');

        this.totalValue = page.locator('[id="cart-total"]');
        this.checkoutButton = page.locator('[id="cart-checkout-button"]');
        
        this.removeFirstItemButton = page.locator('[id="cart-item-decrease-6"]');
        this.addFirstItemButton = page.locator('[id="cart-item-increase-6"]');
    }
  
    async goToCheckoutPage(){
        await this.checkoutButton.click();
        await this.page.waitForURL('/checkout');
        }

    }