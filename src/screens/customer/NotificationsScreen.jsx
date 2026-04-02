import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const NOTIFICATIONS = [
  { id: 1, type: "status", title: "Order Status Update", msg: "Your order WA-2024-001 is now being washed.", time: "2 min ago", read: false },
  { id: 2, type: "delivery", title: "Driver Assigned", msg: "Mark has been assigned to deliver your order.", time: "1 hour ago", read: false },
  { id: 3, type: "payment", title: "Payment Received", msg: "₱350.00 payment confirmed via GCash.", time: "3 hours ago", read: false },
  { id: 4, type: "promo", title: "Weekend Promo!", msg: "Get 20% off on all wash & dry services this weekend!", time: "1 day ago", read: true },
  { id: 5, type: "status", title: "Order Complete", msg: "Your order WA-2024-002 is ready for pickup.", time: "2 days ago", read: true },
];

const getTypeStyle = (type) => {
  switch (type) {
    case 'status': return { icon: "cube-outline", bg: 'hsla(224, 82%, 48%, 0.1)', text: colors.primary };
    case 'delivery': return { icon: "bus-outline", bg: 'hsla(174, 79%, 44%, 0.1)', text: colors.accent };
    case 'payment': return { icon: "card-outline", bg: 'hsla(156, 87%, 34%, 0.1)', text: colors.success };
    case 'promo': return { icon: "megaphone-outline", bg: 'hsla(45, 100%, 80%, 0.5)', text: '#A16207' };
    default: return { icon: "notifications-outline", bg: colors.border, text: colors.textSecondary };
  }
};

const NotificationsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.markReadBtn}>
            <Ionicons name="checkmark" size={14} color={colors.primary} />
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {NOTIFICATIONS.map(n => {
            const styleDef = getTypeStyle(n.type);
            return (
              <View key={n.id} style={[styles.notifCard, !n.read && styles.notifCardUnread]}>
                <View style={[styles.iconBox, { backgroundColor: styleDef.bg }]}>
                  <Ionicons name={styleDef.icon} size={20} color={styleDef.text} />
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifHeaderRow}>
                    <Text style={[styles.notifTitle, n.read && styles.notifTitleRead]}>{n.title}</Text>
                    {!n.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMsg} numberOfLines={2}>{n.msg}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  markReadBtn: { flexDirection: 'row', alignItems: 'center' },
  markReadText: { fontSize: 12, fontWeight: '500', color: colors.primary, marginLeft: 4 },

  list: { gap: 12 },
  notifCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, flexDirection: 'row', gap: 12 },
  notifCardUnread: { borderColor: 'hsla(224, 82%, 48%, 0.3)' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1 },
  notifHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  notifTitleRead: { color: colors.textSecondary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  notifMsg: { fontSize: 12, color: colors.textSecondary, marginBottom: 8, lineHeight: 18 },
  notifTime: { fontSize: 10, color: colors.textSecondary, opacity: 0.7 },
});

export default NotificationsScreen;