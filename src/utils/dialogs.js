import { Alert } from 'react-native';

export function confirmDialog({ title = 'Confirmar', message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancelar' }) {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: () => {
          if (onCancel) onCancel();
        },
      },
      {
        text: confirmText,
        onPress: () => {
          if (onConfirm) onConfirm();
        },
      },
    ],
    { cancelable: true },
  );
}
