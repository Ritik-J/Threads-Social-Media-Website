import { useState } from "react";
import useShowToast from "./useShowToast";

function UseImage() {
    const [imageUrl, setImageUrl] = useState()
    const showToast = useShowToast()

    const handleChangeImage = (e) => {
    const file = e.target.files[0]

    //check if it is valid file type 
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }   else{
        showToast("Invalid file type", "please select an image", "error")
        setImageUrl(null)
        }
    }
    return {handleChangeImage, imageUrl, setImageUrl};
}

export default UseImage;