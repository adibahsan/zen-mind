import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { formatDateShort } from '@/utils/dateHelpers';
import { router } from 'expo-router';
import { Calendar, Plus } from 'lucide-react-native';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import EmptyState from '@/components/common/EmptyState';

export default function JournalScreen() {
  const { colors, spacing } = useTheme();
  const { journalEntries, deleteJournalEntry } = useAppData();

  const handleAddEntry = () => {
    router.push('/journal/edit');
  };

  const handleViewEntry = (id: string) => {
    router.push({
      pathname: '/journal/view',
      params: { id }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { marginHorizontal: spacing.md }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Journal</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddEntry}
        >
          <Plus color="white" size={20} />
        </TouchableOpacity>
      </View>

      {journalEntries.length > 0 ? (
        <FlatList
          data={journalEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: spacing.md }
          ]}
          renderItem={({ item }) => (
            <JournalEntryCard
              title={item.title}
              date={formatDateShort(new Date(item.date))}
              preview={item.content.substring(0, 80) + (item.content.length > 80 ? '...' : '')}
              onPress={() => handleViewEntry(item.id)}
            />
          )}
        />
      ) : (
        <EmptyState
          icon={<Calendar color={colors.textSecondary} size={48} />}
          title="No journal entries yet"
          description="Start recording your thoughts and reflections after meditation."
          actionLabel="Add First Entry"
          onAction={handleAddEntry}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
});