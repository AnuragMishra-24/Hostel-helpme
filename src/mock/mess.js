import ApiError from '@/services/ApiError';

const day = (breakfast, lunch, snacks, dinner) => ({ breakfast, lunch, snacks, dinner });

const MENU = {
  monday: day(['Poha', 'Boiled eggs', 'Tea'], ['Rice', 'Dal tadka', 'Mixed vegetable', 'Roti', 'Salad'], ['Samosa', 'Tea'], ['Roti', 'Paneer butter masala', 'Jeera rice', 'Kheer']),
  tuesday: day(['Aloo paratha', 'Curd', 'Tea'], ['Rice', 'Rajma', 'Bhindi fry', 'Roti'], ['Biscuits', 'Tea'], ['Roti', 'Egg curry / Soya chaap', 'Rice', 'Fruit']),
  wednesday: day(['Idli', 'Sambar', 'Chutney'], ['Rice', 'Sambar', 'Cabbage poriyal', 'Roti', 'Curd'], ['Sprouts chaat', 'Tea'], ['Roti', 'Dal makhani', 'Veg pulao', 'Gulab jamun']),
  thursday: day(['Upma', 'Banana', 'Tea'], ['Rice', 'Chole', 'Aloo gobi', 'Roti'], ['Pakora', 'Tea'], ['Roti', 'Mix veg', 'Dal fry', 'Rice']),
  friday: day(['Bread omelette', 'Tea'], ['Rice', 'Kadhi', 'Aloo jeera', 'Roti'], ['Maggi', 'Tea'], ['Veg biryani', 'Raita', 'Papad', 'Ice cream']),
  saturday: day(['Puri bhaji', 'Tea'], ['Rice', 'Dal palak', 'Paneer bhurji', 'Roti'], ['Bread pakora', 'Tea'], ['Roti', 'Chicken curry / Paneer masala', 'Rice', 'Custard']),
  sunday: day(['Chole bhature', 'Lassi'], ['Special thali', 'Rice', 'Dal', 'Two vegetables', 'Sweet'], ['Sandwich', 'Tea'], ['Roti', 'Shahi paneer', 'Dal', 'Rice', 'Halwa']),
};

export function getMenu({ simulateError } = {}) {
  if (simulateError) throw new ApiError('Unable to load the menu.', { code: 'SERVER_ERROR', status: 500 });
  return {
    effectiveFrom: '2026-11-02',
    timings: {
      breakfast: '7:30 – 9:00 AM',
      lunch: '12:30 – 2:00 PM',
      snacks: '5:00 – 6:00 PM',
      dinner: '8:00 – 9:30 PM',
    },
    notes: 'Sunday breakfast is served from 8:00 to 9:30 AM.',
    days: Object.entries(MENU).map(([name, meals]) => ({ day: name, meals })),
  };
}
