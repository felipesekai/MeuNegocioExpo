import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';

const Counter = ({ value, onChange, min = 0, max = Number.POSITIVE_INFINITY, label }) => {
  const theme = useTheme();

  const decrement = () => {
    const next = Math.max(min, (value || 0) - 1);
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(max, (value || 0) + 1);
    onChange(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceColor }]}>
      {label ? <Text style={[styles.label, { color: theme.textMuted || theme.textColor }]}>{label}</Text> : null}
      <View style={[styles.controls, { borderColor: theme.borderColor, borderRadius: theme.radius || 10 }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Diminuir quantidade"
          style={[styles.button, { backgroundColor: theme.cardColor }]}
          onPress={decrement}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={[styles.symbol, { color: theme.textColor }]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.value, { color: theme.textColor }]}>{value}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Aumentar quantidade"
          style={[styles.button, { backgroundColor: theme.cardColor }]}
          onPress={increment}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={[styles.symbol, { color: theme.textColor }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
  },
  value: {
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Counter;
