/**
 * Central URL registry. All specs and POMs read from here so there are
 * no magic URL strings scattered across the codebase.
 */
export const URLS = {
  HOME: "https://automationexercise.com/",
  LOGIN: "https://automationexercise.com/login",
  PRODUCTS: "https://automationexercise.com/products",
  PRODUCT_DETAILS: "https://automationexercise.com/product_details",
  CONTACT_US: "https://automationexercise.com/contact_us",
  TEST_CASES: "https://automationexercise.com/test_cases",
  VIEW_CART: "https://automationexercise.com/view_cart",
  CHECKOUT: "https://automationexercise.com/checkout",
  PAYMENT: "https://automationexercise.com/payment",
  PAYMENT_DONE: "https://automationexercise.com/payment_done",
} as const;
