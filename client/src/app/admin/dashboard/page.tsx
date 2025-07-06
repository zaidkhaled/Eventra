'use client';

import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
   Switch 
} from '@chakra-ui/react';
import { FaCalendarAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const iconColor = useColorModeValue('orange.400', 'orange.300');

  const [stats, setStats] = useState({ events: 0, users: 0, bookings: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
  isBookingEnabled: true,
  areEventsVisible: true,
  maintenanceMode: false,
});
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://eventra-rhna.onrender.com/api/admin/stats');
        setStats(res.data);
        setError('');
      } catch (err: any) {
        setError(t('failed_to_load_stats'));
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentEvents = async () => {
      try {
        const res = await axios.get('https://eventra-rhna.onrender.com/api/admin/recent-events');
        setRecentEvents(res.data);
      } catch (err) {
        console.error('Error fetching recent events:', err);
      }
    };
    const fetchSettings = async () => {
    try {
      const res = await axios.get('https://eventra-rhna.onrender.com/api/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

    fetchStats();
    fetchRecentEvents();
    fetchSettings();
  }, [t]);

//   const fetchSettings = async () => {
//   try {
//     const res = await axios.get('https://eventra-rhna.onrender.com/api/settings');
//     setSettings(res.data);
//   } catch (err) {
//     console.error('Failed to fetch settings:', err);
//   }
// };



const toggleSetting = async (key: keyof typeof settings) => {
  try {
    const newValue = !settings[key];

    const res = await axios.put('https://eventra-rhna.onrender.com/api/settings', {
      key,
      value: newValue,
    });

    setSettings((prev) => ({
      ...prev,
      [key]: res.data[key],
    }));
  } catch (err) {
    console.error(`Failed to toggle setting ${key}:`, err);
  }
};







  const statCards = [
    { icon: FaCalendarAlt, label: t('events'), count: stats.events },
    { icon: FaUsers, label: t('users'), count: stats.users },
    { icon: FaTicketAlt, label: t('bookings'), count: stats.bookings },
  ];

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center" color={textColor}>
        {t('admin_dashboard')}
      </Heading>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color={iconColor} />
        </Flex>
      ) : error ? (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <>
          {/* إحصائيات سريعة */}
          <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={10}>
            {statCards.map((card, index) => (
              <Flex
                key={index}
                direction="column"
                align="center"
                justify="center"
                bg={cardBg}
                boxShadow="md"
                borderRadius="xl"
                p={6}
              >
                <card.icon size={32} color={iconColor} />
                <Text fontSize="xl" fontWeight="bold" mt={2} color={textColor}>
                  {card.count}
                </Text>
                <Text color={textColor}>{card.label}</Text>
              </Flex>
            ))}
          </SimpleGrid>

          {/* روابط سريعة */}
          <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={10}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg={cardBg}
              boxShadow="md"
              borderRadius="xl"
              p={6}
              onClick={() => router.push('/admin/events')}
              cursor="pointer"
            >
              <FaCalendarAlt size={32} color={iconColor} />
              <Text mt={4} fontWeight="bold" color={textColor}>
                {t('manage_events')}
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="center"
              justify="center"
              bg={cardBg}
              boxShadow="md"
              borderRadius="xl"
              p={6}
              onClick={() => router.push('/admin/bookings')}
              cursor="pointer"
            >
              <FaTicketAlt size={32} color={iconColor} />
              <Text mt={4} fontWeight="bold" color={textColor}>
                {t('manage_bookings')}
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="center"
              justify="center"
              bg={cardBg}
              boxShadow="md"
              borderRadius="xl"
              p={6}
              onClick={() => router.push('/admin/users')}
              cursor="pointer"
            >
              <FaUsers size={32} color={iconColor} />
              <Text mt={4} fontWeight="bold" color={textColor}>
                {t('manage_users')}
              </Text>
            </Flex>
          </SimpleGrid>


{/* 🟠 الإعدادات السريعة */}
<Heading size="md" mt={10} mb={4} color={textColor}>
  {t('quick_settings')}
</Heading>

<SimpleGrid columns={[1, 2, 3]} spacing={6}>
  {/* Toggle Booking */}
  <Flex
    direction="column"
    justify="center"
    bg={cardBg}
    boxShadow="md"
    borderRadius="xl"
    p={6}
  >
    <Flex justify="space-between" align="center" mb={2}>
      <Text fontWeight="bold" color={textColor}>
        {t('toggle_booking')}
      </Text>
      <Switch
        isChecked={settings.isBookingEnabled}
        onChange={() => toggleSetting('isBookingEnabled')}
        colorScheme="orange"
      />
    </Flex>
    <Text fontSize="sm" color="gray.500">
      {t('toggle_booking_desc')}
    </Text>
  </Flex>

  {/* Toggle Event Visibility */}
  <Flex
    direction="column"
    justify="center"
    bg={cardBg}
    boxShadow="md"
    borderRadius="xl"
    p={6}
  >
    <Flex justify="space-between" align="center" mb={2}>
      <Text fontWeight="bold" color={textColor}>
        {t('toggle_events_visibility')}
      </Text>
      <Switch
        isChecked={settings.areEventsVisible}
        onChange={() => toggleSetting('areEventsVisible')}
        colorScheme="orange"
      />
    </Flex>
    <Text fontSize="sm" color="gray.500">
      {t('toggle_events_visibility_desc')}
    </Text>
  </Flex>

  {/* Maintenance Mode */}
  <Flex
    direction="column"
    justify="center"
    bg={cardBg}
    boxShadow="md"
    borderRadius="xl"
    p={6}
  >
    <Flex justify="space-between" align="center" mb={2}>
      <Text fontWeight="bold" color={textColor}>
        {t('maintenance_mode')}
      </Text>
      <Switch
        isChecked={settings.maintenanceMode}
        onChange={() => toggleSetting('maintenanceMode')}
        colorScheme="orange"
      />
    </Flex>
    <Text fontSize="sm" color="gray.500">
      {t('maintenance_mode_desc')}
    </Text>
  </Flex>
</SimpleGrid>



          {/* آخر الفعاليات */}
          <Heading size="md" mt={10} mb={4} color={textColor}>
            {t('recent_events')}
          </Heading>
          <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
            {recentEvents.length === 0 ? (
              <Text color={textColor}>{t('no_events')}</Text>
            ) : (
              recentEvents.map((event, index) => (
                <Box key={index} mb={3}>
                  <Text fontWeight="bold" color={textColor}>{event.title}</Text>
                  <Text fontSize="sm" color={textColor}>{new Date(event.date).toLocaleDateString()}</Text>
                  <Text color={textColor}>{event.description}</Text>
                </Box>
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
}


