import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"




cloudinary.config({
    cloud_name: process.env.CLOUDINERY_NAME,
    api_key: process.env.CLOUDINERY_KEY,
    api_secret: process.env.CLOUDINERY_SECRET // Click 'View API Keys' above to copy your API secret
});
    const uploadFilesOnCloudiney = async (localFiltPath) => {
        try {
    
            if (!localFiltPath) return null;
    
            const response = await cloudinary.uploader.upload(localFiltPath, {
                resource_type: 'auto'
            })
            // til here all those files are uploaded hence we will 
            console.log("file uploaded successfully",response.url);
                   return response;
    
        } catch (error) {
             fs.unlinkSync(localFiltPath);
             return null;
        }
    
    }

    export {uploadFilesOnCloudiney}