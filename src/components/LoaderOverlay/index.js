import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LoaderOverlay = ({ visible, color = '#000', size = 'large' }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.container}>
        <ActivityIndicator color={color} size={size} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
  },
});

export default LoaderOverlay;
