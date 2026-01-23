/**
 * Utility function to translate API success and error messages
 * Maps common API messages to translation keys
 */

import { useTranslations } from 'next-intl';

/**
 * Translate API message to user-friendly message based on locale
 * @param {string} message - The API message to translate
 * @param {string} locale - Current locale ('ar' or 'en')
 * @param {Function} t - Translation function from useTranslations
 * @returns {string} - Translated message
 */
export const translateApiMessage = (message, locale, t) => {
  if (!message || typeof message !== 'string') {
    return message || '';
  }

  const messageLower = message.toLowerCase().trim();

  // Success messages
  const successMessages = {
    'success': t('success'),
    'agent blocked successfully': t('agentBlockedSuccess'),
    'agent unblocked successfully': t('agentUnblockedSuccess'),
    'agent deleted successfully': t('agentDeletedSuccess'),
    'property created successfully': t('propertyCreatedSuccess'),
    'property updated successfully': t('propertyUpdatedSuccess'),
    'property deleted successfully': t('propertyDeletedSuccess'),
    'property approved successfully': t('propertyApprovedSuccess'),
    'property rejected successfully': t('propertyRejectedSuccess'),
    'message sent successfully': t('messageSentSuccess'),
    'profile updated successfully': t('profileUpdatedSuccess'),
    'password changed successfully': t('passwordChangedSuccess'),
    'user created successfully': t('userCreatedSuccess'),
    'user updated successfully': t('userUpdatedSuccess'),
    'user deleted successfully': t('userDeletedSuccess'),
  };

  // Error messages
  const errorMessages = {
    'error': t('error'),
    'failed': t('failed'),
    'please provide a reason for blocking': t('provideBlockReason'),
    'failed to block agent': t('failedToBlockAgent'),
    'failed to unblock agent': t('failedToUnblockAgent'),
    'failed to delete agent': t('failedToDeleteAgent'),
    'failed to load agent details': t('failedToLoadAgentDetails'),
    'failed to load agents': t('failedToLoadAgents'),
    'failed to create property': t('failedToCreateProperty'),
    'failed to update property': t('failedToUpdateProperty'),
    'failed to delete property': t('failedToDeleteProperty'),
    'failed to approve property': t('failedToApproveProperty'),
    'failed to reject property': t('failedToRejectProperty'),
    'failed to send message': t('failedToSendMessage'),
    'failed to update profile': t('failedToUpdateProfile'),
    'failed to change password': t('failedToChangePassword'),
    'failed to create user': t('failedToCreateUser'),
    'failed to update user': t('failedToUpdateUser'),
    'failed to delete user': t('failedToDeleteUser'),
    'unauthorized': t('unauthorized'),
    'forbidden': t('forbidden'),
    'not found': t('notFound'),
    'validation error': t('validationError'),
    'server error': t('serverError'),
    'network error': t('networkError'),
    'timeout': t('timeout'),
    'maximum limit reached. you can only submit 3 future buyer interest requests.': t('maxLimitReached'),
    'maximum limit reached. you can only submit 5 rental service requests.': t('maxRentalLimitReached'),
  };

  // Check for exact match first
  if (successMessages[messageLower]) {
    return successMessages[messageLower];
  }

  if (errorMessages[messageLower]) {
    return errorMessages[messageLower];
  }

  // Check for partial matches
  for (const [key, translation] of Object.entries(successMessages)) {
    if (messageLower.includes(key)) {
      return translation;
    }
  }

  for (const [key, translation] of Object.entries(errorMessages)) {
    if (messageLower.includes(key)) {
      return translation;
    }
  }

  // If no translation found, return original message
  return message;
};

/**
 * Hook to get translation function for API messages
 * This should be used in components
 */
export const useTranslateApiMessage = () => {
  const t = useTranslations('apiMessages');
  
  return (message) => {
    return translateApiMessage(message, null, t);
  };
};

