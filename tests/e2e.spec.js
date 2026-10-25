import {expect, test} from '@playwright/test';
import {cardData} from '../data/testData';


import {CatalogPage} from '../page-object/Catalog.page';
import {BascketPage} from '../page-object/Bascket.page';
import {CheckoutPage} from '../page-object/Checkout.page';
import {MyAccountPage} from '../page-object/MyAccount.page';
 
test.describe('e2e: order flow', () => {

  test.beforeAll(async()=>{
    console.log('Before all: prepare test data');
    console.log('Before all: generate users');
    console.log('Before all: ready');
  })

  test.beforeEach(async({page})=>{
    console.log('Before Each: open catalog page');
    await page.goto('/');
  })

  test.afterEach(async({page,},testinfo)=>{
    if (testinfo.status !== testinfo.expectedStatus) {
      console.log(`After Each: Test failed: ${testinfo.title}`);

      await page.screenshot({
        path:'test-results/${testInfo.titile}-failed.png',
        fullPage: true,
      });
    }
  })

  test.afterAll(async()=>{
    console.log('After all: clean up test data');
  })

test.use({ viewport: { width: 1024, height: 760 } });
test('Create user, login, order 2 items, payment', async ({ page }) => {
  const catalogPage = new CatalogPage(page);
  const checkoutPage = new CheckoutPage(page);
  const myAccountPage = new MyAccountPage(page);
  const basketPage = new BascketPage(page);

  let items;
  
  await test.step('Select 2 items', async() => {
    items = await catalogPage.selectProduct();
  })
  
  await test.step('Verify basket count(visible, qty)', async() => {
    await expect(catalogPage.basketCount).toBeVisible();
    await expect(catalogPage.basketCount).toContainText('2',{timeout:3000});
  })
  
  await test.step('Go to basket', async() => {
    await catalogPage.gotoBasket();
  })
  
  await test.step('Verify product details in basket', async() => {
    await expect(basketPage.firstProductItem).toHaveText(items.secondProduct.name);
    await expect(basketPage.secondProductItem).toHaveText(items.firstProduct.name);
    await expect(basketPage.firstItemPrice).toHaveText(items.secondProduct.price);
    await expect(basketPage.secondItemPrice).toHaveText(items.firstProduct.price);
  })

  await test.step('Verify total price', async() => {
    const firstProductPriceNumber = Number((await basketPage.firstItemPrice.innerText()).replace(/\D/g, ''));
    const secondProductPriceNumber = Number((await basketPage.secondItemPrice.innerText()).replace(/\D/g, ''));
    const totalNumber = parseInt((await basketPage.totalValue.innerText()).replace(/[^\d.]/g, ''),10);
    expect(totalNumber).toBe(firstProductPriceNumber + secondProductPriceNumber);
  })  
  
  await test.step('Go to checkout page', async() => {
    await basketPage.goToCheckoutPage();
  })
  
  await test.step('Fill payment data and submit payment', async() => {
    await checkoutPage.fillPaymentData(cardData.cardNumber, cardData.cardDate, cardData.cardCvv); 
  })
  
  await test.step('Verify succesfull order', async() => {
    await expect(checkoutPage.successOrder).toBeVisible({timeout: 8000});
    await expect(checkoutPage.page).toHaveURL('/checkout');
  })
  
  await test.step('Go to My Account page', async() => {
    await checkoutPage.goToMyAccount();
    await expect(checkoutPage.page).toHaveURL('/account');
  })
  
  await test.step('Verify total amount in My Account page', async() => {
    const totalPrice = Number(items.firstProduct.price.replace(/\D/g, '')) + Number(items.secondProduct.price.replace(/\D/g, ''));
    console.log(totalPrice);
    const totalAmountFiledNumber = parseInt((await myAccountPage.totalAmountFiled.innerText()).replace(/[^\d.]/g, ''), 10);
    expect(totalAmountFiledNumber).toBe(totalPrice);
  })
  
  await test.step('Verify item list in My Account page', async() => {
    await expect(myAccountPage.items.first()).toBeVisible();
    await expect(myAccountPage.items.last()).toBeVisible();
    await expect(myAccountPage.logoutButton).toBeEnabled();
    await expect(myAccountPage.editButton).toBeEnabled();
  })
  await test.step('Logout', async() => {
    await myAccountPage.logout();
  })
  })
})