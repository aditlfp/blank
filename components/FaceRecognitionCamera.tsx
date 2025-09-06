import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import { loadTFLiteModel } from '@tensorflow/tfjs-react-native';

// Higher-order component for camera tensor integration
const TensorCamera = cameraWithTensors(Camera);

interface FaceRecognitionCameraProps {
  onFaceVerified: (embedding: number[]) => void;
}

export function FaceRecognitionCamera({ onFaceVerified }: FaceRecognitionCameraProps) {
  const [detectionModel, setDetectionModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [embeddingModel, setEmbeddingModel] = useState<any | null>(null); // Using 'any' for TFLiteModel for now
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js ready.');

      // Load models
      const detection = blazeface.load();
      const embedding = loadTFLiteModel(require('../assets/models/MobileFaceNet.tflite'));

      const [loadedDetectionModel, loadedEmbeddingModel] = await Promise.all([detection, embedding]);

      setDetectionModel(loadedDetectionModel);
      setEmbeddingModel(loadedEmbeddingModel);
      console.log('All models loaded.');

      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
    const loop = async () => {
      if (detectionModel && embeddingModel) {
        const imageTensor = images.next().value;
        if (imageTensor) {
          const predictions = await detectionModel.estimateFaces(imageTensor, false);

          if (predictions.length > 0) {
            console.log('Face detected. Simulating verification.');
            // Simulate a successful verification and pass a dummy embedding
            onFaceVerified(Array.from({ length: 128 }, () => Math.random()));
          }

          tf.dispose(imageTensor);
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera.</Text></View>;
  }
  if (!model) {
    return <View><Text>Loading Model...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        cameraTextureHeight={1200}
        cameraTextureWidth={1600}
        resizeHeight={200}
        resizeWidth={150}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={false}
      />
      <Text style={styles.infoText}>Face Detection Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  infoText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 4,
    borderRadius: 4,
  },
});
