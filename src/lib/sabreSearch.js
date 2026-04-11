// import { getSabreToken } from "./sabreAuth";

// export async function searchFlightsFromSabre(body) {
//   const token = await getSabreToken();
// console.log(token)
//   const originDestinations = [
//     {
//       DepartureDateTime: body.departureDate,
//       OriginLocation: { LocationCode: body.origin },
//       DestinationLocation: { LocationCode: body.destination },
//     },
//   ];

//   if (body.tripType === "round" && body.returnDate) {
//     originDestinations.push({
//       DepartureDateTime: body.returnDate,
//       OriginLocation: { LocationCode: body.destination },
//       DestinationLocation: { LocationCode: body.origin },
//     });
//   }

//   const res = await fetch(`${process.env.SABRE_BASE_URL}/v5/offers/shop`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       OriginDestinationInformation: originDestinations,
//       TravelerInfoSummary: {
//         AirTravelerAvail: [
//           {
//             PassengerTypeQuantity: [
//               { Code: "ADT", Quantity: body.passengers.ADT || 1 },
//               { Code: "CHD", Quantity: body.passengers.CHD || 0 },
//               { Code: "INF", Quantity: body.passengers.INF || 0 },
//             ],
//           },
//         ],
//       },
//       TravelPreferences: {
//         CabinPref: [{ Cabin: body.cabinClass }],
//       },
//     }),
//   });

//   return await res.json();
// }


// import { getSabreToken } from "./sabreAuth";

// export async function searchFlightsFromSabre(body) {
//   const token = await getSabreToken();

//   // Build origin-destination legs
//   const originDestinations = [
//     {
//       RPH: "1",
//       DepartureDateTime: `${body.departureDate}T00:00:00`,
//       OriginLocation: { LocationCode: body.origin },
//       DestinationLocation: { LocationCode: body.destination },
//     },
//   ];

//   if (body.tripType === "round" && body.returnDate) {
//     originDestinations.push({
//       RPH: "2",
//       DepartureDateTime: `${body.returnDate}T00:00:00`,
//       OriginLocation: { LocationCode: body.destination },
//       DestinationLocation: { LocationCode: body.origin },
//     });
//   }

//   // Only include passenger types with quantity > 0
//   const passengerTypes = [];
//   if (body.passengers.ADT > 0)
//     passengerTypes.push({ Code: "ADT", Quantity: body.passengers.ADT });
//   if (body.passengers.CHD > 0)
//     passengerTypes.push({ Code: "CHD", Quantity: body.passengers.CHD });
//   if (body.passengers.INF > 0)
//     passengerTypes.push({ Code: "INF", Quantity: body.passengers.INF });

//   const requestBody = {
//     OTA_AirLowFareSearchRQ: {
//       Version: "5",
//       POS: {
//         Source: [
//           {
//             PseudoCityCode: process.env.SABRE_PCC,
//             RequestorID: {
//               Type: "1",
//               ID: "1",
//               CompanyName: { Code: "TN" },
//             },
//           },
//         ],
//       },
//       OriginDestinationInformation: originDestinations,
//       TravelerInfoSummary: {
//         SeatsRequested: [body.passengers.ADT || 1],
//         AirTravelerAvail: [
//           {
//             PassengerTypeQuantity: passengerTypes,
//           },
//         ],
//       },
//       TravelPreferences: {
//         CabinPref: [
//           {
//             Cabin: body.cabinClass,
//             PreferLevel: "Preferred",
//           },
//         ],
//         VendorPref: [],
//       },
//       TPA_Extensions: {
//         IntelliSellTransaction: {
//           RequestType: { Name: "200ITINS" },
//         },
//       },
//     },
//   };

//   console.log("Sabre request:", JSON.stringify(requestBody, null, 2));

//   const res = await fetch(
//     `${process.env.SABRE_BASE_URL}/v3/offers/shop`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     }
//   );

//   const data = await res.json();
//   console.log("Sabre response:", JSON.stringify(data, null, 2));
//   return data;
// }



import { getSabreToken } from "./sabreAuth";

const cabinMap = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "PremiumEconomy",
  BUSINESS: "Business",
  PREMIUM_BUSINESS: "PremiumBusiness",
  FIRST: "First",
  PREMIUM_FIRST: "PremiumFirst",
};

export async function searchFlightsFromSabre(body) {
  const token = await getSabreToken();

  const cabin = cabinMap[body.cabinClass] ?? "Economy";

  // Build origin-destination legs
  const originDestinations = [
    {
      RPH: "1",
      DepartureDateTime: `${body.departureDate}T00:00:00`,
      OriginLocation: { LocationCode: body.origin },
      DestinationLocation: { LocationCode: body.destination },
    },
  ];

  if (body.tripType === "round" && body.returnDate) {
    originDestinations.push({
      RPH: "2",
      DepartureDateTime: `${body.returnDate}T00:00:00`,
      OriginLocation: { LocationCode: body.destination },
      DestinationLocation: { LocationCode: body.origin },
    });
  }

  // Only include passenger types with quantity > 0
  const passengerTypes = [];
  if (body.passengers.ADT > 0)
    passengerTypes.push({ Code: "ADT", Quantity: body.passengers.ADT });
  if (body.passengers.CHD > 0)
    passengerTypes.push({ Code: "CHD", Quantity: body.passengers.CHD });
  if (body.passengers.INF > 0)
    passengerTypes.push({ Code: "INF", Quantity: body.passengers.INF });

  const requestBody = {
    OTA_AirLowFareSearchRQ: {
      Version: "5",
      POS: {
        Source: [
          {
            PseudoCityCode: process.env.SABRE_PCC,
            RequestorID: {
              Type: "1",
              ID: "1",
              CompanyName: { Code: "TN" },
            },
          },
        ],
      },
      OriginDestinationInformation: originDestinations,
      TravelerInfoSummary: {
        SeatsRequested: [body.passengers.ADT || 1],
        AirTravelerAvail: [
          {
            PassengerTypeQuantity: passengerTypes,
          },
        ],
      },
      TravelPreferences: {
        CabinPref: [
          {
            Cabin: cabin,
            PreferLevel: "Preferred",
          },
        ],
        VendorPref: [],
      },
      TPA_Extensions: {
        IntelliSellTransaction: {
          RequestType: { Name: "200ITINS" },
        },
      },
    },
  };

  console.log("Sabre request:", JSON.stringify(requestBody, null, 2));

  const res = await fetch(`${process.env.SABRE_BASE_URL}/v3/offers/shop`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json();
  console.log("Sabre response:", JSON.stringify(data, null, 2));
  return data;
}