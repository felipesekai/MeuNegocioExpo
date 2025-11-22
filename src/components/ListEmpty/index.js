import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';

const ListEmpty = ({ message = 'Nada por aqui ainda.' }) => {
  const theme = useTheme();
  return (
    <View style={styles.container} accessible accessibilityRole="text">
      <Text style={[styles.text, { color: theme.textMuted || theme.textColor }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
});

export default ListEmpty;
