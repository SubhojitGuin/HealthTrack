const palette = {
  primary: '#2E7D5B',
  primaryLight: '#4CAF7D',
  primaryDark: '#1B5E3F',
  secondary: '#FF7A59',
};

export const light = {
  mode: 'light',
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  secondary: palette.secondary,
  danger: '#E53935',
  warning: '#F5A623',
  success: '#43A047',

  background: '#F5F7F6',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E1E4E2',
  divider: '#ECEFED',
  shadow: '#0000001A',

  text: '#1A1F1D',
  textSecondary: '#5B6360',
  textMuted: '#8A928F',
  textOnPrimary: '#FFFFFF',

  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#9AA29F',
  statusBar: 'dark',
  welcomeCard: '#7822ce',
  welcomeCardText: '#FFFFFF',
};

export const dark = {
  mode: 'dark',
  primary: palette.primaryLight,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  secondary: palette.secondary,
  danger: '#EF5350',
  warning: '#FFB74D',
  success: '#66BB6A',

  background: '#121513',
  surface: '#292c2a',
  card: '#20241F',
  border: '#2C312D',
  divider: '#262B27',
  shadow: '#00000080',

  text: '#F2F5F3',
  textSecondary: '#B7BEB9',
  textMuted: '#828A85',
  textOnPrimary: '#0E120F',

  tabBarBackground: '#1C201D',
  tabBarInactive: '#6B726E',
  statusBar: 'light',
  welcomeCard: '#7822ce',
  welcomeCardText: '#FFFFFF',
};

export const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];