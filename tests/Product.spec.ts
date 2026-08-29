import { faker } from "@faker-js/faker";
import { test, expect } from "../fixtures/pomFixture";
import { URLS } from "../config/urls";

/**
 * Product catalog + cart flows.
 * TC014 (Register-while-Checkout) intentionally lives only in Checkout.spec.ts
 * to avoid duplicate execution.
 */
test.describe("Products & Cart", () => {
  test.beforeEach(async ({ page, homePage }) => {
    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC008 - Verify All Products and product detail page", async ({
    page,
    productPage,
  }) => {
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();
    await expect(productPage.viewProductLinks.first()).toBeVisible();

    await productPage.openProduct(2);
    await expect(page).toHaveURL(/.*\/product_details/);

    // Assert on the parsed content — visibility of empty containers isn't enough.
    const details = await productPage.getProductDetails();
    expect(details.name, "Product name should be non-empty").toBeTruthy();
    expect(details.category, "Category should be non-empty").toBeTruthy();
    expect(details.price, "Price should contain 'Rs.'").toContain("Rs.");
    expect(details.availability, "Availability should be non-empty").toBeTruthy();
    expect(details.condition, "Condition should be non-empty").toBeTruthy();
    expect(details.brand, "Brand should be non-empty").toBeTruthy();
  });

  test("TC009 - Search Product", async ({ page, productPage }) => {
    const searchText = "Top";

    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();

    await productPage.searchProduct(searchText);
    await expect(productPage.searchedProductsHeading).toHaveText(
      "Searched Products",
    );

    // At least one match must actually be present.
    const results = await productPage.getSearchedProducts();
    expect(results.length, "Search should return at least one product").toBeGreaterThan(0);

    await productPage.verifyAverageSearchResult(searchText);
  });

  test("TC012 - Add Products in Cart", async ({ page, productPage, cartPage }) => {
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();

    // Capture name/price from the listing BEFORE adding — avoids hardcoded strings.
    const info1 = await productPage.getProductCardInfo(1);
    const info2 = await productPage.getProductCardInfo(2);
    expect(info1.name, "Product 1 name should be readable").toBeTruthy();
    expect(info2.name, "Product 2 name should be readable").toBeTruthy();
    const { name: p1Name, price: p1Price } = info1 as { name: string; price: string };
    const { name: p2Name, price: p2Price } = info2 as { name: string; price: string };

    await productPage.addProductToCart(1);
    await productPage.clickContinueShopping();
    await productPage.addProductToCart(2);

    await cartPage.openCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);
    await expect(cartPage.cartRows).toHaveCount(2);

    // Unified row-based lookup for both products (consistent selector strategy).
    const row1 = await cartPage.getCartRowDetails(p1Name);
    const row2 = await cartPage.getCartRowDetails(p2Name);

    expect(row1.name).toBe(p1Name);
    expect(row2.name).toBe(p2Name);
    expect(row1.price).toBe(p1Price);
    expect(row2.price).toBe(p2Price);
    expect(row1.quantity).toBe("1");
    expect(row2.quantity).toBe("1");
    // With quantity=1 the line total equals the unit price.
    expect(row1.total).toBe(p1Price);
    expect(row2.total).toBe(p2Price);
  });

  test("TC013 - Verify Product quantity in Cart", async ({
    page,
    productPage,
    cartPage,
  }) => {
    const desiredQuantity = 4;

    await productPage.openProduct(1);
    await expect(page).toHaveURL(/.*product_details/);

    // Capture the product name from the detail page so we can assert on the cart row.
    const detailName = (await productPage.productName.textContent())?.trim() ?? "";
    expect(detailName, "Detail-page product name should be readable").toBeTruthy();

    await productPage.setQuantity(desiredQuantity);
    await productPage.addCurrentProductToCart();
    await productPage.openViewCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);

    const row = await cartPage.getCartRowDetails(detailName);
    expect(row.name).toBe(detailName);
    expect(row.quantity).toBe(String(desiredQuantity));
  });

  test("TC017 - Remove Products From Cart", async ({ page, productPage, cartPage }) => {
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);

    // Capture name upfront so we can identify (and remove) the correct cart row.
    const info = await productPage.getProductCardInfo(1);
    expect(info.name, "Product 1 name should be readable").toBeTruthy();

    await productPage.addProductToCart(1);
    await productPage.clickContinueShopping();

    await cartPage.openCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);
    await expect(cartPage.cartRows).toHaveCount(1);

    await cartPage.removeProduct(info.name as string);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test("TC018 - View Category Products", async ({ page, productPage }) => {
    await productPage.openProducts();
    await expect(productPage.categoriesHeading).toBeVisible();

    await productPage.openSubcategory("Women", "Dress");
    await expect(page).toHaveURL(/\/category_products\/\d+/);
    await expect(productPage.categoryPageHeading).toContainText(/WOMEN\s*-\s*DRESS/i);

    await productPage.openSubcategory("Men", "Tshirts");
    await expect(page).toHaveURL(/\/category_products\/\d+/);
    await expect(productPage.categoryPageHeading).toContainText(/MEN\s*-\s*TSHIRTS/i);
  });

  test("TC019 - View & Cart Brand Products", async ({ page, productPage }) => {
    await productPage.openProducts();
    await expect(productPage.brandsHeading).toBeVisible();

    await productPage.openBrand("Polo");
    await expect(page).toHaveURL(/\/brand_products\/Polo/);
    await expect(productPage.categoryPageHeading).toContainText(/POLO/i);

    await productPage.openBrand("Madame");
    await expect(page).toHaveURL(/\/brand_products\/Madame/);
    await expect(productPage.categoryPageHeading).toContainText(/MADAME/i);
  });

  test("TC020 - Search Products and Verify Cart After Login", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    productPage,
    cartPage,
    registerUser,
  }) => {
    let accountCreated = false;
    try {
      await test.step("Register a fresh user (for the login step later)", async () => {
        await homePage.openLoginPage();
        await loginPage.startSignup(registerUser.name, registerUser.email);
        await signupPage.fillAccountInformation(registerUser);
        await expect(confirmationPage.accountCreatedMessage).toBeVisible();
        accountCreated = true;
        await confirmationPage.continue();
        await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
      });

      await test.step("Logout, search, and add every result to the cart", async () => {
        await homePage.logout();
        await productPage.openProducts();
        await productPage.searchProduct("Top");
        await expect(productPage.searchedProductsHeading).toBeVisible();
        const addedNames = await productPage.addAllSearchedProductsToCart();
        expect(addedNames.length, "Should have added at least one product").toBeGreaterThan(0);

        await cartPage.openCart();
        await expect(page).toHaveURL(URLS.VIEW_CART);
        await expect(cartPage.cartRows).toHaveCount(addedNames.length);

        // Stash for the login-and-verify phase.
        (test.info() as { attach?: unknown } & Record<string, unknown>).addedNames = addedNames;
      });

      await test.step("Log back in and verify the cart still contains the added items", async () => {
        await homePage.openLoginPage();
        await loginPage.login(registerUser.email, registerUser.password);
        await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
        await cartPage.openCart();
        await expect(page).toHaveURL(URLS.VIEW_CART);

        const addedNames = (test.info() as unknown as { addedNames: string[] }).addedNames;
        for (const name of addedNames) {
          await expect(cartPage.getRowByProductName(name)).toBeVisible();
        }
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete the test account", async () => {
          await homePage.deleteAccount();
          await expect(confirmationPage.accountDeletedMessage).toBeVisible();
          await confirmationPage.continue();
        });
      }
    }
  });

  test("TC021 - Add review on product", async ({ page, productPage }) => {
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);

    await productPage.openProduct(1);
    await expect(page).toHaveURL(/.*product_details/);
    await expect(productPage.writeYourReviewHeading).toBeVisible();

    await productPage.submitReview({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      review: faker.lorem.sentences(2),
    });

    await expect(productPage.reviewSuccessMessage).toBeVisible();
  });

  test("TC022 - Add to cart from Recommended items", async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // Home page is already loaded by beforeEach; scroll to the "Recommended items" band.
    await homePage.scrollToBottom();
    await expect(homePage.recommendedItemsHeading).toBeVisible();

    // Capture the name BEFORE clicking so we can assert its cart presence later.
    const recommendedName = await homePage.getRecommendedItemName(1);
    expect(recommendedName, "Recommended item name should be readable").toBeTruthy();

    await homePage.addRecommendedItemToCart(1);
    await productPage.clickContinueShopping();

    await cartPage.openCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);
    await expect(cartPage.getRowByProductName(recommendedName)).toBeVisible();
  });
});
