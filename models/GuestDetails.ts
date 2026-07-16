export class GuestDetails {

    title: string;
    name: string;
    email: string;
    password: string;

    day: string;
    month: string;
    year: string;

    newsletter: boolean;
    offers: boolean;

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


    constructor(data: Partial<GuestDetails>) {

        this.title = data.title ?? "Mr";
        this.name = data.name ?? "";
        this.email = data.email ?? "";
        this.password = data.password ?? "";

        this.day = data.day ?? "";
        this.month = data.month ?? "";
        this.year = data.year ?? "";

        this.newsletter = data.newsletter ?? false;
        this.offers = data.offers ?? false;

        this.firstName = data.firstName ?? "";
        this.lastName = data.lastName ?? "";
        this.company = data.company ?? "";

        this.address = data.address ?? "";
        this.address2 = data.address2 ?? "";

        this.country = data.country ?? "";
        this.state = data.state ?? "";
        this.city = data.city ?? "";
        this.zipcode = data.zipcode ?? "";
        this.mobile = data.mobile ?? "";
    }
}