'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://eventra-rhna.onrender.com/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6} textAlign="center">
        {t('all_events')}
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {events.map((event) => (
          <Box
            key={event._id}
            bg={cardBg}
            p={4}
            rounded="xl"
            shadow="md"
            transition="all 0.3s"
            _hover={{ shadow: 'lg' }}
          >
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                borderRadius="md"
                mb={3}
                objectFit="cover"
                w="100%"
                h="200px"
              />
            )}
            <Heading fontSize="xl" color={textColor} mb={2}>
              {event.title}
            </Heading>
            <Text color={textColor}>{new Date(event.date).toLocaleDateString()}</Text>
            <Text color={textColor}>{event.location}</Text>
            <Text mt={2} color={textColor}>{event.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
