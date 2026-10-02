export type PlatformCurrency = {
  code: string;
  name: string;
  rate: number;
  symbol: string;
  type: "African" | "Global";
};

export const allPlatformCurrencies: PlatformCurrency[] = [
  { code: "KES", name: "Kenyan Shilling", rate: 1, symbol: "KES ", type: "African" },
  { code: "NGN", name: "Nigerian Naira", rate: 11.5, symbol: "₦", type: "African" },
  { code: "ZAR", name: "South African Rand", rate: 0.14, symbol: "R ", type: "African" },
  { code: "GHS", name: "Ghanaian Cedi", rate: 0.11, symbol: "GH₵ ", type: "African" },
  { code: "UGX", name: "Ugandan Shilling", rate: 29.5, symbol: "UGX ", type: "African" },
  { code: "TZS", name: "Tanzanian Shilling", rate: 20.2, symbol: "TZS ", type: "African" },
  { code: "RWF", name: "Rwandan Franc", rate: 10.0, symbol: "FRw ", type: "African" },
  { code: "XOF", name: "West African CFA", rate: 4.65, symbol: "CFA ", type: "African" },
  { code: "XAF", name: "Central African CFA", rate: 4.65, symbol: "FCFA ", type: "African" },
  { code: "EGP", name: "Egyptian Pound", rate: 0.37, symbol: "E£ ", type: "African" },
  { code: "MAD", name: "Moroccan Dirham", rate: 0.078, symbol: "MAD ", type: "African" },
  { code: "ETB", name: "Ethiopian Birr", rate: 0.44, symbol: "Br ", type: "African" },
  { code: "ZMW", name: "Zambian Kwacha", rate: 0.20, symbol: "ZK ", type: "African" },
  { code: "BWP", name: "Botswana Pula", rate: 0.11, symbol: "P ", type: "African" },
  { code: "USD", name: "US Dollar", rate: 0.0077, symbol: "$", type: "Global" },
  { code: "EUR", name: "Euro", rate: 0.0071, symbol: "€", type: "Global" },
  { code: "GBP", name: "British Pound", rate: 0.0061, symbol: "£", type: "Global" },
  { code: "CAD", name: "Canadian Dollar", rate: 0.010, symbol: "C$", type: "Global" },
  { code: "AUD", name: "Australian Dollar", rate: 0.012, symbol: "A$", type: "Global" },
  { code: "CHF", name: "Swiss Franc", rate: 0.0068, symbol: "CHF ", type: "Global" },
  { code: "JPY", name: "Japanese Yen", rate: 1.15, symbol: "¥", type: "Global" },
  { code: "CNY", name: "Chinese Yuan", rate: 0.055, symbol: "¥", type: "Global" },
  { code: "INR", name: "Indian Rupee", rate: 0.64, symbol: "₹", type: "Global" },
  { code: "AED", name: "Emirati Dirham", rate: 0.028, symbol: "د.إ ", type: "Global" },
];