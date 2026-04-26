import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NavTab = 'dashboard' | 'marketplace' | 'feed' | 'audit' | 'activity' | 'profile';

const NAV_ITEMS: {
  id: NavTab;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  activeIcon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  screen: keyof RootStackParamList | null;
}[] = [
  { id: 'dashboard',   icon: 'grid-view',      activeIcon: 'grid-view',    label: 'Home',    screen: 'Dashboard'   },
  { id: 'marketplace', icon: 'work-outline',   activeIcon: 'work',         label: 'Jobs',    screen: 'Marketplace' },
  { id: 'feed',        icon: 'newspaper',      activeIcon: 'newspaper',    label: 'News',    screen: 'Feed'        },
  { id: 'audit',       icon: 'troubleshoot',   activeIcon: 'troubleshoot', label: 'Audit',   screen: 'Audit'       },
  { id: 'activity',    icon: 'star-border',    activeIcon: 'star',         label: 'Tasks',   screen: 'Challenges'  },
  { id: 'profile',     icon: 'person-outline', activeIcon: 'person',       label: 'Profile', screen: 'Profile'     },
];

export function BottomNavBar({
  activeTab,
  activeColor = '#22D3EE',
  activeBg    = 'rgba(34,211,238,0.12)',
}: {
  activeTab: NavTab;
  activeColor?: string;
  activeBg?: string;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {NAV_ITEMS.map(item => {
        const isActive = item.id === activeTab;
        return (
          <Pressable
            key={item.id}
            style={[styles.item, isActive && { backgroundColor: activeBg }]}
            onPress={() => {
              if (!isActive && item.screen) {
                // Reset stack so nav bar doesn't slide/push — instant tab switch
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: item.screen }],
                  })
                );
              }
            }}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
          >
            <MaterialIcons
              name={isActive ? item.activeIcon : item.icon}
              size={22}
              color={isActive ? activeColor : 'rgba(100,116,139,0.6)'}
            />
            <Text style={[styles.label, isActive && { color: activeColor }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    backgroundColor: 'rgba(17,24,39,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 2,
    flex: 1,
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
