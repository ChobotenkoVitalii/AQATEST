export class CheckoutPage{
    constructor(page){
        this.page = page;
        this.cardNumberField = page.getByPlaceholder('Card Number (16 digits)');
        this.payNowBtn = page.getByRole('button', {name:'Pay Now'});
        this.cardDate = page.getByPlaceholder('MM/YY');
        this.cardCVV = page.getByPlaceholder('CVV (3 digits)');
        this.successOrder = page.getByText('✅ Payment Successful!');
        this.myAccountBtn = page.locator('[href="/account"]');

    }   
    async fillPaymentData(cardNumber, cardDate, cardCvv){
    await this.cardNumberField.type(cardNumber,{delay:100});
    await this.cardNumberField.press('Enter');
    await this.cardDate.fill(cardDate);
    await this.cardCVV.fill(cardCvv);
    await this.payNowBtn.click();
  }
  async goToMyAccount(){
   await this.myAccountBtn.click();
  }
}