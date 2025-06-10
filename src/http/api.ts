import api from './axios';

// Auth
export const login = (payload) => api.post("/Login", payload);
export const logout = () => api.post("/LogOut");

//Screens
export const getScreen = (payload) => api.post("/GETLookupData", payload);

// Company API
export const getCompanyById = (payload) => api.post("/GetCompany", payload);
export const addCompany = (payload) => api.post("/AddCompany", payload);
export const updateCompany = (payload) => api.post("/UpdateCompany", payload);
export const deleteCompany = (payload) => api.post("/DeleteCompany", payload);

// Plans API
export const plansById = (payload) => api.post("/GetPlans", payload);
export const addPlans = (payload) => api.post("/AddPlans", payload);
export const updatePlans = (payload) => api.post("/UpdatePlans", payload);
export const deletePlans = (payload) => api.post("/DeletePlans", payload);

// User Education
export const userEducationById = (payload) => api.post("/GetUserEducation", payload);
export const addUserEducation = (payload) => api.post("/AddUserEducation", payload);
export const updateUserEducation = (payload) => api.post("/UpdateUserEduction", payload);
export const deleteUserEducation = (payload) => api.post("/DeleteUserEduction", payload);

//Role and access
export const getRoleById = (payload) => api.post("/GetUserGroup", payload);
export const createRole = (payload) => api.post("/AddUserGroup", payload);
export const updateRole = (payload) => api.post("/UpdateUserGroup", payload);
export const deleteRole = (payload) => api.post("/DeleteUserGroup", payload);
export const getUserGroupScreens = (payload) => api.post("/GetScreenGroup", payload);

//Simulation API
export const getJobSimulationById = (payload) => api.post("/GetJobSimulation", payload)
export const addJobSimulation = (payload) => api.post("/AddJobSimulation", payload)
export const updateJobSimulation = (payload) => api.post("/UpdateJobSimulation", payload)
export const deleteJobSimulation = (payload) => api.post("/DeleteJobSimulation", payload);

//Section API
export const getSectionById = (payload) => api.post("/GetSection", payload);
export const addSection = (payload) => api.post("/AddSection", payload);
export const updateSection = (payload) => api.post("/UpdateSection", payload);
export const deleteSection = (payload) => api.post("/DeleteSection", payload);

//User API
export const deleteUser = (payload) => api.post("/DeleteUserMaster", payload);
export const getUserById = (payload) => api.post("/GetUserMaster", payload);
export const addUser = (payload) => api.post("/AddUserMaster", payload);
export const updateUser = (payload) => api.post("/UpdateUserMaster", payload);
