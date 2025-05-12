import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { ArrowLeft, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { JournalEntry } from '@/types';

export default function JournalEditScreen() {
  const { colors, spacing } = useTheme();
  const { journalEntries, addJournalEntry, updateJournalEntry } = useAppData();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const entry = journalEntries.find(entry => entry.id === id);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setIsEditing(true);
      }
    }
  }, [id, journalEntries]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    if (isEditing && id) {
      updateJournalEntry({
        id,
        title,
        content,
        date: new Date().toISOString(),
      });
    } else {
      addJournalEntry({
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
      });
    }
    
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {isEditing ? 'Edit Entry' : 'New Entry'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Check color={colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={{ paddingHorizontal: spacing.md }}>
          <TextInput
            style={[
              styles.titleInput,
              { 
                color: colors.textPrimary,
                borderBottomColor: colors.border
              }
            ]}
            placeholder="Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={[
              styles.contentInput,
              { color: colors.textPrimary }
            ]}
            placeholder="Write your thoughts here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  titleInput: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    textAlignVertical: 'top',
  },
});