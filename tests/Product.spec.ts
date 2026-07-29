import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { ProductPage } from "../pages/ProductPage";
import { URLS } from "../config/urls";

test.describe("Products", () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC008 - Verify All Products and product detail page", async ({
    page,
  }) => {
    await productPage.openProducts();

    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();

    await expect(productPage.viewProductLinks.first()).toBeVisible();

    await productPage.openProduct(2);

    await expect(page).toHaveURL(/.*\/product_details/);

    await productPage.printProductDetails();

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productCategory).toBeVisible();
    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productAvailability).toBeVisible();
    await expect(productPage.productCondition).toBeVisible();
    await expect(productPage.productBrand).toBeVisible();
  });

  test("TC009 - Search Product", async ({ page }) => {
    const searchText = "Top";

    await productPage.openProducts();

    await expect(page).toHaveURL(URLS.PRODUCTS);

    await expect(productPage.allProductsHeading).toBeVisible();

    await productPage.searchProduct(searchText);

    await expect(productPage.searchedProductsHeading).toHaveText(
      "Searched Products",
    );

    await productPage.verifyAverageSearchResult(searchText);
  });
});
