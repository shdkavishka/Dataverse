import axios from 'axios';
import Cookies from 'universal-cookie';

//AH-- function for logout
export const handleLogout = async (navigate) => {
    // AH-- cookies object to handle cookies
    const cookies = new Cookies();

    try {
        // AH-- Send POST request to the logout endpoint in bakcend
        const response = await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });

        // AH-- Check if logout success
        if (response.data.message === 'success') {

            //AH-- Clear the JWT cookies
            cookies.remove('jwt', { path: '/' });

            //AH-- Redirect to login or home page
            navigate('/login');
        } else {
            console.error("Logout failed:", response.data);
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

export default handleLogout;

