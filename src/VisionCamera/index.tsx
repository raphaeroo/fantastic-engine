import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode,
} from 'react-native-face-detection';

import {
  calculateFaceRectInsideImage,
  calculateImageSize,
  FaceRectType,
  ImageSizeType,
} from '../ImageForGallery';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width: screenWidth} = Dimensions.get('window');

type Asset = {
  width?: number;
  height?: number;
  uri?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notDeviceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    bottom: 30,
    left: screenWidth / 2 - 25,
  },
  box: {
    borderWidth: 1,
    borderColor: 'green',
  },
  disabledShutter: {
    backgroundColor: 'gray',
  },
});

const Shutter = ({onPress, disabled}) => (
  <TouchableOpacity
    style={[styles.shutter, disabled && styles.disabledShutter]}
    onPress={onPress}
    disabled={disabled}
  />
);

export function VisionCamera() {
  const [permissionEnabled, setPermissionEnabled] = useState<
    boolean | undefined
  >(undefined);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageObject, setImageObject] = useState<Asset | undefined>();
  const [imageSize, setImageSize] = useState<ImageSizeType | undefined>();
  const [faceRects, setFaceRects] = useState<FaceRectType[] | undefined>();

  const cameraRef = useRef<Camera>(null);

  const devices = useCameraDevices();
  const device = devices.front;

  async function getPermissionAsync() {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();

    if (
      newCameraPermission === 'authorized' &&
      newMicrophonePermission === 'authorized'
    ) {
      setPermissionEnabled(true);
    } else {
      setPermissionEnabled(false);
    }
  }

  useEffect(() => {
    setCameraActive(true);
    getPermissionAsync();

    return () => setCameraActive(false);
  }, []);

  useEffect(() => {
    const processImage = async () => {
      if (imageObject && imageObject.uri) {
        const options = {
          landmarkMode: FaceDetectorLandmarkMode.ALL,
          contourMode: FaceDetectorContourMode.ALL,
        };

        const faces = await FaceDetection.processImage(
          imageObject.uri,
          options,
        );

        const imageSizeResult = calculateImageSize(
          imageObject.width as number,
          imageObject.height as number,
        );

        const faceRectResults: FaceRectType[] = [];

        faces.forEach(face => {
          const faceRect = calculateFaceRectInsideImage(
            face.boundingBox,
            imageSizeResult,
          );

          faceRectResults.push(faceRect);
        });

        setImageSize(imageSizeResult);
        setFaceRects(faceRectResults);

        setIsLoading(false);
      }
    };

    processImage();
  }, [imageObject]);

  async function onTakePicture() {
    setIsLoading(true);
    const photo = await cameraRef?.current?.takePhoto({
      skipMetadata: true,
    });

    setFaceRects(undefined);

    setImageObject({
      height: photo?.width, // TODO: Fix this on PR: https://github.com/mrousavy/react-native-vision-camera/pull/833#ref-issue-1129217258
      width: photo?.height,
      uri: photo?.path,
    });
  }

  if (permissionEnabled === false) {
    return (
      <View style={styles.notDeviceContainer}>
        <Text>No permission to uses camera</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.notDeviceContainer}>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.notDeviceContainer}>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  return (
    <>
      {imageObject && imageSize?.width && imageSize.height ? (
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={{uri: `file://${imageObject.uri}`}}
            style={[
              {
                width: imageSize?.width,
                height: imageSize?.height,
              },
            ]}>
            {faceRects &&
              faceRects.map((rect: FaceRectType, index: number) => (
                <View
                  key={String(index)}
                  style={[
                    styles.box,
                    {
                      width: rect.width,
                      height: rect.height,
                      left: rect.x,
                      top: rect.y,
                    },
                  ]}
                />
              ))}
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            ref={cameraRef}
            orientation="portrait"
            device={device}
            isActive={cameraActive}
            photo={true}
          />
          <Shutter onPress={onTakePicture} disabled={isLoading} />
        </>
      )}
    </>
  );
}

VisionCamera.displayName = 'VisionCamera';
