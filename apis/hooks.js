import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { authAPI, listingAPI, reviewAPI, contactAPI, favoriteAPI, agentAPI, pointAPI, messageAPI, newsletterAPI, dashboardAPI } from './index';

// Authentication hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      queryClient.invalidateQueries(['auth']);
    },
  });

  const signinMutation = useMutation({
    mutationFn: authAPI.signin,
    onSuccess: () => {
      queryClient.invalidateQueries(['auth']);
    },
  });

  const signoutMutation = useMutation({
    mutationFn: authAPI.signout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    signout: signoutMutation.mutate,
    isSigningUp: signupMutation.isPending,
    isSigningIn: signinMutation.isPending,
    isSigningOut: signoutMutation.isPending,
    signupError: signupMutation.error,
    signinError: signinMutation.error,
    signoutError: signoutMutation.error,
  };
};




// Listing hooks
export const useListings = (params = {}) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['listings', locale, params],
    queryFn: () => listingAPI.getListings(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - increased for better performance
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Prevent refetch on component mount if data exists
    retry: 1, // Reduce retry attempts
    retryDelay: 1000, // 1 second delay between retries
  });
};

// Search listings hook with debouncing
export const useSearchListings = (searchParams = {}, options = {}) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['listings', 'search', locale, searchParams],
    queryFn: () => listingAPI.searchListings(searchParams),
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes - increased for better performance
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount if data exists
    retry: 1, // Reduce retry attempts
    retryDelay: 1000, // 1 second delay between retries
  });
};

export const useListing = (id) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['listing', locale, id],
    queryFn: () => listingAPI.getListingById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 1, // Reduce retry attempts
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingAPI.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => listingAPI.updateListing(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['listing', id]);
      queryClient.invalidateQueries(['listings']);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingAPI.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

// Review hooks
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewAPI.getReviews(params),
  });
};

export const useReviewsByProperty = (propertyId) => {
  return useQuery({
    queryKey: ['reviews', 'property', propertyId],
    queryFn: () => reviewAPI.getReviewsByProperty(propertyId),
    enabled: !!propertyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

export const useReviewsByAgent = (agentId, params = {}) => {
  return useQuery({
    queryKey: ['reviews', 'agent', agentId, params],
    queryFn: () => reviewAPI.getReviewsByAgent(agentId, params),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewAPI.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
    },
  });
};

export const useHideReviewFromDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, hidden }) => reviewAPI.hideReviewFromDashboard(reviewId, hidden),
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries(['reviews']);
      queryClient.invalidateQueries(['reviews', 'property']); // Also invalidate property-specific reviews
    },
  });
};

export const useHideReviewFromListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, hidden }) => reviewAPI.hideReviewFromListing(reviewId, hidden),
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries(['reviews']);
      queryClient.invalidateQueries(['reviews', 'property']); // Also invalidate property-specific reviews
    },
  });
};

// Message hooks
export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageAPI.createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });
};

// Contact hooks
export const useContacts = (params = {}) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactAPI.getContacts(params),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactAPI.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });
};

// Favorite hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteAPI.getFavorites,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoriteAPI.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoriteAPI.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });
};

// Agent hooks
export const useAgents = (params = {}) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['agents', locale, params],
    queryFn: () => agentAPI.getAgents(params),
  });
};

export const useAgent = (id) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['agent', locale, id],
    queryFn: () => agentAPI.getAgentById(id),
    enabled: !!id,
  });
};

// Get listings by agent with pagination and filtering
export const useListingsByAgent = (agentId, params = {}) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['listings', 'agent', locale, agentId, params],
    queryFn: () => listingAPI.getListingsByAgent(agentId, params),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get most visited listings by agent
export const useMostVisitedListings = (agentId, params = {}) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ['listings', 'mostVisited', locale, agentId, params],
    queryFn: () => listingAPI.getMostVisitedListings(agentId, params),
    enabled: true, // Always enabled, will use fallback agentId if needed
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Increment visit count mutation
export const useIncrementVisitCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingAPI.incrementVisitCount,
    onSuccess: (data, variables) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries(['listings']);
      queryClient.invalidateQueries(['listings', 'mostVisited']);
    },
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentAPI.createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
    },
  });
};

