import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface ImagePickerResult {
  uri: string;
  type: string;
  fileName: string;
  fileSize: number;
}

class ImagePickerService {
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need camera permissions for file input
    }

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'FlirtShaala needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need storage permissions for file input
    }

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'FlirtShaala needs access to your photos to select images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Storage permission error:', error);
      return false;
    }
  }

  async pickImageFromGallery(): Promise<ImagePickerResult | null> {
    if (Platform.OS === 'web') {
      return this.pickImageFromWeb();
    }

    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant storage permission to select images.');
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (asset && asset.uri) {
          resolve({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'image.jpg',
            fileSize: asset.fileSize || 0,
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  async takePhoto(): Promise<ImagePickerResult | null> {
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Camera is not supported on web. Please use gallery instead.');
      return null;
    }

    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera permission to take photos.');
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (asset && asset.uri) {
          resolve({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'photo.jpg',
            fileSize: asset.fileSize || 0,
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  private pickImageFromWeb(): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          if (file.size > 10 * 1024 * 1024) { // 10MB limit
            Alert.alert('File Too Large', 'Please select an image smaller than 10MB.');
            resolve(null);
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              uri: e.target?.result as string,
              type: file.type,
              fileName: file.name,
              fileSize: file.size,
            });
          };
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  showImagePickerOptions(): Promise<ImagePickerResult | null> {
    if (Platform.OS === 'web') {
      return this.pickImageFromGallery();
    }

    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose an option to select an image',
        [
          { text: 'Camera', onPress: () => this.takePhoto().then(resolve) },
          { text: 'Gallery', onPress: () => this.pickImageFromGallery().then(resolve) },
          { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
        ]
      );
    });
  }
}

export const imagePickerService = new ImagePickerService();