import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const DELIVERY_DATA = {
  id: "DEL-001", customer: "Ana Garcia", phone: "09171234567",
  address: "Unit 5B, Green Residences, Taft Ave, Manila",
  order: "WA-2024-010", items: "Wash & Dry • 5 kg", instructions: "Leave at the lobby guard",
  status: "Pending",
  timeline: [
    { step: "Assigned", time: "9:00 AM", done: true },
    { step: "Picked Up", time: "", done: false },
    { step: "In Transit", time: "", done: false },
    { step: "Delivered", time: "", done: false },
  ],
};

const DeliveryDetailScreen = ({ route, navigation }) => {
  const delivery = DELIVERY_DATA; // mock
  const [status, setStatus] = useState(delivery.status);
  const [showConfirm, setShowConfirm] = useState(null);
  
  const handleAction = (action) => {
    setShowConfirm(null);
    if (action === "pickup") setStatus("In Progress");
    else if (action === "deliver") setStatus("Completed");
  };

  const openMaps = () => {
    // Note: Linking handles url perfectly in RN
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{delivery.customer}</Text>
        <Text style={styles.orderId}>{delivery.id}</Text>

        {/* Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.addressRowBlock}>
            <Ionicons name="location" size={16} color={colors.primary} style={{ marginTop: 2 }} />
            <Text style={styles.addressText}>{delivery.address}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert("Success", "Address Copied!")}>
              <Ionicons name="copy-outline" size={14} color={colors.primary} />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <View style={styles.infoRow}><Text style={styles.infoKey}>Order #</Text><Text style={styles.infoVal}>{delivery.order}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoKey}>Items</Text><Text style={styles.infoVal}>{delivery.items}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoKey}>Phone</Text><Text style={styles.infoVal}>{delivery.phone}</Text></View>
          
          {delivery.instructions ? (
            <View style={styles.instructionsBox}>
              <View style={styles.insRow}>
                <Ionicons name="warning" size={14} color={colors.warning} />
                <Text style={styles.insTitle}>Special Instructions</Text>
              </View>
              <Text style={styles.insBody}>{delivery.instructions}</Text>
            </View>
          ) : null}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Status</Text>
          <View style={styles.timelineCol}>
            {delivery.timeline.map((t, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineIconArea}>
                  <View style={[styles.timeDot, t.done ? styles.timeDotActive : styles.timeDotInactive]} />
                  {i < delivery.timeline.length - 1 && (
                    <View style={[styles.timeLine, t.done ? styles.timeLineActive : styles.timeLineInactive]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineStep, t.done ? styles.timelineStepActive : styles.timelineStepInactive]}>{t.step}</Text>
                  {t.time ? <Text style={styles.timelineTime}>{t.time}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.mapBtn} onPress={openMaps}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
            <Text style={styles.mapBtnText}>Open in Maps</Text>
          </TouchableOpacity>

          {status === "Pending" && (
            showConfirm === "pickup" ? (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmTitle}>Confirm pickup of this order?</Text>
                <View style={styles.confirmRowBtn}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(null)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.primaryConfirmBtn} onPress={() => handleAction("pickup")}><Text style={styles.primaryConfirmBtnText}>Confirm</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => setShowConfirm("pickup")}>
                <Ionicons name="cube" size={20} color={colors.card} />
                <Text style={styles.actionBtnTextPrimary}>Mark as Picked Up</Text>
              </TouchableOpacity>
            )
          )}

          {status === "In Progress" && (
            showConfirm === "deliver" ? (
              <View style={styles.confirmBoxSuccess}>
                <Text style={styles.confirmTitle}>Confirm delivery to customer?</Text>
                <View style={styles.confirmRowBtn}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(null)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.successConfirmBtn} onPress={() => handleAction("deliver")}><Text style={styles.primaryConfirmBtnText}>Confirm</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.actionBtnSuccess} onPress={() => setShowConfirm("deliver")}>
                <Ionicons name="bus" size={20} color={colors.card} />
                <Text style={styles.actionBtnTextPrimary}>Mark as Delivered</Text>
              </TouchableOpacity>
            )
          )}

          {status === "Completed" && (
            <View style={styles.completedBox}>
              <Ionicons name="checkmark" size={20} color={colors.success} />
              <Text style={styles.completedBoxText}>Delivered Successfully</Text>
            </View>
          )}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '500', color: colors.text, marginLeft: 8 },

  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  orderId: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },

  card: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 12 },

  addressRowBlock: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  addressText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  copyText: { fontSize: 12, fontWeight: '500', color: colors.primary, marginLeft: 4 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoKey: { fontSize: 14, color: colors.textSecondary },
  infoVal: { fontSize: 14, fontWeight: '500', color: colors.text },
  
  instructionsBox: { backgroundColor: 'hsla(16, 100%, 56%, 0.1)', borderWidth: 1, borderColor: 'hsla(16, 100%, 56%, 0.2)', borderRadius: 12, padding: 12, marginTop: 12 },
  insRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  insTitle: { fontSize: 12, fontWeight: 'bold', color: colors.warning, marginLeft: 6 },
  insBody: { fontSize: 12, color: colors.text },

  timelineCol: { paddingTop: 8 },
  timelineRow: { flexDirection: 'row' },
  timelineIconArea: { width: 24, alignItems: 'center', marginRight: 12 },
  timeDot: { width: 12, height: 12, borderRadius: 6 },
  timeDotActive: { backgroundColor: colors.primary },
  timeDotInactive: { backgroundColor: colors.border },
  timeLine: { width: 2, height: 24 },
  timeLineActive: { backgroundColor: colors.primary },
  timeLineInactive: { backgroundColor: colors.border },
  timelineContent: { paddingBottom: 16 },
  timelineStep: { fontSize: 14, fontWeight: '500' },
  timelineStepActive: { color: colors.text },
  timelineStepInactive: { color: colors.textSecondary },
  timelineTime: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },

  actionsBox: { gap: 12 },
  mapBtn: { height: 52, borderWidth: 1, borderColor: colors.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  mapBtnText: { color: colors.primary, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  actionBtnPrimary: { height: 52, backgroundColor: colors.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnSuccess: { height: 52, backgroundColor: colors.success, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnTextPrimary: { color: colors.card, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  confirmBox: { backgroundColor: 'hsla(16, 100%, 56%, 0.1)', borderWidth: 1, borderColor: 'hsla(16, 100%, 56%, 0.2)', borderRadius: 12, padding: 16 },
  confirmBoxSuccess: { backgroundColor: 'hsla(156, 87%, 34%, 0.1)', borderWidth: 1, borderColor: 'hsla(156, 87%, 34%, 0.2)', borderRadius: 12, padding: 16 },
  confirmTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 12, textAlign: 'center' },
  confirmRowBtn: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, height: 40, borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  primaryConfirmBtn: { flex: 1, height: 40, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  successConfirmBtn: { flex: 1, height: 40, backgroundColor: colors.success, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryConfirmBtnText: { color: colors.card, fontSize: 14, fontWeight: 'bold' },

  completedBox: { height: 52, backgroundColor: 'hsla(156, 87%, 34%, 0.1)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  completedBoxText: { color: colors.success, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default DeliveryDetailScreen;