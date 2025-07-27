import { authService } from './auth';
import { productService } from './products';
import { orderService } from './orders';
import { preorderService } from './preorders';
import { customerService } from './customers';
import { inventoryService } from './inventory';
import { analyticsService } from './analytics';
import { colorService } from './colors';
import { reviewService } from './reviews';

export { authService } from './auth';
export { productService } from './products';
export { orderService } from './orders';
export { preorderService } from './preorders';
export { customerService } from './customers';
export { inventoryService } from './inventory';
export { analyticsService } from './analytics';
export { colorService } from './colors';
export { reviewService } from './reviews';

// You can also import all services as a single object if needed
export * as services from './api';

// Default export for convenience
const services = {
  auth: authService,
  products: productService,
  orders: orderService,
  preorders: preorderService,
  customers: customerService,
  inventory: inventoryService,
  analytics: analyticsService,
  colors: colorService,
  reviews: reviewService,
};

export default services;