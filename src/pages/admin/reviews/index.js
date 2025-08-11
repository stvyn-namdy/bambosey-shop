import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services';
import Image from 'next/image';
import { Search, Filter, Star, CheckCircle, XCircle, Flag, Reply, MoreHorizontal } from 'lucide-react';
import Button from '@/components/admin/ui/Button';
import Card from '@/components/admin/ui/Card';
import Badge from '@/components/admin/ui/Badge';
import Table from '@/components/admin/ui/Table';
import Modal from '@/components/admin/ui/Modal';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import { formatDate, formatDateTime, debounce } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

export default function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    dateRange: '30d',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedReviews, setSelectedReviews] = useState([]);

  const queryClient = useQueryClient();

  // Fetch reviews data
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', search, filters, pagination],
    queryFn: () => reviewService.getReviews({
      search,
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    }),
    keepPreviousData: true,
  });

  // Fetch review stats
  const { data: stats } = useQuery({
    queryKey: ['review-stats', filters.dateRange],
    queryFn: () => reviewService.getReviewStats({ range: filters.dateRange }),
  });

  // Update review status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => reviewService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      toast.success('Review status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update review status');
    },
  });

  // Bulk update status mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, status }) => reviewService.bulkUpdateReviewStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      setSelectedReviews([]);
      toast.success('Reviews updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update reviews');
    },
  });

  // Reply to review mutation
  const replyMutation = useMutation({
    mutationFn: ({ id, reply }) => reviewService.replyToReview(id, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setShowReplyModal(false);
      setReplyText('');
      setSelectedReview(null);
      toast.success('Reply sent successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = (reviewId, status) => {
    updateStatusMutation.mutate({ id: reviewId, status });
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedReviews.length === 0) {
      toast.error('Please select reviews to update');
      return;
    }
    bulkUpdateMutation.mutate({ ids: selectedReviews, status });
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    replyMutation.mutate({ id: selectedReview.id, reply: replyText });
  };

  const handleDeleteReview = (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReviews(data?.reviews?.map(r => r.id) || []);
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId, checked) => {
    if (checked) {
      setSelectedReviews(prev => [...prev, reviewId]);
    } else {
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'flagged': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-600">Manage customer reviews and feedback</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalReviews || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.approvedReviews || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.pendingReviews || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.averageRating?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                onChange={handleSearchChange}
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <Card>
          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedReviews.length} reviews selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('approved')}
                    loading={bulkUpdateMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('rejected')}
                    loading={bulkUpdateMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Card.Content className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading reviews: {error.message}
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedReviews.length === data?.reviews?.length && data?.reviews?.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </Table.Head>
                    <Table.Head>Customer</Table.Head>
                    <Table.Head>Product</Table.Head>
                    <Table.Head>Rating</Table.Head>
                    <Table.Head>Review</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Date</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.reviews?.map((review) => (
                    <Table.Row key={review.id}>
                      <Table.Cell>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={(e) => handleSelectReview(review.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.customer?.firstName} {review.customer?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{review.customer?.email}</p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0">
                            {review.product?.images?.[0] ? (
                              <Image
                                src={review.product.images[0]}
                                alt={review.product.name}
                                className="w-10 h-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-md" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {review.product?.name}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            ({review.rating})
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate">
                            {review.comment}
                          </p>
                          <button
                            onClick={() => handleViewDetails(review)}
                            className="text-xs text-primary-600 hover:text-primary-800"
                          >
                            Read more
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant={getStatusVariant(review.status)}>
                          {review.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                                loading={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                loading={updateStatusMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReply(review)}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            loading={deleteReviewMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}

            {data?.reviews?.length === 0 && (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Reviews will appear here when customers leave feedback.
                </p>
              </div>
            )}
          </Card.Content>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, data.total)} of{' '}
                  {data.total} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === data.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="Reply to Review"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Review Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(selectedReview.rating)}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {selectedReview.customer?.firstName} {selectedReview.customer?.lastName}
                </span>
              </div>
              <p className="text-gray-700">{selectedReview.comment}</p>
            </div>

            {/* Reply Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Write your reply to this review..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReply}
                loading={replyMutation.isPending}
              >
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Customer</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  {selectedReview.customer?.firstName} {selectedReview.customer?.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedReview.customer?.email}</p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Product</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedReview.product?.name}</p>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Review</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-gray-600">
                    ({selectedReview.rating}/5)
                  </span>
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
            </div>

            {/* Review Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                <Badge variant={getStatusVariant(selectedReview.status)}>
                  {selectedReview.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Date</h4>
                <p className="text-sm text-gray-600">
                  {formatDateTime(selectedReview.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {selectedReview.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedReview.id, 'rejected');
                      setShowDetailsModal(false);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedReview.id, 'approved');
                      setShowDetailsModal(false);
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleReply(selectedReview);
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}