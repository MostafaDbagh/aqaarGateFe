import { Axios } from "@/axios";

export const getAllListings = () => Axios.get("api/listing/search").then(res => res.data);
export const getListingById = (id) => Axios.get(`listing/${id}`).then(res => res.data);
export const getListingsByAgent = (agentId) => Axios.get(`listing/agent/${agentId}`).then(res => res.data);
export const searchListings = (params) => Axios.get("listing/search", { params }).then(res => res.data);
export const addListing = (data) => Axios.post("listing/add", data).then(res => res.data);
export const updateListing = (id, data) => Axios.post(`listing/update/${id}`, data).then(res => res.data);
export const deleteListing = (id) => Axios.delete(`listing/delete/${id}`).then(res => res.data);
