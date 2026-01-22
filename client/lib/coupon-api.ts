import { axiosInstance } from "./axios";

export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

export interface CouponValidationResponse {
  success: boolean;
  data: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    discount: number;
    description?: string;
  };
  message?: string;
}

/**
 * Get all coupons (Admin)
 */
export const getAllCoupons = async (): Promise<{ success: boolean; data: Coupon[] }> => {
  const response = await axiosInstance.get("/api/coupons");
  return response.data;
};

/**
 * Get all active coupons (Public)
 */
export const getActiveCoupons = async (): Promise<{ success: boolean; data: Coupon[] }> => {
  const response = await axiosInstance.get("/api/coupons/active");
  return response.data;
};

/**
 * Create a new coupon (Admin)
 */
export const createCoupon = async (data: Partial<Coupon>): Promise<{ success: boolean; data: Coupon }> => {
  const response = await axiosInstance.post("/api/coupons", data);
  return response.data;
};

/**
 * Update a coupon (Admin)
 */
export const updateCoupon = async (id: string, data: Partial<Coupon>): Promise<{ success: boolean; data: Coupon }> => {
  const response = await axiosInstance.put(`/api/coupons/${id}`, data);
  return response.data;
};

/**
 * Delete a coupon (Admin)
 */
export const deleteCoupon = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/api/coupons/${id}`);
  return response.data;
};

/**
 * Validate a coupon code
 */
export const validateCoupon = async (code: string, orderAmount: number): Promise<CouponValidationResponse> => {
  const response = await axiosInstance.post("/api/coupons/validate", { code, orderAmount });
  return response.data;
};
