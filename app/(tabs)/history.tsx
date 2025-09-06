import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

interface Log {
  id: string;
  timestamp: {
    toDate: () => Date;
  };
  status: string;
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (user) {
        const q = query(
          collection(firestore, 'attendance_logs'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
        setLogs(userLogs);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [user]);

  if (loading) {
    return <ThemedView style={styles.center}><ActivityIndicator /></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Riwayat Absensi</ThemedText>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.logItem}>
            <ThemedText>Tanggal: {item.timestamp.toDate().toLocaleDateString()}</ThemedText>
            <ThemedText>Waktu: {item.timestamp.toDate().toLocaleTimeString()}</ThemedText>
            <ThemedText>Status: {item.status}</ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>Tidak ada riwayat absensi.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  logItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
