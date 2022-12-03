import { Dictionary } from "../../crawler/types";

export const fixedCityIDs: Dictionary = {
  Berlin: '3000035821',
  Paris: '3000035827',
  Dublin: '3000035826',
  Amsterdam: '3000035824',
  London: '3000035825',
} as const;

export const fixedCityCodes: Dictionary = {
  Berlin: 'BER',
  Paris: 'PAR',
  Dublin: 'DUB',
  Amsterdam: 'AMS',
  London: 'LON',
  'São Paulo': 'SAO',
} as const;

