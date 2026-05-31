// Central airline data used across the app:
// - /bookings/flights (logo + name display)
// - AirlineAutocomplete (logo in dropdown)
// - /api/airlines (search)

export interface AirlineData {
  name: string
  domain: string // used for https://logo.clearbit.com/{domain}
}

export const AIRLINE_DATA: Record<string, AirlineData> = {
  PK: { name: "Pakistan International Airlines", domain: "piac.com.pk" },
  EK: { name: "Emirates",                        domain: "emirates.com" },
  BA: { name: "British Airways",                 domain: "britishairways.com" },
  QR: { name: "Qatar Airways",                   domain: "qatarairways.com" },
  TK: { name: "Turkish Airlines",                domain: "turkishairlines.com" },
  U2: { name: "easyJet",                         domain: "easyjet.com" },
  FR: { name: "Ryanair",                         domain: "ryanair.com" },
  VS: { name: "Virgin Atlantic",                 domain: "virginatlantic.com" },
  AF: { name: "Air France",                      domain: "airfrance.com" },
  KL: { name: "KLM",                             domain: "klm.com" },
  SQ: { name: "Singapore Airlines",              domain: "singaporeair.com" },
  EY: { name: "Etihad Airways",                  domain: "etihad.com" },
  FZ: { name: "flydubai",                        domain: "flydubai.com" },
  G9: { name: "Air Arabia",                      domain: "airarabia.com" },
  LH: { name: "Lufthansa",                       domain: "lufthansa.com" },
  AP: { name: "Airblue",                         domain: "airblue.com" },
  PA: { name: "Serene Air",                      domain: "sereneair.com" },
  GF: { name: "Gulf Air",                        domain: "gulfair.com" },
  LX: { name: "Swiss International Air Lines",   domain: "swiss.com" },
  MS: { name: "EgyptAir",                        domain: "egyptair.com" },
  SV: { name: "Saudia",                          domain: "saudia.com" },
  WY: { name: "Oman Air",                        domain: "omanair.com" },
  ME: { name: "Middle East Airlines",            domain: "mea.com.lb" },
  AI: { name: "Air India",                       domain: "airindia.com" },
  FY: { name: "Firefly",                         domain: "fireflyz.com.my" },
  AY: { name: "Finnair",                         domain: "finnair.com" },
  IB: { name: "Iberia",                          domain: "iberia.com" },
  AZ: { name: "ITA Airways",                     domain: "itaairways.com" },
  SK: { name: "SAS",                             domain: "flysas.com" },
  OS: { name: "Austrian Airlines",               domain: "austrian.com" },
  LO: { name: "LOT Polish Airlines",             domain: "lot.com" },
  OK: { name: "Czech Airlines",                  domain: "csa.cz" },
  RO: { name: "TAROM",                           domain: "tarom.ro" },
  VY: { name: "Vueling",                         domain: "vueling.com" },
  W6: { name: "Wizz Air",                        domain: "wizzair.com" },
}

/** Returns the display name for an IATA code, falling back to the code itself */
export function getAirlineName(iata: string): string {
  return AIRLINE_DATA[iata]?.name ?? iata
}

/** Returns the Clearbit logo URL for an IATA code, or null if unknown */
export function getAirlineLogoUrl(iata: string): string | null {
  const domain = AIRLINE_DATA[iata]?.domain
  return domain ? `https://logo.clearbit.com/${domain}` : null
}