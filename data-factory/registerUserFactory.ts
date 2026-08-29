import registerData from "../test-data/registerData.json";
import { RegisterUser } from "../types/RegisterUser";

/**
 * Generic factory for RegisterUser payloads.
 *
 * Static defaults come from `test-data/registerData.json`; the email is
 * regenerated on every call so parallel/repeated runs never collide with
 * "Email Address already exist!" on automationexercise.com.
 */
export class RegisterUserFactory {
  static create(overrides: Partial<RegisterUser> = {}): RegisterUser {
    const uniqueEmail = `qa.${Date.now()}.${Math.floor(
      Math.random() * 1_000_000,
    )}@test.com`;

    return {
      // JSON has no `offers` / `company` / `address2` — supply safe defaults
      // so the returned object always satisfies the RegisterUser contract.
      offers: false,
      company: "",
      address2: "",
      ...(registerData as Partial<RegisterUser>),
      email: uniqueEmail,
      ...overrides,
    } as RegisterUser;
  }
}
