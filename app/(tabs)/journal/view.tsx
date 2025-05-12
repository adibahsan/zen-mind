import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { ArrowLeft, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDate } from '@/utils/dateHelpers';

export default function JournalViewScreen() {
  const { colors, spacing } = useTheme();
  const { journalEntries, deleteJournalEntry } = useAppData();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const entry = journalEntries.find(entry => entry.id === id);
  
  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={{ color: colors.textPrimary }}>Journal entry not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: '/journal/edit',
      params: { id: entry.id }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteJournalEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Journal Entry</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ 
          paddingHorizontal: spacing.md,
          paddingBottom: 40
        }}
      >
        <View style={styles.entryHeader}>
          <Text style={[styles.entryTitle, { color: colors.textPrimary }]}>
            {entry.title}
          </Text>
          <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
            {formatDate(new Date(entry.date))}
          </Text>
        </View>
        
        <Text style={[styles.entryContent, { color: colors.textPrimary }]}>
          {entry.content}
        </Text>
      </ScrollView>
      
      <View style={[styles.actions, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleEdit}
        >
          <Edit color="white" size={20} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={handleDelete}
        >
          <Trash2 color="white" size={20} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryHeader: {
    marginBottom: 24,
  },
  entryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 8,
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  entryContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
});