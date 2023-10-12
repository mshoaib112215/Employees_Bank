import axios from "axios";
import { identity } from "lodash";
import { useNavigate } from "react-router-dom";

const navigating = () => {
    const navigate = useNavigate();
    navigate('/login');

}
const api = axios.create({
    baseURL: 'https://139.59.79.69:3000/',
    // baseURL: 'https://192.168.83.48:3000/',
    withCredentials: true,
    headers: {  
        'Content-Type': 'application/json',
    }
})

export const login = async (data) => {
    let response;
   
    try {
        response = await api.post("/login", data);
    }
    catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle the 401 Unauthorized error here if needed
            // You can access error.response.data for the response data
            console.error("Unauthorized: ", error.response.data);
        } else {
            // Handle other errors (e.g., network issues, server errors)
            console.error("Error: ", error.message);
        }
        // Return the error object or handle it as needed
        return error;
    }
    return response
}
export const uploadImage = async (data) => {
    let response;

    try {
        response = await api.post("/upload", { image: data });
        return response

    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    uploadImage(data)
                }
                else {

                    navigating
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const deleteImage = async (data) => {
    let response;

    try {
        response = await api.delete("/delete-avatar", { user: data });
        return response

    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    uploadImage(data)
                }
                else {

                    navigating
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const getAvatar = async (id) => {

    let response;

    try {
        response = await api.get(`/get-avatar/${id}`);
        console.log(response)
        return response
    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    uploadImage(data)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const logoutUser = async (data) => {
    let response;

    try {
        response = await api.post("/logout");
        return response

    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    logoutUser(data);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const createUser = async (data) => {
    let response;

    try {
        response = await api.post("/register", data);
        return response

    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    createUser(data);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const getEntries = async () => {
    let response;
    try {
        response = await api.get("/entries");
        return response
    }
    catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    getEntries();
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;

    }
}
export const findUser = async (id) => {
    try {
        const response = await api.get(`/user/${id}`);
        return response.data; // The response should already contain the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    findUser(id);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const getUsers = async () => {
    try {
        const response = await api.get(`/users`);
        return response;
    } catch (error) {
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    getUsers();
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const EditUser = async (data, id, userId) => {
    try {
        console.log(data)
        const response = await api.put(`/update/${id}/${userId}`, data);
        console.log(response)
        return response;
    } catch (error) {
        console.error('Error creating Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    EditUser(data, id, userId);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}

export const deleteEntry = async (id) => {
    try {
        const response = await api.delete(`/delete-entry/${id}`);

        return response.data.deleteCount;
    } catch (error) {
        console.error('Error deleting Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteEntry(id);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const deleteAllRec = async (data) => {
    try {
        console.log({data})
        const response = await api.delete(`/delete-all`, {data});
            
        console.log(response)
        return response;
    } catch (error) {
        console.error('Error deleting Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteAllRec(data);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const deleteUser = async (id, userId) => {

    try {
        const response = await api.delete(`/delete/${id}/${userId}`);
        return response.data.deletedCount;
    } catch (error) {
        console.error('Error deleting Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteUser(id, userId);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const createEntry = async (data) => {
    try {
        const response = await api.post("/create-entry", data);


        return response;
    } catch (error) {
        console.error('Error creating Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    createEntry(data);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
    }
}
export const EditEntry = async (data, id) => {
    try {
        console.log(data)
        const response = await api.put(`/update-entry/${id}`, data);
        return response;
    } catch (error) {
        console.error('Error creating Entry:', error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    EditEntry(data, id);
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return null;
    }
}
export const getAppliedFor = async () => {
    try {
        const response = await api.get('/applied-for');
        return response.data;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    getAppliedFor()
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const getEmployeeTypes = async () => {
    try {
        const response = await api.get('/employee-type');
        return response.data;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    getEmployeeTypes()
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const deleteType = async (id) => {
    try {
        const response = await api.delete(`/delete-applied-for/${id}`);
        return response.data;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteType(id)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const deleteEmployeeType = async (id) => {
    try {
        const response = await api.delete(`/delete-employee-type/${id}`);
        return response.data;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteEmployeeType(id)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const addAppliedFor = async (data) => {
    try {
        const response = await api.post(`/add-applied-for`, data);
        return response;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    addAppliedFor(data)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const addEmployeeType = async (data) => {
    try {
        const response = await api.post(`/add-employee-type`, data);
        return response;
    }
    catch (error) {
        console.error("error in getting applied for data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    addEmployeeType(data)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const getTemplates = async () => {
    try {
        const response = await api.get('/templates');
        return response;
    }
    catch (error) {
        console.error("error in getting templates data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    getTemplates()
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const updateTamplate = async (id, data) => {
    try {

        const response = await api.put(`/template/${id}`, data);

        return response;
    }
    catch (error) {
        console.error("error in getting templates data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    updateTamplate(id, data)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const addTemplate = async (data) => {
    console.log('hello')

    try {

        const response = await api.post(`/create-template`, data);

        return response;
    }
    catch (error) {
        console.error("error in getting templates data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    addTemplate(data)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
export const deleteTemplate = async (id) => {
    try {

        const response = await api.delete(`/delete-template/${id}`);

        return response;
    }
    catch (error) {
        console.error("error in getting templates data", error);
        try {

            if (error.code === "ERR_BAD_RESPONSE") {
                // Trigger the refresh endpoint here
                const refreshResponse = await api.get("/refresh");
                console.log('in expire JWT tokens');
                // Check if the refresh was successful
                if (refreshResponse.status === 200) {
                    // Retry the original request with the new token
                    deleteTemplate(id)
                }
                else {

                    navigating()
                }



            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
        return error;
    }
}
