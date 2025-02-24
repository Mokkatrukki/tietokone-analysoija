import { ToriListing } from '../types/ToriListing';

export const desktopListing: ToriListing = {
  id: "desktop-example",
  url: "https://www.tori.fi/example/desktop",
  title: "Example Desktop PC",
  categories: {
    full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Pöytäkoneet",
    levels: [
      "Tori",
      "Elektroniikka ja kodinkoneet",
      "Tietotekniikka",
      "Pöytäkoneet"
    ],
    primary: "Elektroniikka ja kodinkoneet",
    secondary: "Tietotekniikka",
    tertiary: "Pöytäkoneet"
  },
  price: 0,
  type: "myydään",
  description: "",
  additionalInfo: {},
  address: "",
  sellerType: "yksityinen",
  errors: []
};

export const laptopListing: ToriListing = {
  id: "laptop-example",
  url: "https://www.tori.fi/example/laptop",
  title: "Example Laptop",
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
  price: 0,
  type: "myydään",
  description: "",
  additionalInfo: {},
  address: "",
  sellerType: "yksityinen",
  errors: []
};

export const otherListing: ToriListing = {
  id: "peripheral-example",
  url: "https://www.tori.fi/example/peripheral",
  title: "Example Computer Peripheral",
  categories: {
    full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Oheislaitteet",
    levels: [
      "Tori",
      "Elektroniikka ja kodinkoneet",
      "Tietotekniikka",
      "Oheislaitteet"
    ],
    primary: "Elektroniikka ja kodinkoneet",
    secondary: "Tietotekniikka",
    tertiary: "Oheislaitteet"
  },
  price: 0,
  type: "myydään",
  description: "",
  additionalInfo: {},
  address: "",
  sellerType: "yksityinen",
  errors: []
};

export const nonComputerListing: ToriListing = {
  id: "piano-example",
  url: "https://www.tori.fi/example/piano",
  title: "Example Piano",
  categories: {
    full: "Tori / Viihde ja harrastukset / Soittimet / Pianot ja flyygelit",
    levels: [
      "Tori",
      "Viihde ja harrastukset",
      "Soittimet",
      "Pianot ja flyygelit"
    ],
    primary: "Viihde ja harrastukset",
    secondary: "Soittimet",
    tertiary: "Pianot ja flyygelit"
  },
  price: 0,
  type: "myydään",
  description: "",
  additionalInfo: {},
  address: "",
  sellerType: "yksityinen",
  errors: []
};
