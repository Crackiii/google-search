import { getPrismaClient } from "../client";
import {countries as duck_countries} from "../jobs/duckduckgo";
import {daily_countries} from "../jobs/google-trends-daily";
import {realtime_countries} from "../jobs/google-trends-realtime";
import {all_countries} from "../jobs/youtube";

const prisma = getPrismaClient();
const totalCountries = [
  {
      country : "Afghanistan",
      country_code: "AF"
  },
  {
      country : "Albania",
      country_code: "AL"
  },
  {
      country : "Algeria",
      country_code: "DZ"
  },
  {
      country : "American Samoa",
      country_code: "AS"
  },
  {
      country : "Andorra",
      country_code: "AD"
  },
  {
      country : "Angola",
      country_code: "AO"
  },
  {
      country : "Anguilla",
      country_code: "AI"
  },
  {
      country : "Antarctica",
      country_code: "AQ"
  },
  {
      country : "Antigua and Barbuda",
      country_code: "AG"
  },
  {
      country : "Argentina",
      country_code: "AR"
  },
  {
      country : "Armenia",
      country_code: "AM"
  },
  {
      country : "Aruba",
      country_code: "AW"
  },
  {
      country : "Australia",
      country_code: "AU"
  },
  {
      country : "Austria",
      country_code: "AT"
  },
  {
      country : "Azerbaijan",
      country_code: "AZ"
  },
  {
      country : "Bahamas (the)",
      country_code: "BS"
  },
  {
      country : "Bahrain",
      country_code: "BH"
  },
  {
      country : "Bangladesh",
      country_code: "BD"
  },
  {
      country : "Barbados",
      country_code: "BB"
  },
  {
      country : "Belarus",
      country_code: "BY"
  },
  {
      country : "Belgium",
      country_code: "BE"
  },
  {
      country : "Belize",
      country_code: "BZ"
  },
  {
      country : "Benin",
      country_code: "BJ"
  },
  {
      country : "Bermuda",
      country_code: "BM"
  },
  {
      country : "Bhutan",
      country_code: "BT"
  },
  {
      country : "Bolivia (Plurinational State of)",
      country_code: "BO"
  },
  {
      country : "Bonaire, Sint Eustatius and Saba",
      country_code: "BQ"
  },
  {
      country : "Bosnia and Herzegovina",
      country_code: "BA"
  },
  {
      country : "Botswana",
      country_code: "BW"
  },
  {
      country : "Bouvet Island",
      country_code: "BV"
  },
  {
      country : "Brazil",
      country_code: "BR"
  },
  {
      country : "British Indian Ocean Territory (the)",
      country_code: "IO"
  },
  {
      country : "Brunei Darussalam",
      country_code: "BN"
  },
  {
      country : "Bulgaria",
      country_code: "BG"
  },
  {
      country : "Burkina Faso",
      country_code: "BF"
  },
  {
      country : "Burundi",
      country_code: "BI"
  },
  {
      country : "Cabo Verde",
      country_code: "CV"
  },
  {
      country : "Cambodia",
      country_code: "KH"
  },
  {
      country : "Cameroon",
      country_code: "CM"
  },
  {
      country : "Canada",
      country_code: "CA"
  },
  {
      country : "Cayman Islands (the)",
      country_code: "KY"
  },
  {
      country : "Central African Republic (the)",
      country_code: "CF"
  },
  {
      country : "Chad",
      country_code: "TD"
  },
  {
      country : "Chile",
      country_code: "CL"
  },
  {
      country : "China",
      country_code: "CN"
  },
  {
      country : "Christmas Island",
      country_code: "CX"
  },
  {
      country : "Cocos (Keeling) Islands (the)",
      country_code: "CC"
  },
  {
      country : "Colombia",
      country_code: "CO"
  },
  {
      country : "Comoros (the)",
      country_code: "KM"
  },
  {
      country : "Congo (the Democratic Republic of the)",
      country_code: "CD"
  },
  {
      country : "Congo (the)",
      country_code: "CG"
  },
  {
      country : "Cook Islands (the)",
      country_code: "CK"
  },
  {
      country : "Costa Rica",
      country_code: "CR"
  },
  {
      country : "Croatia",
      country_code: "HR"
  },
  {
      country : "Cuba",
      country_code: "CU"
  },
  {
      country : "Curaçao",
      country_code: "CW"
  },
  {
      country : "Cyprus",
      country_code: "CY"
  },
  {
      country : "Czechia",
      country_code: "CZ"
  },
  {
      country : "Côte d'Ivoire",
      country_code: "CI"
  },
  {
      country : "Denmark",
      country_code: "DK"
  },
  {
      country : "Djibouti",
      country_code: "DJ"
  },
  {
      country : "Dominica",
      country_code: "DM"
  },
  {
      country : "Dominican Republic (the)",
      country_code: "DO"
  },
  {
      country : "Ecuador",
      country_code: "EC"
  },
  {
      country : "Egypt",
      country_code: "EG"
  },
  {
      country : "El Salvador",
      country_code: "SV"
  },
  {
      country : "Equatorial Guinea",
      country_code: "GQ"
  },
  {
      country : "Eritrea",
      country_code: "ER"
  },
  {
      country : "Estonia",
      country_code: "EE"
  },
  {
      country : "Eswatini",
      country_code: "SZ"
  },
  {
      country : "Ethiopia",
      country_code: "ET"
  },
  {
      country : "Falkland Islands (the) [Malvinas]",
      country_code: "FK"
  },
  {
      country : "Faroe Islands (the)",
      country_code: "FO"
  },
  {
      country : "Fiji",
      country_code: "FJ"
  },
  {
      country : "Finland",
      country_code: "FI"
  },
  {
      country : "France",
      country_code: "FR"
  },
  {
      country : "French Guiana",
      country_code: "GF"
  },
  {
      country : "French Polynesia",
      country_code: "PF"
  },
  {
      country : "French Southern Territories (the)",
      country_code: "TF"
  },
  {
      country : "Gabon",
      country_code: "GA"
  },
  {
      country : "Gambia (the)",
      country_code: "GM"
  },
  {
      country : "Georgia",
      country_code: "GE"
  },
  {
      country : "Germany",
      country_code: "DE"
  },
  {
      country : "Ghana",
      country_code: "GH"
  },
  {
      country : "Gibraltar",
      country_code: "GI"
  },
  {
      country : "Greece",
      country_code: "GR"
  },
  {
      country : "Greenland",
      country_code: "GL"
  },
  {
      country : "Grenada",
      country_code: "GD"
  },
  {
      country : "Guadeloupe",
      country_code: "GP"
  },
  {
      country : "Guam",
      country_code: "GU"
  },
  {
      country : "Guatemala",
      country_code: "GT"
  },
  {
      country : "Guernsey",
      country_code: "GG"
  },
  {
      country : "Guinea",
      country_code: "GN"
  },
  {
      country : "Guinea-Bissau",
      country_code: "GW"
  },
  {
      country : "Guyana",
      country_code: "GY"
  },
  {
      country : "Haiti",
      country_code: "HT"
  },
  {
      country : "Heard Island and McDonald Islands",
      country_code: "HM"
  },
  {
      country : "Holy See (the)",
      country_code: "VA"
  },
  {
      country : "Honduras",
      country_code: "HN"
  },
  {
      country : "Hong Kong",
      country_code: "HK"
  },
  {
      country : "Hungary",
      country_code: "HU"
  },
  {
      country : "Iceland",
      country_code: "IS"
  },
  {
      country : "India",
      country_code: "IN"
  },
  {
      country : "Indonesia",
      country_code: "ID"
  },
  {
      country : "Iran (Islamic Republic of)",
      country_code: "IR"
  },
  {
      country : "Iraq",
      country_code: "IQ"
  },
  {
      country : "Ireland",
      country_code: "IE"
  },
  {
      country : "Isle of Man",
      country_code: "IM"
  },
  {
      country : "Israel",
      country_code: "IL"
  },
  {
      country : "Italy",
      country_code: "IT"
  },
  {
      country : "Jamaica",
      country_code: "JM"
  },
  {
      country : "Japan",
      country_code: "JP"
  },
  {
      country : "Jersey",
      country_code: "JE"
  },
  {
      country : "Jordan",
      country_code: "JO"
  },
  {
      country : "Kazakhstan",
      country_code: "KZ"
  },
  {
      country : "Kenya",
      country_code: "KE"
  },
  {
      country : "Kiribati",
      country_code: "KI"
  },
  {
      country : "Korea (the Democratic People's Republic of)",
      country_code: "KP"
  },
  {
      country : "Korea (the Republic of)",
      country_code: "KR"
  },
  {
      country : "Kuwait",
      country_code: "KW"
  },
  {
      country : "Kyrgyzstan",
      country_code: "KG"
  },
  {
      country : "Lao People's Democratic Republic (the)",
      country_code: "LA"
  },
  {
      country : "Latvia",
      country_code: "LV"
  },
  {
      country : "Lebanon",
      country_code: "LB"
  },
  {
      country : "Lesotho",
      country_code: "LS"
  },
  {
      country : "Liberia",
      country_code: "LR"
  },
  {
      country : "Libya",
      country_code: "LY"
  },
  {
      country : "Liechtenstein",
      country_code: "LI"
  },
  {
      country : "Lithuania",
      country_code: "LT"
  },
  {
      country : "Luxembourg",
      country_code: "LU"
  },
  {
      country : "Macao",
      country_code: "MO"
  },
  {
      country : "Madagascar",
      country_code: "MG"
  },
  {
      country : "Malawi",
      country_code: "MW"
  },
  {
      country : "Malaysia",
      country_code: "MY"
  },
  {
      country : "Maldives",
      country_code: "MV"
  },
  {
      country : "Mali",
      country_code: "ML"
  },
  {
      country : "Malta",
      country_code: "MT"
  },
  {
      country : "Marshall Islands (the)",
      country_code: "MH"
  },
  {
      country : "Martinique",
      country_code: "MQ"
  },
  {
      country : "Mauritania",
      country_code: "MR"
  },
  {
      country : "Mauritius",
      country_code: "MU"
  },
  {
      country : "Mayotte",
      country_code: "YT"
  },
  {
      country : "Mexico",
      country_code: "MX"
  },
  {
      country : "Micronesia (Federated States of)",
      country_code: "FM"
  },
  {
      country : "Moldova (the Republic of)",
      country_code: "MD"
  },
  {
      country : "Monaco",
      country_code: "MC"
  },
  {
      country : "Mongolia",
      country_code: "MN"
  },
  {
      country : "Montenegro",
      country_code: "ME"
  },
  {
      country : "Montserrat",
      country_code: "MS"
  },
  {
      country : "Morocco",
      country_code: "MA"
  },
  {
      country : "Mozambique",
      country_code: "MZ"
  },
  {
      country : "Myanmar",
      country_code: "MM"
  },
  {
      country : "Namibia",
      country_code: "NA"
  },
  {
      country : "Nauru",
      country_code: "NR"
  },
  {
      country : "Nepal",
      country_code: "NP"
  },
  {
      country : "Netherlands (the)",
      country_code: "NL"
  },
  {
      country : "New Caledonia",
      country_code: "NC"
  },
  {
      country : "New Zealand",
      country_code: "NZ"
  },
  {
      country : "Nicaragua",
      country_code: "NI"
  },
  {
      country : "Niger (the)",
      country_code: "NE"
  },
  {
      country : "Nigeria",
      country_code: "NG"
  },
  {
      country : "Niue",
      country_code: "NU"
  },
  {
      country : "Norfolk Island",
      country_code: "NF"
  },
  {
      country : "Northern Mariana Islands (the)",
      country_code: "MP"
  },
  {
      country : "Norway",
      country_code: "NO"
  },
  {
      country : "Oman",
      country_code: "OM"
  },
  {
      country : "Pakistan",
      country_code: "PK"
  },
  {
      country : "Palau",
      country_code: "PW"
  },
  {
      country : "Palestine, State of",
      country_code: "PS"
  },
  {
      country : "Panama",
      country_code: "PA"
  },
  {
      country : "Papua New Guinea",
      country_code: "PG"
  },
  {
      country : "Paraguay",
      country_code: "PY"
  },
  {
      country : "Peru",
      country_code: "PE"
  },
  {
      country : "Philippines (the)",
      country_code: "PH"
  },
  {
      country : "Pitcairn",
      country_code: "PN"
  },
  {
      country : "Poland",
      country_code: "PL"
  },
  {
      country : "Portugal",
      country_code: "PT"
  },
  {
      country : "Puerto Rico",
      country_code: "PR"
  },
  {
      country : "Qatar",
      country_code: "QA"
  },
  {
      country : "Republic of North Macedonia",
      country_code: "MK"
  },
  {
      country : "Romania",
      country_code: "RO"
  },
  {
      country : "Russian Federation (the)",
      country_code: "RU"
  },
  {
      country : "Rwanda",
      country_code: "RW"
  },
  {
      country : "Réunion",
      country_code: "RE"
  },
  {
      country : "Saint Barthélemy",
      country_code: "BL"
  },
  {
      country : "Saint Helena, Ascension and Tristan da Cunha",
      country_code: "SH"
  },
  {
      country : "Saint Kitts and Nevis",
      country_code: "KN"
  },
  {
      country : "Saint Lucia",
      country_code: "LC"
  },
  {
      country : "Saint Martin (French part)",
      country_code: "MF"
  },
  {
      country : "Saint Pierre and Miquelon",
      country_code: "PM"
  },
  {
      country : "Saint Vincent and the Grenadines",
      country_code: "VC"
  },
  {
      country : "Samoa",
      country_code: "WS"
  },
  {
      country : "San Marino",
      country_code: "SM"
  },
  {
      country : "Sao Tome and Principe",
      country_code: "ST"
  },
  {
      country : "Saudi Arabia",
      country_code: "SA"
  },
  {
      country : "Senegal",
      country_code: "SN"
  },
  {
      country : "Serbia",
      country_code: "RS"
  },
  {
      country : "Seychelles",
      country_code: "SC"
  },
  {
      country : "Sierra Leone",
      country_code: "SL"
  },
  {
      country : "Singapore",
      country_code: "SG"
  },
  {
      country : "Sint Maarten (Dutch part)",
      country_code: "SX"
  },
  {
      country : "Slovakia",
      country_code: "SK"
  },
  {
      country : "Slovenia",
      country_code: "SI"
  },
  {
      country : "Solomon Islands",
      country_code: "SB"
  },
  {
      country : "Somalia",
      country_code: "SO"
  },
  {
      country : "South Africa",
      country_code: "ZA"
  },
  {
      country : "South Georgia and the South Sandwich Islands",
      country_code: "GS"
  },
  {
      country : "South Sudan",
      country_code: "SS"
  },
  {
      country : "Spain",
      country_code: "ES"
  },
  {
      country : "Sri Lanka",
      country_code: "LK"
  },
  {
      country : "Sudan (the)",
      country_code: "SD"
  },
  {
      country : "Suriname",
      country_code: "SR"
  },
  {
      country : "Svalbard and Jan Mayen",
      country_code: "SJ"
  },
  {
      country : "Sweden",
      country_code: "SE"
  },
  {
      country : "Switzerland",
      country_code: "CH"
  },
  {
      country : "Syrian Arab Republic",
      country_code: "SY"
  },
  {
      country : "Taiwan (Province of China)",
      country_code: "TW"
  },
  {
      country : "Tajikistan",
      country_code: "TJ"
  },
  {
      country : "Tanzania, United Republic of",
      country_code: "TZ"
  },
  {
      country : "Thailand",
      country_code: "TH"
  },
  {
      country : "Timor-Leste",
      country_code: "TL"
  },
  {
      country : "Togo",
      country_code: "TG"
  },
  {
      country : "Tokelau",
      country_code: "TK"
  },
  {
      country : "Tonga",
      country_code: "TO"
  },
  {
      country : "Trinidad and Tobago",
      country_code: "TT"
  },
  {
      country : "Tunisia",
      country_code: "TN"
  },
  {
      country : "Turkey",
      country_code: "TR"
  },
  {
      country : "Turkmenistan",
      country_code: "TM"
  },
  {
      country : "Turks and Caicos Islands (the)",
      country_code: "TC"
  },
  {
      country : "Tuvalu",
      country_code: "TV"
  },
  {
      country : "Uganda",
      country_code: "UG"
  },
  {
      country : "Ukraine",
      country_code: "UA"
  },
  {
      country : "United Arab Emirates (the)",
      country_code: "AE"
  },
  {
      country : "United Kingdom of Great Britain and Northern Ireland (the)",
      country_code: "GB"
  },
  {
      country : "United States Minor Outlying Islands (the)",
      country_code: "UM"
  },
  {
      country : "United States of America (the)",
      country_code: "US"
  },
  {
      country : "Uruguay",
      country_code: "UY"
  },
  {
      country : "Uzbekistan",
      country_code: "UZ"
  },
  {
      country : "Vanuatu",
      country_code: "VU"
  },
  {
      country : "Venezuela (Bolivarian Republic of)",
      country_code: "VE"
  },
  {
      country : "Viet Nam",
      country_code: "VN"
  },
  {
      country : "Virgin Islands (British)",
      country_code: "VG"
  },
  {
      country : "Virgin Islands (U.S.)",
      country_code: "VI"
  },
  {
      country : "Wallis and Futuna",
      country_code: "WF"
  },
  {
      country : "Western Sahara",
      country_code: "EH"
  },
  {
      country : "Yemen",
      country_code: "YE"
  },
  {
      country : "Zambia",
      country_code: "ZM"
  },
  {
      country : "Zimbabwe",
      country_code: "ZW"
  },
  {
      country : "Åland Islands",
      country_code: "AX"
  }
];

