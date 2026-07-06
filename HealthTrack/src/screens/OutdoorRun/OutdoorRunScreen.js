import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOutdoorRunData } from '../../api/fitnessService';
import Loader from '../../components/Loader';
import MapView, { Marker, Polyline } from 'react-native-maps'; 
import FilterButton from '../../components/FilterButton';
import { darkMapStyle } from '../../styles/colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function OutdoorRunScreen() {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);
  const user = useSelector((state) => state.auth.user);
  const [ outdoorRuns, setOutdoorRuns ] = React.useState([]);
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ selectedRun, setSelectedRun ] = React.useState(null);
  const [ selectedRunIndex, setSelectedRunIndex ] = React.useState(0);

  const mapRef = React.useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      fetchOutdoorRunData(user.id)
        .then(data => {
          if (isMounted) {
            const runData = data || [];
            setOutdoorRuns(runData);
            setSelectedRun(runData.length > 0 ? runData[0] : null);
            setSelectedRunIndex(0);
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error("Failed to fetch outdoor run data:", error);
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      }
    }, [user?.id])
  );

  const initialRegion = React.useMemo(() => {
    const routeCoords = selectedRun?.routeCoordinates;
    if (!routeCoords || routeCoords.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const totalCoords = routeCoords.length;
    const latitude = routeCoords.reduce((sum, coord) => sum + (coord.latitude || 0), 0) / totalCoords;
    const longitude = routeCoords.reduce((sum, coord) => sum + (coord.longitude || 0), 0) / totalCoords;

    return {
      latitude,
      longitude,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0121,
    };
  }, [selectedRun]);

  const handleRunSelection = React.useCallback((index) => {
    const nextRun = outdoorRuns[index];
    setSelectedRunIndex(index);
    setSelectedRun(nextRun);

    if (mapRef.current && nextRun?.routeCoordinates && nextRun.routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(nextRun.routeCoordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 240, 
          left: 50,
        },
        animated: true,
      });
    }
  }, [mapRef, outdoorRuns]);

  if (isLoading) {
    return <Loader text="Loading map..." />;
  }

  if (outdoorRuns.length === 0) {
    return (
      <View style={styles.noInfoContainer}>
        <Text>No outdoor run data available.</Text>
      </View>
    );
  }

  const validCoordinates = selectedRun?.routeCoordinates || [];

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          userInterfaceStyle={colors.mode}
          customMapStyle={mapStyle(colors)}
        >
          {validCoordinates.length > 0 && (
            <Marker
              key="marker-start-point"
              coordinate={validCoordinates[0]}
              title="Start Position"
              pinColor="green"
            />
          )}

          {validCoordinates.length > 1 && (
            <Marker
              key="marker-end-point"
              coordinate={validCoordinates[validCoordinates.length - 1]}
              title="Finish Line"
              pinColor="red"
            />
          )}

          {validCoordinates.length > 0 && (
            <Polyline
              coordinates={validCoordinates}
              strokeColor="#1E90FF"
              strokeWidth={4}
            />
          )}
        </MapView>

        <View style={styles.overlayCardContainer}>
          <FlatList
            data={outdoorRuns}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `run-tab-${index}`}
            style={styles.pickerList}
            contentContainerStyle={styles.pickerContent}
            renderItem={({ item, index }) => {
              const isSelected = index === selectedRunIndex;
              return (
                <FilterButton 
                  item={{ label: `Run #${index + 1}`, value: index }}
                  isSelected={isSelected}
                  onPress={() => handleRunSelection(index)}
                />
              )
            }}
          />

          {selectedRun && (
            <View style={styles.statsContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>📅 Date</Text>
                <Text style={styles.statValue}>{selectedRun.date || 'N/A'}</Text>
              </View>

              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>🏃 Distance</Text>
                <Text style={styles.statValue}>
                  {selectedRun.distanceKm ? `${selectedRun.distanceKm} km` : '0 km'}
                </Text>
              </View>

              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>⏱️ Duration</Text>
                <Text style={styles.statValue}>
                  {selectedRun.durationMinutes ? `${selectedRun.durationMinutes} min` : '0 min'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const mapStyle = (colors) => (colors.mode === 'light') 
  ? []
  : darkMapStyle;

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  noInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayCardContainer: {
    position: 'absolute',
    bottom: 30, 
    left: 20,
    right: 20,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerList: {
    marginBottom: 12,
    flexGrow: 0,
  },
  pickerContent: {
    paddingHorizontal: 5,
    gap: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 12,
    marginHorizontal: 5,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
})
