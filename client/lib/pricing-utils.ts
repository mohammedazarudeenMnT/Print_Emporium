// Pricing calculation utilities

import { Service, OptionPricing } from './service-api';
import { ServiceConfiguration, ItemPricing } from './order-types';

/**
 * Find option pricing by value
 */
function findOptionPrice(options: OptionPricing[], value: string): OptionPricing | undefined {
  return options.find(opt => opt.value === value);
}

/**
 * Calculate pricing for a single order item
 */
export function calculateItemPricing(
  service: Service,
  configuration: ServiceConfiguration,
  pageCount: number
): ItemPricing {
  const { copies } = configuration;
  
  // Get individual option prices
  const printTypeOpt = findOptionPrice(service.printTypes, configuration.printType);
  const paperSizeOpt = findOptionPrice(service.paperSizes, configuration.paperSize);
  const paperTypeOpt = findOptionPrice(service.paperTypes, configuration.paperType);
  const gsmOpt = findOptionPrice(service.gsmOptions, configuration.gsm);
  const printSideOpt = findOptionPrice(service.printSides, configuration.printSide);
  const bindingOpt = findOptionPrice(service.bindingOptions, configuration.bindingOption);

  // Determine pricing type for each option (use whichever is > 0)
  const printTypePrice = printTypeOpt?.pricePerPage || printTypeOpt?.pricePerCopy || 0;
  const printTypeIsPerCopy = (printTypeOpt?.pricePerCopy || 0) > 0 && (printTypeOpt?.pricePerPage || 0) === 0;
  
  const paperSizePrice = paperSizeOpt?.pricePerPage || paperSizeOpt?.pricePerCopy || 0;
  const paperSizeIsPerCopy = (paperSizeOpt?.pricePerCopy || 0) > 0 && (paperSizeOpt?.pricePerPage || 0) === 0;
  
  const paperTypePrice = paperTypeOpt?.pricePerPage || paperTypeOpt?.pricePerCopy || 0;
  const paperTypeIsPerCopy = (paperTypeOpt?.pricePerCopy || 0) > 0 && (paperTypeOpt?.pricePerPage || 0) === 0;
  
  const gsmPrice = gsmOpt?.pricePerPage || gsmOpt?.pricePerCopy || 0;
  const gsmIsPerCopy = (gsmOpt?.pricePerCopy || 0) > 0 && (gsmOpt?.pricePerPage || 0) === 0;
  
  const printSidePrice = printSideOpt?.pricePerPage || printSideOpt?.pricePerCopy || 0;
  const printSideIsPerCopy = (printSideOpt?.pricePerCopy || 0) > 0 && (printSideOpt?.pricePerPage || 0) === 0;
  
  const bindingPrice = bindingOpt?.pricePerCopy || bindingOpt?.pricePerPage || 0;
  const bindingIsPerCopy = (bindingOpt?.pricePerCopy || 0) > 0 || (bindingOpt?.pricePerPage || 0) === 0;

  // Calculate total pages based on print side
  let totalPages = pageCount;
  if (configuration.printSide === 'double-side') {
    totalPages = Math.ceil(pageCount / 2);
  }

  // Calculate price per page (sum of all per-page prices)
  const pricePerPage = service.basePricePerPage + 
                       (printTypeIsPerCopy ? 0 : printTypePrice) + 
                       (paperSizeIsPerCopy ? 0 : paperSizePrice) + 
                       (paperTypeIsPerCopy ? 0 : paperTypePrice) + 
                       (gsmIsPerCopy ? 0 : gsmPrice) + 
                       (printSideIsPerCopy ? 0 : printSidePrice) +
                       (bindingIsPerCopy ? 0 : bindingPrice);

  // Calculate per-copy charges
  const pricePerCopy = (printTypeIsPerCopy ? printTypePrice : 0) + 
                       (paperSizeIsPerCopy ? paperSizePrice : 0) + 
                       (paperTypeIsPerCopy ? paperTypePrice : 0) + 
                       (gsmIsPerCopy ? gsmPrice : 0) + 
                       (printSideIsPerCopy ? printSidePrice : 0) +
                       (bindingIsPerCopy ? bindingPrice : 0);

  // Calculate subtotal: (price per page * total pages * copies) + (price per copy * copies)
  const subtotal = (pricePerPage * totalPages * copies) + (pricePerCopy * copies);

  return {
    basePricePerPage: service.basePricePerPage,
    printTypePrice,
    paperSizePrice,
    paperTypePrice,
    gsmPrice,
    printSidePrice,
    bindingPrice,
    pricePerPage,
    subtotal,
    totalPages,
    copies,
  };
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(
  itemSubtotals: number[],
  deliveryCharge: number = 0,
  taxRate: number = 0.18 // 18% GST
): { subtotal: number; tax: number; total: number } {
  const subtotal = itemSubtotals.reduce((sum, item) => sum + item, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + deliveryCharge + tax;

  return { subtotal, tax, total };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get delivery charge based on order value
 */
export function getDeliveryCharge(subtotal: number): number {
  if (subtotal >= 500) return 0; // Free delivery above ₹500
  if (subtotal >= 200) return 30;
  return 50;
}
