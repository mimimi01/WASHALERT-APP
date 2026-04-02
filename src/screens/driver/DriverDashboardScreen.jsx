import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const TODAY_DELIVERIES = [
  { id: "DEL-001", customer: "Ana Garcia", address: "Unit 5B, Green Residences, Taft Ave, Manila", status: "Pending", order: "WA-2024-010" },
  { id: "DEL-002", customer: "Carlo Mendoza", address: "Block 3, Lot 12, BF Homes, Parañaque", status: "In Progress", order: "WA-2024-011" },
  { id: "DEL-003", customer: "Sofia Reyes", address: "123 Mabini St, Makati City", status: "Completed", order: "WA-2024-009" },
];

const DriverDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.fullName?.split(" ")[0] || "Driver";

  const pending = TODAY_DELIVERIES.filter((d) => d.status === "Pending").length;
  const completed = TODAY_DELIVERIES.filter((d) => d.status === "Completed").length;
  const active = TODAY_DELIVERIES.find((d) => d.status === "In Progress");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.nameText}>{firstName}! 🚚</Text>
        </View>

        {/* Summary Card */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryLabel}>TODAYS SUMMARY</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconBox}>
                <Ionicons name="cube-outline" size={20} color={colors.card} />
              </View>
              <Text style={styles.summaryVal}>{TODAY_DELIVERIES.length}</Text>
              <Text style={styles.summarySub}>Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconBox}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.card} />
              </View>
              <Text style={styles.summaryVal}>{completed}</Text>
              <Text style={styles.summarySub}>Done</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconBox}>
                <Ionicons name="time-outline" size={20} color={colors.card} />
              </View>
              <Text style={styles.summaryVal}>{pending}</Text>
              <Text style={styles.summarySub}>Pending</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Active Delivery */}
        {active && (
          <View style={styles.activeDeliveryBox}>
            <View style={styles.activeHeaderRow}>
              <Ionicons name="bus-outline" size={20} color={colors.accent} />
              <Text style={styles.activeDeliveryTitle}>Active Delivery</Text>
            </View>
            <Text style={styles.activeCustomer}>{active.customer}</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.addressText}>{active.address}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.goBtn}
              onPress={() => navigation.navigate('DeliveriesTab')}
            >
              <Text style={styles.goBtnText}>Go to Delivery</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.card} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.primary }]}>12.5</Text>
            <Text style={styles.statDesc}>km covered today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.success }]}>8</Text>
            <Text style={styles.statDesc}>orders this week</Text>
          </View>
        </View>

        {/* Deliveries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todays Deliveries</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DeliveriesTab')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            {TODAY_DELIVERIES.map(d => (
              <View key={d.id} style={styles.deliveryCard}>
                <View style={styles.delHeader}>
                  <Text style={styles.delCustomer}>{d.customer}</Text>
                  <View style={[
                    styles.statusBadge, 
                    d.status === "Completed" ? styles.statusCompleted : d.status === "In Progress" ? styles.statusActive : styles.statusPending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      d.status === "Completed" ? styles.statusTextCompleted : d.status === "In Progress" ? styles.statusTextActive : styles.statusTextPending
                    ]}>{d.status}</Text>
                  </View>
                </View>
                <View style={[styles.addressRow, { marginTop: 4 }]}>
                  <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.addressText}>{d.address}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 },
  
  header: { marginBottom: 24 },
  greetingText: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  nameText: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  
  summaryCard: { borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  summaryLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginBottom: 12, letterSpacing: 0.5 },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  summaryVal: { fontSize: 24, fontWeight: 'bold', color: colors.card },
  summarySub: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },

  activeDeliveryBox: { backgroundColor: 'hsla(174, 79%, 44%, 0.1)', borderWidth: 2, borderColor: colors.accent, borderRadius: 16, padding: 16, marginBottom: 24 },
  activeHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  activeDeliveryTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginLeft: 8 },
  activeCustomer: { fontSize: 14, fontWeight: '600', color: colors.text },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4, flex: 1 },
  goBtn: { marginTop: 12, width: '100%', height: 40, backgroundColor: colors.accent, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  goBtnText: { fontSize: 14, fontWeight: '600', color: colors.card, marginRight: 4 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statNum: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statDesc: { fontSize: 12, color: colors.textSecondary },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  
  listContainer: { gap: 12 },
  deliveryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  delHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  delCustomer: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusCompleted: { backgroundColor: 'hsla(156, 87%, 34%, 0.1)' },
  statusActive: { backgroundColor: 'hsla(174, 79%, 44%, 0.1)' },
  statusPending: { backgroundColor: 'hsla(16, 100%, 56%, 0.1)' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextCompleted: { color: colors.success },
  statusTextActive: { color: colors.accent },
  statusTextPending: { color: colors.warning },
});

export default DriverDashboardScreen;