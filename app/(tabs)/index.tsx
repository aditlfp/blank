import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { getDistanceInMeters } from '@/utils/geolocation';
import { cosineSimilarity } from '@/utils/math';
import { FaceRecognitionCamera } from '@/components/FaceRecognitionCamera';

export default function HomeScreen() {
  const { user } = useAuth();
  const { location, errorMsg, hasPermission } = useLocation();

  const [geofenceData, setGeofenceData] = useState<{ lat: number; lon: number; radius: number } | null>(null);
  const [storedEmbedding, setStoredEmbedding] = useState<number[] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // In a real app, this data would be fetched from the user's document in Firestore.
        // For now, we use placeholder data as the database is not populated.
        setGeofenceData({
          lat: 34.0522, // Example: Los Angeles
          lon: -118.2437,
          radius: 10000000, // Large radius for testing
        });
        setStoredEmbedding(Array.from({ length: 128 }, () => Math.random())); // Dummy stored embedding
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (location && geofenceData) {
      const dist = getDistanceInMeters(
        location.coords.latitude,
        location.coords.longitude,
        geofenceData.lat,
        geofenceData.lon
      );
      setDistance(dist);
      setIsLoading(false);
    }
  }, [location, geofenceData]);

  const handleFaceVerified = async (newEmbedding: number[]) => {
    setIsVerifying(true);
    if (!storedEmbedding || !user || !location) {
      Alert.alert('Error', 'User data or location not available.');
      setIsVerifying(false);
      return;
    }

    const similarity = cosineSimilarity(newEmbedding, storedEmbedding);
    const SIMILARITY_THRESHOLD = 0.8; // This would be tuned

    if (similarity >= SIMILARITY_THRESHOLD) {
      try {
        await addDoc(collection(firestore, "attendance_logs"), {
          userId: user.uid,
          timestamp: serverTimestamp(),
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          status: 'success',
        });
        Alert.alert('Success', `Attendance recorded for ${user.email}. Similarity: ${similarity.toFixed(2)}`);
      } catch (e) {
        Alert.alert('Error', 'Failed to record attendance.');
      }
    } else {
      Alert.alert('Failure', `Face not recognized. Similarity: ${similarity.toFixed(2)}`);
    }
    setIsVerifying(false);
  };

  const isWithinGeofence = distance !== null && geofenceData !== null && distance <= geofenceData.radius;
  const canAttemptAttendance = hasPermission && isWithinGeofence && !isVerifying;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Absensi</ThemedText>

      <View style={styles.cameraContainer}>
        {canAttemptAttendance ? (
           <FaceRecognitionCamera onFaceVerified={handleFaceVerified} />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <ThemedText style={styles.disabledReasonText}>
              {isLoading && 'Loading...'}
              {!isLoading && (hasPermission ? 'Anda berada di luar area absensi' : 'Izin lokasi dibutuhkan')}
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedText>
        {distance !== null ? `Jarak: ${distance.toFixed(0)}m` : 'Mencari lokasi...'}
      </ThemedText>

      {isVerifying && <ActivityIndicator size="large" style={{ marginTop: 20 }}/>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 60,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledReasonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
  },
});
