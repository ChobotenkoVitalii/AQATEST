import { test } from '@playwright/test';

import {newUser1} from '../data/testData';
import {cardData} from '../data/testData';

import {RegisterPage} from '../page-object/Register.page';
import {LoginPage} from '../page-object/Login.page';
import {CatalogPage} from '../page-object/Catalog.page';
import { BascketPage } from '../page-object/Bascket.page';
import { CheckoutPage } from '../page-object/Checkout.page';
import { MyAccountPage } from '../page-object/MyAccount.page';

test.setTimeout(50*1000);
test.use({ viewport: { width: 1024, height: 760 } });
test('test', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const catalogPage = new CatalogPage(page);
  const checkoutPage = new CheckoutPage(page);
  const myAccountPage = new MyAccountPage(page);

  await registerPage.navigate();
  await registerPage.fillRegistrrationFrom(newUser1);
  await loginPage.login(newUser1.email, newUser1.password);
  await catalogPage.selectProduct();
  const basketPage = new BascketPage(page, catalogPage.productInfo);
  await basketPage.compareProductsDetails();
  await basketPage.checkTotalPrice();
  await checkoutPage.fillPaymentData(cardData.cardNumber, cardData.cardDate, cardData.cardCvv);
  await checkoutPage.successOrderMessage();
  await checkoutPage.goToMyAccount();
  await myAccountPage.checkFinalOrder(basketPage.firstItemPriceText, basketPage.secondItemPriceText);
  await myAccountPage.checkFinalOrder(basketPage.firstItemPriceText, basketPage.secondItemPriceText);
  await myAccountPage.checkTwoItems();
  await myAccountPage.logout();
}
)