// Point hooks
export const usePointBalance = () => {
  return useQuery({
    queryKey: ['points', 'balance'],
    queryFn: pointAPI.getPointBalance,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTransactionHistory = (params = {}) => {
  return useQuery({
    queryKey: ['points', 'transactions', params],
    queryFn: () => pointAPI.getTransactionHistory(params),
  });
};

export const useChargePoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pointAPI.chargePoints,
    onSuccess: () => {
      queryClient.invalidateQueries(['points']);
    },
  });
};

export const useCalculateListingCost = () => {
  return useMutation({
    mutationFn: pointAPI.calculateListingCost,
  });
};

// Message hooks
export const useMessagesByAgent = (agentId, params = {}) => {
  return useQuery({
    queryKey: ['messages', 'agent', agentId, params],
    queryFn: () => messageAPI.getMessagesByAgent(agentId, params),
    enabled: !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMessageById = (messageId) => {
  return useQuery({
    queryKey: ['message', messageId],
    queryFn: () => messageAPI.getMessageById(messageId),
    enabled: !!messageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMessageMutations = () => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: messageAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  const replyToMessageMutation = useMutation({
    mutationFn: ({ messageId, response }) => messageAPI.replyToMessage(messageId, response),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  const archiveMessageMutation = useMutation({
    mutationFn: messageAPI.archiveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: messageAPI.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    replyToMessage: replyToMessageMutation.mutate,
    archiveMessage: archiveMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isReplying: replyToMessageMutation.isPending,
    isArchiving: archiveMessageMutation.isPending,
    isDeleting: deleteMessageMutation.isPending,
    markAsReadError: markAsReadMutation.error,
    replyError: replyToMessageMutation.error,
    archiveError: archiveMessageMutation.error,
    deleteError: deleteMessageMutation.error,
  };
};

// Newsletter hooks
export const useNewsletterSubscription = () => {
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: ({ email, source, preferences }) => 
      newsletterAPI.subscribe(email, source, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries(['newsletter']);
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: newsletterAPI.unsubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries(['newsletter']);
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: ({ email, preferences }) => 
      newsletterAPI.updatePreferences(email, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries(['newsletter']);
    },
  });

  return {
    subscribe: subscribeMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    subscribeError: subscribeMutation.error,
    unsubscribeError: unsubscribeMutation.error,
    updatePreferencesError: updatePreferencesMutation.error,
  };
};

export const useNewsletterSubscribers = (params = {}) => {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', params],
    queryFn: () => newsletterAPI.getSubscribers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly called (admin only)
  });
};

export const useNewsletterStats = () => {
  return useQuery({
    queryKey: ['newsletter', 'stats'],
    queryFn: newsletterAPI.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: false, // Only fetch when explicitly called (admin only)
  });
};

// Dashboard hooks
export const useDashboardStats = (enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardAPI.getDashboardStats,
    enabled: enabled, // Only fetch when enabled (e.g., on dashboard pages)
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: enabled ? 5 * 60 * 1000 : false, // Refetch every 5 minutes only if enabled
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useDashboardAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'analytics', period],
    queryFn: () => dashboardAPI.getDashboardAnalytics(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
    retry: 2,
  });
};

export const useDashboardNotifications = () => {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: dashboardAPI.getDashboardNotifications,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    retry: 2,
  });
};

export const useDashboardHealth = () => {
  return useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: dashboardAPI.getDashboardHealth,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 1,
  });
};

// AI Search hook
export const useAISearch = (query, options = {}) => {
  const locale = useLocale();
  const { page = 1, limit = 12, enabled = true } = options;
  
  return useQuery({
    queryKey: ['aiSearch', locale, query, page, limit],
    queryFn: () => listingAPI.aiSearchProperties(query, { page, limit }),
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
};
