import { Alert, PermissionsAndroid, Platform } from 'react-native';

// Only import image picker on native platforms
let launchImageLibrary: any = null;
let launchCamera: any = null;

if (Platform.OS !== 'web') {
  try {
    const imagePickerModule = require('react-native-image-picker');
    launchImageLibrary = imagePickerModule.launchImageLibrary;
    launchCamera = imagePickerModule.launchCamera;
  } catch (error) {
    console.warn('Image picker not available on this platform');
  }
}

export interface ImagePickerResult {
  uri: string;
  type: string;
  fileName: string;
  fileSize: number;
}

class ImagePickerService {
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit camera permission
    }

    try {
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
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit storage permission
    }

    try {
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
    } catch (error) {
      console.error('Storage permission error:', error);
      return false;
    }
  }

  async pickImageFromGallery(): Promise<ImagePickerResult | null> {
    if (Platform.OS === 'web') {
      return this.pickImageFromWeb();
    }

    if (!launchImageLibrary) {
      Alert.alert('Error', 'Image picker not available on this platform');
      return null;
    }

    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant storage permission to select images.');
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as any,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchImageLibrary(options, (response: any) => {
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
      Alert.alert('Camera Not Available', 'Camera capture is not available on web. Please use the gallery option.');
      return null;
    }

    if (!launchCamera) {
      Alert.alert('Error', 'Camera not available on this platform');
      return null;
    }

    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera permission to take photos.');
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as any,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchCamera(options, (response: any) => {
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

  private async pickImageFromWeb(): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            resolve({
              uri: e.target.result,
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
      return this.pickImageFromWeb();
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