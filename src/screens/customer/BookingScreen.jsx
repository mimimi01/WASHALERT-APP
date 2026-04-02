import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Card, Button } from '../../components';
import { branches, laundry, createOrder } from '../../services/api';

const { width } = Dimensions.get('window');

const TIME_SLOTS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
  "5:00 PM - 7:00 PM",
];

const BookingScreen = ({ route, navigation }) => {
  const preSelectedServiceId = route.params?.serviceId;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data from API
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableDetergents, setAvailableDetergents] = useState([]);
  const [availableConditioners, setAvailableConditioners] = useState([]);

  // Form State
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTime, setScheduleTime] = useState(TIME_SLOTS[0]);
  const [loadKg, setLoadKg] = useState('5');
  const [selectedDetergent, setSelectedDetergent] = useState('Tide');
  const [selectedConditioner, setSelectedConditioner] = useState('Downy');
  const [requestDelivery, setRequestDelivery] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gcash');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [branchesRes, servicesRes, prefsRes] = await Promise.all([
        branches.getAll(),
        laundry.getServices(),
        laundry.getPreferences(),
      ]);

      setAvailableBranches(branchesRes.branches || []);
      setAvailableServices(servicesRes.services || []);
      setAvailableDetergents(prefsRes.detergents || []);
      setAvailableConditioners(prefsRes.conditioners || []);

      // Handle pre-selected service from Home screen
      if (preSelectedServiceId) {
        const found = servicesRes.services.find(s => s.id === preSelectedServiceId);
        if (found) setSelectedService(found);
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const kg = parseFloat(loadKg) || 0;
    const servicePrice = selectedService?.price || 0;
    const deliveryFee = requestDelivery ? 50 : 0;
    return (servicePrice * kg) + deliveryFee;
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        branchId: selectedBranch.id,
        serviceId: selectedService.id,
        serviceType: selectedService.name,
        scheduleDate: scheduleDate,
        scheduleTime: scheduleTime,
        loadKg: parseFloat(loadKg),
        detergent: selectedDetergent,
        conditioner: selectedConditioner,
        delivery: requestDelivery,
        instructions: specialInstructions,
        paymentMethod: paymentMethod,
        total: calculateTotal(),
      };

      const result = await createOrder(orderData);
      
      Alert.alert(
        'Booking Confirmed!',
        `Your tracking number is ${result.trackingNumber}. You can view the status in the Orders tab.`,
        [{ text: 'View Order', onPress: () => {
          setStep(1);
          navigation.navigate('Orders');
        }}]
      );
    } catch (error) {
      console.error('Booking failed:', error);
      Alert.alert('Error', 'Failed to place booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {['Details', 'Schedule', 'Prefs', 'Pay', 'Confirm'].map((label, i) => (
        <View key={label} style={styles.indicatorItem}>
          <View style={[
            styles.indicatorCircle,
            step >= i + 1 ? styles.indicatorActive : styles.indicatorInactive
          ]}>
            {step > i + 1 ? (
              <Ionicons name="checkmark" size={14} color="#FFF" />
            ) : (
              <Text style={[styles.indicatorText, step >= i + 1 && styles.indicatorTextActive]}>{i + 1}</Text>
            )}
          </View>
          <Text style={[styles.indicatorLabel, step >= i + 1 && styles.indicatorLabelActive]}>{label}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>New Booking</Text>
        
        {renderStepIndicator()}

        {/* STEP 1: BRANCH & SERVICE */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Select Branch</Text>
            <View style={styles.branchGrid}>
              {availableBranches.map((branch) => (
                <TouchableOpacity
                  key={branch.id}
                  style={[
                    styles.branchCard,
                    selectedBranch?.id === branch.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedBranch(branch)}
                >
                  <Ionicons 
                    name="map-marker" 
                    size={20} 
                    color={selectedBranch?.id === branch.id ? colors.primary : colors.textSecondary} 
                  />
                  <View style={styles.branchInfo}>
                    <Text style={styles.branchName}>{branch.name}</Text>
                    <Text style={styles.branchAddress} numberOfLines={1}>{branch.address}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Service Type</Text>
            <View style={styles.serviceGrid}>
              {availableServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    selectedService?.id === service.id && styles.selectedServiceCard
                  ]}
                  onPress={() => setSelectedService(service)}
                >
                  <MaterialCommunityIcons 
                    name={service.icon} 
                    size={28} 
                    color={selectedService?.id === service.id ? colors.white : colors.primary} 
                  />
                  <Text style={[
                    styles.serviceName,
                    selectedService?.id === service.id && styles.selectedCardText
                  ]}>{service.name}</Text>
                  <Text style={[
                    styles.servicePrice,
                    selectedService?.id === service.id && styles.selectedCardPrice
                  ]}>₱{service.price}/kg</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button 
              title="Continue" 
              onPress={() => setStep(2)} 
              disabled={!selectedBranch || !selectedService}
              style={styles.nextButton}
            />
          </View>
        )}

        {/* STEP 2: SELECT SCHEDULE */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.dateSelector}>
              {['Today', 'Tomorrow', 'Other Day'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateBtn, scheduleDate === d && styles.dateBtnActive]}
                  onPress={() => setScheduleDate(d)}
                >
                  <Text style={[styles.dateBtnText, scheduleDate === d && styles.dateBtnTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeCard, scheduleTime === t && styles.selectedTimeCard]}
                  onPress={() => setScheduleTime(t)}
                >
                  <Ionicons 
                    name="time-outline" 
                    size={20} 
                    color={scheduleTime === t ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[styles.timeText, scheduleTime === t && styles.selectedTimeText]}>{t}</Text>
                  {scheduleTime === t && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <Button title="Back" variant="ghost" onPress={() => setStep(1)} style={styles.halfButton} />
              <Button title="Continue" onPress={() => setStep(3)} style={styles.halfButton} />
            </View>
          </View>
        )}

        {/* STEP 3: LOAD SIZE & PREFERENCES */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Load Size (kg)</Text>
            <View style={styles.kgInputContainer}>
              <TextInput
                style={styles.kgInput}
                keyboardType="numeric"
                value={loadKg}
                onChangeText={setLoadKg}
                placeholder="0"
              />
              <Text style={styles.kgUnit}>kg</Text>
            </View>
            <Text style={styles.kgTip}>Standard load is 5-8 kg per machine.</Text>

            <Text style={styles.sectionTitle}>Detergent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {availableDetergents.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.pill, selectedDetergent === d && styles.pillActive]}
                  onPress={() => setSelectedDetergent(d)}
                >
                  <Text style={[styles.pillText, selectedDetergent === d && styles.pillTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Fabric Conditioner</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {availableConditioners.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.pill, selectedConditioner === c && styles.pillActive]}
                  onPress={() => setSelectedConditioner(c)}
                >
                  <Text style={[styles.pillText, selectedConditioner === c && styles.pillTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.deliveryToggleRow}>
              <View>
                <Text style={styles.toggleTitle}>Request Delivery?</Text>
                <Text style={styles.toggleSub}>Flat rate ₱50.00 fee applies.</Text>
              </View>
              <TouchableOpacity
                onPress={() => setRequestDelivery(!requestDelivery)}
                style={[styles.toggleSwitch, requestDelivery && styles.toggleSwitchActive]}
              >
                <View style={[styles.toggleCircle, requestDelivery && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="e.g. Separate whites, use delicate mode..."
            />

            <View style={styles.buttonRow}>
              <Button title="Back" variant="ghost" onPress={() => setStep(2)} style={styles.halfButton} />
              <Button title="Continue" onPress={() => setStep(4)} style={styles.halfButton} />
            </View>
          </View>
        )}

        {/* STEP 4: PAYMENT METHOD */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Choose Payment Method</Text>
            <TouchableOpacity
              style={[styles.paymentCard, paymentMethod === 'gcash' && styles.selectedPaymentCard]}
              onPress={() => setPaymentMethod('gcash')}
            >
              <View style={styles.paymentLeft}>
                <View style={[styles.paymentIconBox, { backgroundColor: '#EBF5FF' }]}>
                  <Ionicons name="card-outline" size={24} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.paymentName}>GCash</Text>
                  <Text style={styles.paymentDesc}>Pay instantly with GCash</Text>
                </View>
              </View>
              {paymentMethod === 'gcash' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentCard, paymentMethod === 'cash' && styles.selectedPaymentCard]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentLeft}>
                <View style={[styles.paymentIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="cash-outline" size={24} color="#15803D" />
                </View>
                <View>
                  <Text style={styles.paymentName}>Cash on Pickup</Text>
                  <Text style={styles.paymentDesc}>Pay at the branch counter</Text>
                </View>
              </View>
              {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <Button title="Back" variant="ghost" onPress={() => setStep(3)} style={styles.halfButton} />
              <Button title="Review Order" onPress={() => setStep(5)} style={styles.halfButton} />
            </View>
          </View>
        )}

        {/* STEP 5: REVIEW & CONFIRM */}
        {step === 5 && (
          <View style={styles.stepContent}>
            <Card style={styles.receiptCard}>
              <Text style={styles.receiptHeader}>Order Summary</Text>
              
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Branch</Text>
                <Text style={styles.receiptValue}>{selectedBranch?.name}</Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Service</Text>
                <Text style={styles.receiptValue}>{selectedService?.name}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Schedule</Text>
                <Text style={styles.receiptValue}>{scheduleDate} | {scheduleTime}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Load Size</Text>
                <Text style={styles.receiptValue}>{loadKg} kg</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Preferences</Text>
                <Text style={styles.receiptValue}>{selectedDetergent}, {selectedConditioner}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Service Total</Text>
                <Text style={styles.receiptValue}>₱{(selectedService?.price * parseFloat(loadKg)).toFixed(2)}</Text>
              </View>

              {requestDelivery && (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Delivery Fee</Text>
                  <Text style={styles.receiptValue}>₱50.00</Text>
                </View>
              )}

              <View style={styles.receiptDivider} />

              <View style={styles.receiptTotalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>₱{calculateTotal().toFixed(2)}</Text>
              </View>

              <View style={styles.paymentInfoRow}>
                <Text style={styles.payInfoLabel}>Payment Method:</Text>
                <Text style={styles.payInfoValue}>{paymentMethod === 'gcash' ? 'GCash' : 'Cash'}</Text>
              </View>
            </Card>

            <View style={styles.buttonRow}>
              <Button title="Back" variant="ghost" onPress={() => setStep(4)} style={styles.halfButton} />
              <Button 
                title={submitting ? "Processing..." : "Place Booking"} 
                onPress={handleConfirmBooking} 
                disabled={submitting}
                style={styles.halfButton} 
              />
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  indicatorItem: {
    alignItems: 'center',
    flex: 1,
  },
  indicatorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  indicatorInactive: {
    backgroundColor: colors.border,
  },
  indicatorText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  indicatorTextActive: {
    color: '#FFF',
  },
  indicatorLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  indicatorLabelActive: {
    color: colors.primary,
  },
  stepContent: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  branchGrid: {
    gap: 12,
  },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(26, 86, 219, 0.04)',
    borderWidth: 1.5,
  },
  branchInfo: {
    marginLeft: 12,
    flex: 1,
  },
  branchName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  branchAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  selectedServiceCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
  },
  selectedCardText: {
    color: '#FFF',
  },
  selectedCardPrice: {
    color: colors.accentLight,
  },
  dateSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dateBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dateBtnTextActive: {
    color: '#FFF',
  },
  timeGrid: {
    gap: 12,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTimeCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(26, 86, 219, 0.02)',
  },
  timeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedTimeText: {
    color: colors.text,
    fontWeight: '700',
  },
  nextButton: {
    marginTop: 32,
  },
  kgInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    height: 60,
  },
  kgInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  kgUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textTertiary,
  },
  kgTip: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  pillScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFF',
  },
  deliveryToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 189, 202, 0.05)',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(22, 189, 202, 0.2)',
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.accent,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    height: 100,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  halfButton: {
    flex: 1,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  selectedPaymentCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(26, 86, 219, 0.02)',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  paymentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  paymentDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  receiptCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  receiptLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: '60%',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  paymentInfoRow: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  payInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  payInfoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
});

export default BookingScreen;