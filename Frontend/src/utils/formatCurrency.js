import { CURRENCY_SYMBOL } from '@/constants';

export const formatCurrency = (amount = 0) => {
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN')}`;
};

export const calculateDiscountPercent = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
