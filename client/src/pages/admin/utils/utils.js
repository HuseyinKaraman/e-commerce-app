import axios from "axios";

export const uploadImageApiRequest = async (images, productId) => {
    const formData = new FormData(); // built-in js class

    // Array.from(images).forEach((image) => {
    //     formData.append("images", image.originFileObj);
    // });
    formData.append("images", images);

    const {data} = await axios.post(`/api/products/admin/upload?productId=` + productId, formData);
    return data;
};

export const uploadImagesCloudinaryApiRequest = (images, productId) => {
    const url = "https://api.cloudinary.com/v1_1/diqboijhi/image/upload";
    const formData = new FormData(); // built-in js class
    let file;
    
    if (Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
            file = images[i];
            formData.append("file", file.originFileObj);
            formData.append("upload_preset", "ldq1s1au");
        }
    } else {
        file = images;        
        formData.append("file", file);
        formData.append("upload_preset", "ldq1s1au");
    }
    fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => axios.post(`/api/products/admin/upload?cloudinary=true&productId=` + productId, data));
};

/**
 * export const uploadImagesCloudinaryApiRequest = (images, productId) => {
    const url = "https://api.cloudinary.com/v1_1/diqboijhi/image/upload";
    const formData = new FormData(); // built-in js class
    for (let i = 0; i < images.length; i++) {
        let file = images[i];
        formData.append("file", file);
        formData.append("upload_preset", "ldq1s1au");
    }
    fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => axios.post(`/api/products/admin/upload?cloudinary=true&productId=` + productId, data));
};
 */