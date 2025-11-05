import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// USERS
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (user) => api.post("/users", user);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// DOCTORS
export const getDoctors = () => api.get("/doctors");
export const getDoctor = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (doctor) => api.post("/doctors", doctor);
export const updateDoctor = (id, doctor) => api.put(`/doctors/${id}`, doctor);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);

// BOOKINGS
export const getBookings = () => api.get("/bookings");
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const createBooking = (booking) => api.post("/bookings", booking);
export const updateBooking = (id, booking) => api.put(`/bookings/${id}`, booking);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;
