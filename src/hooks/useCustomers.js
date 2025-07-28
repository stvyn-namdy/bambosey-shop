import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
};

export const useCustomerOrders = (customerId, params = {}) => {
  return useQuery({
    queryKey: ['customer-orders', customerId, params],
    queryFn: () => customerService.getCustomerOrders(customerId, params),
    enabled: !!customerId,
  });
};

