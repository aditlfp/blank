import { StyleSheet, View, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { setTheme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Pengaturan Tampilan</ThemedText>
      <ThemedText style={styles.subtitle}>Pilih tema aplikasi Anda.</ThemedText>

      <View style={styles.buttonContainer}>
        <Button title="Light Mode" onPress={() => setTheme('light')} />
        <View style={styles.separator} />
        <Button title="Dark Mode" onPress={() => setTheme('dark')} />
      </View>
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
  subtitle: {
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 20,
  }
});
