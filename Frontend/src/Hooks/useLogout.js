import { useSetRecoilState } from "recoil"
import userAtom from "../Atoms/userAtom"
import useShowToast from "./useShowToast"
import { useNavigate } from "react-router-dom"

const useLogout = () => {

    const showToast = useShowToast()
    const setUser = useSetRecoilState(userAtom);
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            // Fetch request to log out
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Logout request failed with status ${res.status}`);
            }

            // Clear local storage
            localStorage.removeItem("user-info");
            setUser(null); // Update Recoil state if necessary

            // Navigate to auth page
            navigate("/auth");

            // Show success toast (if needed)
            showToast("Logout", "Logout successful", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };
    return handleLogout
}

export default useLogout