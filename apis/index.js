// Comprehensive API exports for the frontend
import authAPI from './auth';
import userAPI from './user';
import listingAPI from './listing';
import reviewAPI from './review';
import contactAPI from './contact';
import favoriteAPI from './favorites';
import agentAPI from './agent';
import pointAPI from './points';
import { messageAPI } from './message';
import { newsletterAPI } from './newsletter';
import dashboardAPI from './dashboard';
import categoryAPI from './category';
import cityAPI from './city';
import propertyRentalAPI from './propertyRental';
import adminAPI from './admin';
import careerAPI from './career';
import notificationAPI from './notification';
import futureBuyerAPI from './futureBuyer';

// Export all APIs
export {
  authAPI,
  userAPI,
  listingAPI,
  reviewAPI,
  contactAPI,
  favoriteAPI,
  agentAPI,
  pointAPI,
  messageAPI,
  newsletterAPI,
  dashboardAPI,
  categoryAPI,
  cityAPI,
  propertyRentalAPI,
  adminAPI,
  careerAPI,
  notificationAPI,
  futureBuyerAPI
};

// Default export with all APIs
export default {
  auth: authAPI,
  user: userAPI,
  listing: listingAPI,
  review: reviewAPI,
  contact: contactAPI,
  favorites: favoriteAPI,
  agent: agentAPI,
  points: pointAPI,
  message: messageAPI,
  newsletter: newsletterAPI,
  dashboard: dashboardAPI,
  category: categoryAPI,
  city: cityAPI,
  propertyRental: propertyRentalAPI,
  admin: adminAPI,
  career: careerAPI,
  notification: notificationAPI,
  futureBuyer: futureBuyerAPI
};

// Individual exports for convenience
export const auth = authAPI;
export const user = userAPI;
export const listing = listingAPI;
export const review = reviewAPI;
export const contact = contactAPI;
export const favorites = favoriteAPI;
export const agent = agentAPI;
export const points = pointAPI;
export const message = messageAPI;
export const newsletter = newsletterAPI;
export const dashboard = dashboardAPI;
export const category = categoryAPI;
export const city = cityAPI;
export const propertyRental = propertyRentalAPI;
export const admin = adminAPI;
export const career = careerAPI;
export const notification = notificationAPI;
export const futureBuyer = futureBuyerAPI;
