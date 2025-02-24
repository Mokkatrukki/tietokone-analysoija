import { ToriListing } from '../types/ToriListing';

export const testListing: ToriListing = {
  id: "2313123",
  url: "https://www.tori.fi/recommerce/forsale/item/12313123",
  title: "Test Laptop",
  categories: {
    full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Kannettavat tietokoneet",
    levels: [
      "Tori",
      "Elektroniikka ja kodinkoneet",
      "Tietotekniikka",
      "Kannettavat tietokoneet"
    ],
    primary: "Elektroniikka ja kodinkoneet",
    secondary: "Tietotekniikka",
    tertiary: "Kannettavat tietokoneet"
  },
  price: 250,
  type: "myydään",
  description: "Test description",
  additionalInfo: {},
  address: "33720, Tampere, Hervanta, Pirkanmaa",
  sellerType: "yksityinen",
  errors: []
};
