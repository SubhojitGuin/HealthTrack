import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export const pickImageFromCamera = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Camera permission denied");
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const image = result.assets[0];

    const fileName = `camera_${Date.now()}.jpg`;
    const newUri = FileSystem.documentDirectory + fileName;

    await FileSystem.copyAsync({
      from: image.uri,
      to: newUri,
    });

    const fileInfo = await FileSystem.getInfoAsync(newUri);

    console.log("Original URI:", image.uri);
    console.log("Saved URI:", newUri);
    console.log("File Info:", fileInfo);

    return newUri;
  }

  return null;
};
