'use client';

import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useColorModeValue,
  TableContainer,
  Alert,
  AlertIcon,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from '@chakra-ui/icons';
import Image from 'next/image';

export default function BookingsPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
      setError('');
    } catch (err) {
      setError(t('failed_to_load_bookings'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [t]);

  const deleteBooking = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      toast({
        title: t('booking_deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchBookings(); // تحديث القائمة
    } catch (err) {
      toast({
        title: t('failed_to_delete_booking'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center" color={textColor}>
        {t('manage_bookings')}
      </Heading>

      {loading ? (
        <Spinner size="xl" color="orange.400" />
      ) : error ? (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      ) : bookings.length === 0 ? (
        <Text color={textColor}>{t('no_bookings_found')}</Text>
      ) : (
        <TableContainer bg={cardBg} borderRadius="md" boxShadow="md" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t('user')}</Th>
                <Th>{t('event')}</Th>
                <Th>{t('date')}</Th>
                <Th>QR</Th>
                <Th>{t('actions')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.map((booking: any, index: number) => (
  <Tr key={index}>
    <Td>{booking.user?.name || '—'}</Td>
    <Td>{booking.event?.title || '—'}</Td>
    <Td>
      {booking.createdAt
        ? new Date(booking.createdAt).toLocaleString()
        : '—'}
    </Td>
    <Td>
      {booking.qrCode ? (
        <Image src={booking.qrCode} alt="QR Code" width={64} height={64} />
      ) : (
        <Text fontSize="sm" color="gray.500">No QR</Text>
      )}
    </Td>
    <Td>
      <IconButton
        aria-label={t('delete')}
        icon={<DeleteIcon />}
        size="sm"
        colorScheme="red"
        onClick={() => deleteBooking(booking._id)}
      />
    </Td>
  </Tr>
))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
