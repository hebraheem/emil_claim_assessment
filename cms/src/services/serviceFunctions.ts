import api from "../config/axios";
import {
  ClaimConfigResponseDto,
  ClaimConfigUpdateRequestDto,
  CreateClaimRequestDto,
  CreateClaimResponseDto,
  DeleteClaimResponseDto,
  GetClaimResponseDto,
  GetClaimsRequestDto,
  GetClaimsResponseDto,
  UpdateClaimRequestDto,
  UpdateClaimResponseDto,
} from "../types";

// <------ configs ------>
/**
 * @returns Promise<ClaimConfigResponseDto>
 * Fetches the configuration for claims.
 * This function retrieves the configuration data from the API endpoint 'claims/config'.
 */
export const fetchConfig = async (): Promise<ClaimConfigResponseDto> => {
  const response = await api.get("claims/config");
  return response.data;
};

/**
 * @param configData - The configuration data to update.
 * @returns Promise<ClaimConfigResponseDto>
 * Updates the configuration for claims.
 * This function sends a PUT request to the API endpoint 'claims/config' with the provided configuration data.
 */
export const updateConfig = async (
  configData: ClaimConfigUpdateRequestDto
): Promise<ClaimConfigResponseDto> => {
  const response = await api.put("claims/config", configData);
  return response.data;
};

// <------- claims ------->
/**
 * Fetches claims based on the provided query parameters.
 * @param query - An object containing pagination and filtering options.
 * @returns Promise<GetClaimsResponseDto>
 * This function constructs a query string from the provided parameters and sends a GET request to the API endpoint 'claims'.
 * The query parameters include page, pageSize, and status.
 * If no parameters are provided, it fetches all claims.
 */
export const fetchClaims = async (
  query: GetClaimsRequestDto
): Promise<GetClaimsResponseDto> => {
  let queryString = "";
  if (Object.keys(query).length) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString += `${key}=${value}&`;
      }
    });
    queryString = queryString.slice(0, -1); // Remove the trailing '&'
  }
  const response = await api.get(
    `claims${queryString ? `?${queryString}` : ""}`
  );
  return response.data;
};

/**
 * Fetches a specific claim by its ID.
 * @param id - The ID of the claim to fetch.
 * @returns Promise<GetClaimResponseDto>
 * This function sends a GET request to the API endpoint 'claims/{id}' to retrieve the claim details.
 */
export const fetchClaim = async (id: string): Promise<GetClaimResponseDto> => {
  const response = await api.get(`claims/${id}`);
  return response.data;
};

/**
 * Updates a specific claim with the provided data.
 * @param id - The ID of the claim to update.
 * @param data - The data to update the claim with.
 * @returns Promise<GetClaimResponseDto>
 * This function sends a PUT request to the API endpoint 'claims/{id}' with the updated claim data.
 */
export const updateClaim = async (
  id: string,
  data: UpdateClaimRequestDto
): Promise<UpdateClaimResponseDto> => {
  const response = await api.patch(`claims/${id}`, data);
  return response.data;
};

/**
 * Deletes a specific claim by its ID.
 * @param id - The ID of the claim to delete.
 * @returns Promise<DeleteClaimResponseDto>
 * This function sends a DELETE request to the API endpoint 'claims/{id}' to remove the claim.
 */
export const deleteClaim = async (
  id: string
): Promise<DeleteClaimResponseDto> => {
  return api.delete(`claims/${id}`);
};

/**
 * Creates a new claim with the provided data.
 * @param data - The data for the new claim.
 * @returns Promise<GetClaimResponseDto>
 * This function sends a POST request to the API endpoint 'claims' with the new claim data.
 */
export const createClaim = async (
  data: CreateClaimRequestDto
): Promise<CreateClaimResponseDto> => {
  const response = await api.post("claims", data);
  return response.data;
};
