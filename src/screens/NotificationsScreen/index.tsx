import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';

type NotifType = 'match' | 'reminder' | 'achievement' | 'update';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const NOTIFS: Notif[] = [
  {
    id: 'n1',
    type: 'match',
    title: 'New Job Match',
    body: 'You have a 94% match with Senior Product Designer at Stripe.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'achievement',
    title: 'Achievement Unlocked',
    body: 'You completed 7 challenges this week. +500 XP awarded!',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Daily Challenge',
    body: "Today's system design challenge is ready. Keep your streak going!",
    time: '3 hr ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'update',
    title: 'Application Update',
    body: 'Palantir Technologies viewed your application for the AI Research Lead role.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'match',
    title: 'New Job Match',
    body: 'DeepMind is hiring a Research Scientist. Your profile is an 89% match.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'reminder',
    title: 'Profile Incomplete',
    body: 'Add your work experience to improve your match score by up to 30%.',
    time: '3 days ago',
    read: true,
  },
];

const TYPE_META: Record<NotifType, { icon: React.ComponentProps<typeof MaterialIcons>['name']; color: string; bg: string }> = {
  match:       { icon: 'work',             color: '#22D3EE', bg: 'rgba(34,211,238,0.12)' },
  reminder:    { icon: 'alarm',            color: '#FB923C', bg: 'rgba(251,146,60,0.12)'  },
  achievement: { icon: 'military-tech',    color: '#818CF8', bg: 'rgba(129,140,248,0.12)' },
  update:      { icon: 'info-outline',     color: '#34D399', bg: 'rgba(52,211,153,0.12)'  },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const unreadCount = NOTIFS.filter(n => !n.read).length;

  return (
    <View style={styles.root}>
      {/* Background orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
          >
            <MaterialIcons name="arrow-back" size={22} color="rgba(148,163,184,0.9)" />
          </Pressable>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        <Animated.ScrollView
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 24) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Unread section */}
          {NOTIFS.filter(n => !n.read).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NEW</Text>
              {NOTIFS.filter(n => !n.read).map(n => (
                <NotifCard key={n.id} notif={n} />
              ))}
            </View>
          )}

          {/* Earlier section */}
          {NOTIFS.filter(n => n.read).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>EARLIER</Text>
              {NOTIFS.filter(n => n.read).map(n => (
                <NotifCard key={n.id} notif={n} />
              ))}
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

function NotifCard({ notif }: { notif: Notif }) {
  const meta = TYPE_META[notif.type];
  return (
    <Pressable style={[styles.card, notif.read && styles.cardRead]}>
      {!notif.read && <View style={styles.unreadDot} />}
      <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
        <MaterialIcons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{notif.title}</Text>
          <Text style={styles.cardTime}>{notif.time}</Text>
        </View>
        <Text style={styles.cardText}>{notif.body}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  orb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(103,80,164,0.18)',
  },
  orb2: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(34,211,238,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  unreadBadge: {
    backgroundColor: '#F87171',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.5)',
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 12,
  },
  cardRead: {
    opacity: 0.6,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22D3EE',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
  },
  cardTime: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(148,163,184,0.5)',
    flexShrink: 0,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(148,163,184,0.8)',
    lineHeight: 17,
  },
});
