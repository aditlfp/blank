import { BlurView } from 'expo-blur';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

type GlassCardProps = {
  children: React.ReactNode;
  style?: object;
};

// A reusable card component with a Glassmorphism effect.
// On iOS, it uses a BlurView. On Android/Web, it falls back to a semi-transparent background.
export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.cardContainer, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={styles.blurView} />
      ) : (
        <View style={styles.androidFallback} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    // Add other styles for the card itself, like padding, margin, etc.
    // For example:
    padding: 16,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  androidFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white for light mode
    // In a real app, you'd make this color dynamic based on the theme.
  },
});
