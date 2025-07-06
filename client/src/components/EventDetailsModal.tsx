'use client'

import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Props {
  isOpen: boolean
  onClose: () => void
  event: any
  isLoggedIn: boolean
  bookedEventIds: string[]
  updateBookings: (eventId: string) => void
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  isLoggedIn,
  bookedEventIds,
  updateBookings
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [alreadyBooked, setAlreadyBooked] = useState(false)

  const handleBooking = async () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectToEvent', event._id)
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const { data } = await axios.post('https://eventra-rhna.onrender.com/api/bookings', {
        userId: user.id,
        eventId: event._id
      })
      setQrCode(data.qrCode)
      setShowQRModal(true)
      setAlreadyBooked(true)
      updateBookings(event._id) // ✅ تحديث الحالة في الصفحة الرئيسية
    } catch (err) {
      console.error('Booking error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setAlreadyBooked(bookedEventIds.includes(event._id))
  }, [bookedEventIds, event._id])

  const handleDownloadQR = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${event.title}-QRCode.png`
    link.click()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto" px={4}>
        <ModalHeader>{event.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody  >
          {event.descriptionImages?.length > 0 && (
            <Box overflowX="auto" whiteSpace="nowrap" mb={4}>
              {event.descriptionImages.map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`desc-${index}`}
                  display="inline-block"
                  height="200px"
                  mr={2}
                  borderRadius="md"
                />
              ))}
            </Box>
          )}

          <Text fontWeight="bold">{t('location')}:</Text>
          <Text mb={2}>{event.location}</Text>

          <Text fontWeight="bold">{t('date')}:</Text>
          <Text mb={2}>
            {new Date(event.date).toLocaleDateString('en-GB')}
          </Text>

          <Text fontWeight="bold">{t('description')}:</Text>
          <Text mb={2}>{event.description}</Text>

          {/* نافذة QR Code */}
          <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{event.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign="center">
                <Text mb={2}>{t('bookingConfirmed')}</Text>
                {qrCode && <Image src={qrCode} alt="QR Code" mx="auto" />}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleDownloadQR}>
                  {t('downloadQR')}
                </Button>
                <Button variant="ghost" onClick={() => setShowQRModal(false)}>
                  {t('close')}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ModalBody>

        {!alreadyBooked && (
          <ModalFooter>
            <Button
              colorScheme="orange"
              onClick={handleBooking}
              isLoading={loading}
            >
              {isLoggedIn ? t('bookNow') : t('loginToBook')}
            </Button>
          </ModalFooter>
        )}




{alreadyBooked && (
  <Box mt={4} textAlign="center">
    <Text fontSize="sm" color="green.600" fontWeight="bold" mb={2}>
      ✅ {t('alreadyBooked')}
    </Text>

    {/* QR Code */}
    <Button
      onClick={async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          const { data } = await axios.get(`https://eventra-rhna.onrender.com/api/bookings/user/${user.id}`)
          const booking = data.find((b: any) => b.event._id === event._id)
          if (booking) setQrCode(booking.qrCode)
        } catch (err) {
          console.error('Error loading QR Code:', err)
        }
      }}
      mb={2}
    >
      {qrCode ? t('downloadQR') : t('showQRCode')}
    </Button>

    {qrCode && (
      <>
        <Image src={qrCode} alt="QR Code" mx="auto" maxW="200px" />
        <Button mt={2} onClick={handleDownloadQR}>
          {t('downloadQR')}
        </Button>
      </>
    )}
  </Box>
)}




      </ModalContent>
    </Modal>
  )
}
