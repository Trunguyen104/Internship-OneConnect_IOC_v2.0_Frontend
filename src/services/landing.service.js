import { httpPost } from './http-client.service';

/**
 * Service for public landing page actions.
 */
export const landingService = {
  /**
   * Sends a reservation/contact email request.
   * @param {Object} data - The reservation details.
   * @returns {Promise} API Response.
   */
  sendReservation: async (data) => {
    return httpPost('/Landing/reservation', data);
  },

  /** Request a 6-digit OTP for landing email verification (rate limited). */
  sendLandingOtp: async (data) => {
    return httpPost('/Auth/landing/send-otp', data);
  },

  /** Verify OTP; marks email as verified for the next reservation submit. */
  verifyLandingOtp: async (data) => {
    return httpPost('/Auth/landing/verify-otp', data);
  },

  /** Checks if email is already registered to skip OTP. */
  checkLandingEmailRegistered: async (data) => {
    return httpPost('/auth/landing/check-email', data);
  },
};
