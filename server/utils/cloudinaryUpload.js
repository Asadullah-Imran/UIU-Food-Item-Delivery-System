import cloudinary from '../config/cloudinary.js';

export const uploadImageToCloudinary = (
  buffer,
  folder = 'uiu-delivery/menu-items'
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    stream.end(buffer);
  });
};

export const deleteImageFromCloudinary = async (
  publicId
) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
