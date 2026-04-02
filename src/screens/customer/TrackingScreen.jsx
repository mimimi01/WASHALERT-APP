import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { bookings as bookingsApi } from '../../services/api';
import { WashingMachineLoader } from '../../components';

const STEPS = [
  { id: 'pending', label: "Order Received", icon: "cube-outline", desc: "Your order has been received by the branch." },
  { id: 'washing', label: "Washing", icon: "water-outline", desc: "Your clothes are being washed with care." },
  { id: 'drying', label: "Drying", icon: "bonfire-outline", desc: "Your clothes are in the dryer now." },
  { id: 'ready', label: "Ready for Pickup", icon: "checkmark-circle-outline", desc: "Your laundry is clean and ready!" },
  { id: 'delivering', label: "Out for Delivery", icon: "bicycle-outline", desc: "Your driver is on the way to deliver." },
  { id: 'delivered', label: "Delivered", icon: "checkmark-done-outline", desc: "Your laundry has been delivered. Enjoy!" },
];

const TrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Order not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);
  const activeStep = currentStepIndex !== -1 ? STEPS[currentStepIndex] : STEPS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Live Tracking</Text>
        <Text style={styles.orderNumber}>{order.trackingNumber}</Text>

        {/* Animation Area */}
        <View style={styles.animationSection}>
          {order.status === 'washing' || order.status === 'drying' ? (
            <WashingMachineLoader size={120} />
          ) : (
            <View style={styles.statusIconBox}>
                <Ionicons name={activeStep.icon} size={80} color={colors.primary} />
            </View>
          )}
          <Text style={styles.activeStatusText}>{activeStep.label}</Text>
          <Text style={styles.activeStatusDesc}>{activeStep.desc}</Text>
        </View>

        {/* ETA Section */}
        <View style={styles.etaCard}>
          <View style={styles.etaInfo}>
            <Text style={styles.etaLabel}>Estimated Completion</Text>
            <Text style={styles.etaValue}>{order.estimatedTime || 'Pending'}</Text>
          </View>
          <View style={styles.etaDivider} />
          <TouchableOpacity style={styles.callBox}>
            <Ionicons name="call" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Status Timeline</Text>
          <View style={styles.timelineWrapper}>
            {STEPS.map((step, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <View key={step.id} style={styles.timelineRow}>
                  <View style={styles.timelineLeading}>
                    <View style={[
                      styles.dot, 
                      isPast || isCurrent ? styles.dotActive : styles.dotInactive
                    ]} />
                    {index < STEPS.length - 1 && (
                      <View style={[
                        styles.line, 
                        isPast ? styles.lineActive : styles.lineInactive
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.stepLabel, 
                      isPast || isCurrent ? styles.stepLabelActive : styles.stepLabelInactive
                    ]}>
                      {step.label}
                    </Text>
                    {isCurrent && <Text style={styles.currentIndicator}>Current Stage</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
        >
          <Text style={styles.detailsBtnText}>View Full Details</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600', color: colors.text, marginLeft: 8 },

  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4 },
  orderNumber: { fontSize: 14, color: colors.textSecondary, marginBottom: 24, fontWeight: '500' },

  animationSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statusIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(26, 86, 219, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeStatusText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  activeStatusDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 18,
  },

  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  etaInfo: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  etaValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 4,
  },
  etaDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  callBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  timelineWrapper: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    height: 50,
  },
  timelineLeading: {
    alignItems: 'center',
    width: 20,
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -10,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  lineInactive: {
    backgroundColor: colors.border,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: colors.text,
  },
  stepLabelInactive: {
    color: colors.textTertiary,
  },
  currentIndicator: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: 'rgba(26, 86, 219, 0.05)',
    borderRadius: 16,
    gap: 8,
  },
  detailsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default TrackingScreen;