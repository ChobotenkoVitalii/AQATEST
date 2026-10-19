import {expect, test} from '@playwright/test';

import {newUser1} from '../data/testData';
import {cardData} from '../data/testData';

import {RegisterPage} from '../page-object/Register.page';
import {LoginPage} from '../page-object/Login.page';
import {CatalogPage} from '../page-object/Catalog.page';
import {BascketPage} from '../page-object/Bascket.page';
import {CheckoutPage} from '../page-object/Checkout.page';
import {MyAccountPage} from '../page-object/MyAccount.page';

test.setTimeout(50*1000);
test.use({ viewport: { width: 1024, height: 760 } });
test('Create user, login, order 2 items, payment', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const catalogPage = new CatalogPage(page);
  const checkoutPage = new CheckoutPage(page);
  const myAccountPage = new MyAccountPage(page);
  const basketPage = new BascketPage(page);

  await registerPage.openLoginPage();
  await registerPage.fillRegistrrationFrom(newUser1);
  await loginPage.login(newUser1.email, newUser1.password);
  const items = await catalogPage.selectProduct();
  
  // Check that the basket count is visible and contains the correct number of items  
  await expect(catalogPage.basketCount).toBeVisible();
  await expect(catalogPage.basketCount).toContainText('2',{timeout:3000});
  await catalogPage.gotoBasket();
  
  // Check products details
  await expect(basketPage.firstProductItem).toHaveText(items.secondProduct.name);
  await expect(basketPage.secondProductItem).toHaveText(items.firstProduct.name);
  await expect(basketPage.firstItemPrice).toHaveText(items.secondProduct.price);
  await expect(basketPage.secondItemPrice).toHaveText(items.firstProduct.price);
  
  // Comparing total price with the sum of the two products
  const firstProductPriceNumber = Number((await basketPage.firstItemPrice.innerText()).replace(/\D/g, ''));
  const secondProductPriceNumber = Number((await basketPage.secondItemPrice.innerText()).replace(/\D/g, ''));
  const totalNumber = parseInt((await basketPage.totalValue.innerText()).replace(/[^\d.]/g, ''),10);
  await basketPage.checkTotalPrice();

  expect(totalNumber).toBe(firstProductPriceNumber + secondProductPriceNumber);
  
  // Check payment success message and URL     
  await checkoutPage.fillPaymentData(cardData.cardNumber, cardData.cardDate, cardData.cardCvv); 
  await expect(checkoutPage.successOrder).toBeVisible({timeout: 8000});
  await expect(checkoutPage.page).toHaveURL('/checkout');
  
  // Check URL after redirecting to My Account page
  await checkoutPage.goToMyAccount();
  await expect(checkoutPage.page).toHaveURL('/account');
  
  // Check total amount in My Account page
  const totalPrice = Number(items.firstProduct.price.replace(/\D/g, '')) + Number(items.secondProduct.price.replace(/\D/g, ''));
  console.log(totalPrice);
  const totalAmountFiledNumber = parseInt((await myAccountPage.totalAmountFiled.innerText()).replace(/[^\d.]/g, ''), 10);
  expect(totalAmountFiledNumber).toBe(totalPrice);

  // Check that two previously ordered items are present in My Account page
 
  await expect(myAccountPage.items.first()).toBeVisible();
  await expect(myAccountPage.items.last()).toBeVisible();
  await expect(myAccountPage.logoutButton).toBeEnabled();
  await expect(myAccountPage.editButton).toBeEnabled();

  await myAccountPage.logout();
}
)