const totalCountriesWithDuck = totalCountries.map((country => {
  const isMatch = duck_countries.find(duckCountry => {
    return country.country_code === duckCountry.iso;
  });

  if(isMatch) {
    return {
      ...country,
      duckduckgo: "true"
    };
  } else {
    return {
      ...country,
      duckduckgo: "false"
    };
  }
}));

const totalCountriesWithGoogleDaily = totalCountriesWithDuck.map((country => {
  const isMatch = daily_countries.find(googleCountry => {
    return country.country_code === googleCountry.split("-")[1].trim();
  });

  if(isMatch) {
    return {
      ...country,
      google_daily: "true"
    };
  } else {
    return {
      ...country,
      google_daily: "false"
    };
  }

}));

const totalCountriesWithGoogleRealtime = totalCountriesWithGoogleDaily.map((country => {
  const isMatch = realtime_countries.find(googleCountry => {
    return country.country_code === googleCountry.split("-")[1].trim();
  });

  if(isMatch) {
    return {
      ...country,
      google_realtime: "true"
    };
  } else {
    return {
      ...country,
      google_realtime: "false"
    };
  }
}));

const totalCountriesWithYoutube = totalCountriesWithGoogleRealtime.map((country => {
  const isMatch = all_countries.find(youtubeCountry => {
    return country.country_code === youtubeCountry.split("-")[1].trim();
  });

  if(isMatch) {
    return {
      ...country,
      youtube: "true"
    };
  } else {
    return {
      ...country,
      youtube: "false"
    };
  }
}));



export const putCountries = async () => {
  try {
    await prisma.countries.createMany({
      data: [
        ...totalCountriesWithYoutube
      ]
    });
  } catch(error) {
    console.log(error);
  }
};
