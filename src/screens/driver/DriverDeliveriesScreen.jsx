import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const ALL_DELIVERIES = [
  { id: "DEL-001", customer: "Ana Garcia", address: "Unit 5B, Green Residences, Taft Ave, Manila", status: "Pending", order: "WA-2024-010" },
  { id: "DEL-002", customer: "Carlo Mendoza", address: "Block 3, Lot 12, BF Homes, Parañaque", status: "In Progress", order: "WA-2024-011" },
  { id: "DEL-003", customer: "Sofia Reyes", address: "123 Mabini St, Makati City", status: "Completed", order: "WA-2024-009" },
  { id: "DEL-004", customer: "Pedro Penduko", address: "Quezon Ave, Quezon City", status: "Pending", order: "WA-2024-015" },
];

const TABS = ["All", "Pending", "In Progress", "Completed"];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return { bg: 'hsla(16, 100%, 56%, 0.1)', text: colors.warning };
    case 'In Progress': return { bg: 'hsla(174, 79%, 44%, 0.1)', text: colors.accent };
    case 'Completed': return { bg: 'hsla(156, 87%, 34%, 0.1)', text: colors.success };
    default: return { bg: colors.border, text: colors.textSecondary };
  }
};

const DriverDeliveriesScreen = ({ navigation }) => {
  const [tab, setTab] = useState("All");

  const filtered = ALL_DELIVERIES.filter((d) => {
    if (tab === "All") return true;
    return d.status === tab;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollContent}>
        <Text style={styles.headerTitle}>My Deliveries</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tabBtn, tab === t ? styles.tabBtnActive : styles.tabBtnInactive]}
              >
                <Text style={[styles.tabText, tab === t ? styles.tabTextActive : styles.tabTextInactive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Deliveries List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bicycle-outline" size={64} color={colors.border} />
            <Text style={styles.emptyText}>No deliveries found</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {filtered.map((d) => {
              const sColor = getStatusColor(d.status);
              return (
                <View key={d.id} style={styles.deliveryCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.customerName}>{d.customer}</Text>
                    <View style={[styles.badge, { backgroundColor: sColor.bg }]}>
                      <Text style={[styles.badgeText, { color: sColor.text }]}>{d.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.addressText}>{d.address}</Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.orderId}>Order: {d.order}</Text>
                    <TouchableOpacity 
                      style={styles.viewBtn}
                      onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
                    >
                      <Text style={styles.viewBtnText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },

  tabsContainer: { marginBottom: 20 },
  tabsScroll: { gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, borderWidth: 1 },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabBtnInactive: { backgroundColor: colors.card, borderColor: colors.border },
  tabText: { fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: colors.card },
  tabTextInactive: { color: colors.textSecondary },

  listContent: { gap: 12 },
  deliveryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  customerName: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 20 },
  addressText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  orderId: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  
  viewBtn: { flexDirection: 'row', alignItems: 'center' },
  viewBtnText: { fontSize: 12, fontWeight: '600', color: colors.primary, marginRight: 2 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginTop: 16 },
});

export default DriverDeliveriesScreen;