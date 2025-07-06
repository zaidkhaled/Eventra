// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>src/app/page.tsx</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


'use client'

import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  useDisclosure, Button
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import EventDetailsModal from '@/components/EventDetailsModal'

export default function HomePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([])
  const [showOnlyBooked, setShowOnlyBooked] = useState(false)

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchUserBookings = async () => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return

    const user = JSON.parse(storedUser)
    try {
      const { data } = await axios.get(`http://localhost:5000/api/bookings/user/${user.id}`)
      const ids = data.map((booking: any) => booking.event._id)
      setBookedEventIds(ids)
    } catch (error) {
      console.error('Error loading user bookings:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchUserBookings()
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  const handleCardClick = (event: any) => {
    setSelectedEvent(event)
    onOpen()
  }

  return (
    <Box>







<Box
  position="relative"
  height="80vh"
  backgroundImage="url('http://localhost:5000/uploads/hero.png')"
  backgroundSize="cover"
  backgroundPosition="center"
>
  {/* Overlay */}
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    bg="rgba(0, 0, 0, 0.5)"
    zIndex={1}
  />

  {/* Text with fade-in animation */}
  <Box
    position="relative"
    zIndex={2}
    height="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    animation="fadeIn 2s ease-in-out"
  >
<Heading
  fontSize={['3xl', '5xl', '6xl']}
  color="#fff100"
  px={6}
  py={4}
  borderRadius="2xl"
  bg="rgba(0, 0, 0, 0.7)"
  border="1px solid rgba(255, 255, 255, 0.3)"
  textShadow="2px 2px 8px rgba(0, 0, 0, 0.9)"
  fontWeight="bold"
>
  {t('welcomeMessage')}
</Heading>
  </Box>
</Box>








      {/* Events Grid */}
<Box p={6}>


{isLoggedIn && (
  <Button
    mb={4}
    colorScheme={showOnlyBooked ? 'gray' : 'teal'}
    onClick={() => setShowOnlyBooked(!showOnlyBooked)}
  >
    {showOnlyBooked ? t('showAllEvents') : t('showOnlyBooked')}
  </Button>
)}




  <SimpleGrid columns={[1, 2, 3]} spacing={6}>
    {events
      .filter((event: any) =>
        showOnlyBooked ? bookedEventIds.includes(event._id) : true
      )
      .map((event: any) => {
        const isBooked = bookedEventIds.includes(event._id)

        return (
          <Box
            key={event._id}
            position="relative"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            onClick={() => handleCardClick(event)}
          >
            {isLoggedIn && isBooked &&(
              <Box
                position="absolute"
                top="0"
                left="0"
                bg="green.500"
                color="white"
                px={2}
                py={1}
                fontSize="xs"
                fontWeight="bold"
                borderBottomRightRadius="md"
              >
                ✅ {t('booked')}
              </Box>
            )}

            <Image
              src={event.image}
              alt={event.title}
              width="100%"
              height="200px"
              objectFit="cover"
            />
            <Box p={4}>
              <Heading size="md">{event.title}</Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {new Date(event.date).toLocaleDateString('en-GB')}
              </Text>
              <Text mt={1}>{event.location}</Text>
              <Text fontSize="sm" mt={2} noOfLines={2}>
                {event.description}
              </Text>
            </Box>
          </Box>
        )
      })}
  </SimpleGrid>
</Box>


      {/* Modal for Event Details */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          event={selectedEvent}
          isLoggedIn={isLoggedIn}
          bookedEventIds={bookedEventIds}
          updateBookings={(eventId) =>
            setBookedEventIds((prev) => [...prev, eventId])
          }
        />
      )}
    </Box>
  )
}
