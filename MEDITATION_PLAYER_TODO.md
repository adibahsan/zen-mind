# Meditation Player Feature - To-Do List

This document tracks the subtasks required to implement the meditation player feature in the Zen Mind app.

## Core Functionality

-   [ ] **Data Structure**: Define a `MeditationTrack` interface (e.g., `id`, `title`, `description`, `audioUrl`, `duration`, `isDownloaded`, `localPath`).
-   [ ] **UI - Meditation List**:
    -   [ ] Create a screen/component to display a list of available meditations.
    -   [ ] Each list item should show:
        -   [ ] Title
        -   [ ] Duration (if available)
        -   [ ] Download status (icon: cloud-download, check-circle, x-circle for error)
        -   [ ] Download/Play button (context-dependent)
-   [ ] **Data Source**:
    -   [ ] Determine how the list of meditations will be fetched (e.g., hardcoded JSON for now, later from a backend API).
    -   [ ] Implement fetching logic.
-   [ ] **Download Management**:
    -   [ ] Implement download functionality using `expo-file-system`.
    -   [ ] Show download progress.
    -   [ ] Store downloaded files in a designated app directory.
    -   [ ] Update `MeditationTrack`'s `isDownloaded` and `localPath` status.
    -   [ ] Persist download status and local paths (e.g., using AsyncStorage, keyed by `MeditationTrack.id` or `audioUrl`).
    -   [ ] Handle download errors.
    -   [ ] Allow deletion of downloaded files.
-   [ ] **Audio Playback**:
    -   [ ] Implement audio playback using `expo-av`.
    -   [ ] Play from local file if downloaded, otherwise stream (or prompt to download).
    -   [ ] Basic player UI:
        -   [ ] Play/Pause button.
        -   [ ] Progress bar (scrubbable).
        -   [ ] Time elapsed / Total time.
        -   [ ] Display current track title.
    -   [ ] Handle playback states (loading, playing, paused, stopped, error).
    -   [ ] Background audio playback (optional, advanced).
-   [ ] **State Management**:
    -   [ ] Manage the list of meditations and their download/playback states (likely within `AppDataContext` or a new dedicated context).
-   [ ] **Integration**:
    -   [ ] Integrate the meditation list/player into the "Meditate" tab.

## UI/UX Enhancements

-   [ ] **Offline Indicator**: Clearly indicate when a track is available offline.
-   [ ] **Storage Management**: Show how much space downloaded meditations are using (optional).
-   [ ] **Categorization/Filtering**: If many meditations, consider categories or filtering (e.g., by duration, type) (optional, future).
-   [ ] **Loading States**: Implement appropriate loading indicators for fetching list, downloading.
-   [ ] **Error States**: Gracefully handle errors (network, storage, playback).

## Testing

-   [ ] Test downloading various files.
-   [ ] Test playback of downloaded and streamed audio.
-   [ ] Test offline functionality.
-   [ ] Test UI responsiveness and state updates.
-   [ ] Test error handling scenarios.
