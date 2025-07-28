import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services';

export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params),
  });
};

export const useReview = (id) => {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewService.getReview(id),
    enabled: !!id,
  });
};

export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: ['product-reviews', productId, params],
    queryFn: () => reviewService.getProductReviews(productId, params),
    enabled: !!productId,
  });
};

export const useCustomerReviews = (customerId, params = {}) => {
  return useQuery({
    queryKey: ['customer-reviews', customerId, params],
    queryFn: () => reviewService.getCustomerReviews(customerId, params),
    enabled: !!customerId,
  });
};

export const useReviewStats = (params = {}) => {
  return useQuery({
    queryKey: ['review-stats', params],
    queryFn: () => reviewService.getReviewStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['review-analytics', params],
    queryFn: () => reviewService.getReviewAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFlaggedReviews = (params = {}) => {
  return useQuery({
    queryKey: ['flagged-reviews', params],
    queryFn: () => reviewService.getFlaggedReviews(params),
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => reviewService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['review-analytics'] });
    },
  });
};

export const useBulkUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ids, status }) => reviewService.bulkUpdateReviewStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['review-analytics'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['review-analytics'] });
    },
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, replyData }) => reviewService.replyToReview(id, replyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
  });
};

export const useFlagReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => reviewService.flagReview(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reviewData }) => reviewService.updateReview(id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
  });
};