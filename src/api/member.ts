import axiosInstance from "./axios-interceptor";

export const withdrawMembership = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(`/member/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
