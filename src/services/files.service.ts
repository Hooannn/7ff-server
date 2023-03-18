import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@config';
import cloudinary from 'cloudinary';
class FilesService {
  private cloudinary = cloudinary.v2;

  constructor() {
    this.cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  public async uploadToCloudinary({ base64, fileFormat, folder }: { base64: string; fileFormat: string; folder?: string; uploadedBy?: string }) {
    const { uploader } = this.cloudinary;
    const res = await uploader.upload(`data:image/${fileFormat};base64,${base64}`, { folder, image_metadata: true });
    return res;
  }

  public async searchByFolder(folder: string) {
    const { search } = this.cloudinary;
    return await search.expression(`folder=${folder}`).execute();
  }
}

export default FilesService;
