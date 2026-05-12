export const filterOptions = {
  budgetRanges: [
    { label: "Under ₹30,000", min: 0, max: 30000 },
    { label: "₹30,000 – ₹60,000", min: 30000, max: 60000 },
    { label: "₹60,000 – ₹1,00,000", min: 60000, max: 100000 },
    { label: "Above ₹1,00,000", min: 100000, max: Infinity },
  ],
  durations: [
    { label: "3–5 Days", min: 3, max: 5 },
    { label: "6–8 Days", min: 6, max: 8 },
    { label: "9–12 Days", min: 9, max: 12 },
    { label: "13+ Days", min: 13, max: 99 },
  ],
  themes: ["Honeymoon", "Family", "Adventure", "Luxury", "Beach", "Culture", "Shopping"],
  ratings: [4, 3, 2],
  sortOptions: [
    "Popularity",
    "Price: Low to High",
    "Price: High to Low",
    "Rating",
    "Duration",
  ],
};
