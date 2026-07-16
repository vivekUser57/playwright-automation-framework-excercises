export interface RegisterUser {
  // Signup
  name: string;
  email: string;

  // Account Information
  title: string;
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter: boolean;
  offers: boolean;

  // Address Information
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}