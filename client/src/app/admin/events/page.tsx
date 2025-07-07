'use client';

import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Button,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface EventType {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  descriptionImages?: string[];
}

export default function AdminEventsPage() {
  const { t } = useTranslation();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
const [formData, setFormData] = useState({
  title: '',
  description: '',
  location: '',
  date: '',
  newImageFile: null as File | string | null,
  newDescriptionImages: [] as (File | string)[],
});

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    imageFile: null as File | null,
    descriptionImages: [] as File[]
  });

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://eventra-rhna.onrender.com/api/events');
      setEvents(res.data);
    } catch (err) {
      toast({
        title: t('failed_to_load_events'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (event: EventType) => {
    setSelectedEvent(event);
 setFormData({
    title: event.title,
    description: event.description,
    location: event.location,
    date: event.date,
    newImageFile: event.image || null,
    newDescriptionImages: event.descriptionImages || [],
    });
    onEditOpen();
  };












const handleSaveEdit = async () => {
  if (!selectedEvent) return;

  // 1. ارفع صورة الغلاف إذا كانت جديدة
  let uploadedCoverImage = selectedEvent.image;
  if (formData.newImageFile instanceof File) {
    const res = await uploadToCloudinary(formData.newImageFile);
  if (res) {
    uploadedCoverImage = res;
  }
  }

  // 2. ارفع الصور الوصفية الجديدة
  const newDescImageUrls: string[] = [];
  for (const img of formData.newDescriptionImages) {
    if (img instanceof File) {
      const res = await uploadToCloudinary(img);
      if (res) newDescImageUrls.push(res);
    }
  }

  // 3. أرسل البيانات إلى الباك
  try {
    await axios.put(`https://eventra-rhna.onrender.com/api/events/${selectedEvent._id}`, {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      image: uploadedCoverImage,
      newDescriptionImages: newDescImageUrls,
    });

    toast({
      title: t('event_updated'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onEditClose();
    fetchEvents();
  } catch (err) {
    toast({
      title: t('failed_to_update_event'),
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


















// const handleSaveEdit = async () => {
//   if (!selectedEvent) return;

//   const updatedFormData = new FormData();
//   updatedFormData.append('title', formData.title);
//   updatedFormData.append('description', formData.description);
//   updatedFormData.append('location', formData.location);
//   updatedFormData.append('date', formData.date);

//   if (formData.newImageFile) {
//     updatedFormData.append('image', formData.newImageFile);
//   }

//   if (formData.newDescriptionImages) {


    
// formData.newDescriptionImages.forEach((file) => {
//   if (file instanceof File) {
//     updatedFormData.append('descriptionImages', file);
//   }
// });

//   }

//   try {
//     const res = await axios.put(`https://eventra-rhna.onrender.com/api/events/${selectedEvent._id}`, updatedFormData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     toast({
//       title: t('event_updated'),
//       status: 'success',
//       duration: 3000,
//       isClosable: true,
//     });
//     onEditClose();
//     fetchEvents();
//   } catch (err) {
//     toast({
//       title: t('failed_to_update_event'),
//       status: 'error',
//       duration: 3000,
//       isClosable: true,
//     });
//   }
// };





const handleDeleteEvent = async (id: string) => {
  try {
    await axios.delete(`https://eventra-rhna.onrender.com/api/events/${id}`);
    toast({
      title: t('event_deleted'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    fetchEvents(); // تحديث القائمة
  } catch (err) {
    toast({
      title: t('event_delete_failed'),
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


const handleDeleteDescriptionImage = async (eventId: string, imageUrl: string) => {
  try {
    const res = await axios.put(`https://eventra-rhna.onrender.com/api/events/${eventId}/remove-description-image`, {
      imageUrl,
    });

    setEvents((prev) =>
      prev.map((event) =>
        event._id === eventId
          ? { ...event, descriptionImages: res.data.descriptionImages }
          : event
      )
    );

    toast({
      title: t('image_deleted'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    toast({
      title: t('failed_to_delete_image'),
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


const handleDeleteCoverImage = async (eventId: string) => {
  try {
    const res = await axios.put(`https://eventra-rhna.onrender.com/api/events/${eventId}/remove-cover`);
    setEvents((prev) =>
      prev.map((event) =>
        event._id === eventId ? { ...event, image: '' } : event
      )
    );
    toast({
      title: t('cover_image_deleted'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    toast({
      title: t('failed_to_delete_cover'),
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};












const handleCreateEvent = async () => {
  try {
    // 1. رفع صورة الغلاف
    let coverImageUrl = '';
    if (newEvent.imageFile) {
      const coverForm = new FormData();
      coverForm.append('file', newEvent.imageFile);
      const coverRes = await axios.post('https://eventra-rhna.onrender.com/api/upload', coverForm);
      coverImageUrl = coverRes.data.url;
    }

    // 2. رفع الصور الوصفية
    const descriptionImageUrls: string[] = [];
    for (const file of newEvent.descriptionImages) {
      const descForm = new FormData();
      descForm.append('file', file);
      const descRes = await axios.post('https://eventra-rhna.onrender.com/api/upload', descForm);
      descriptionImageUrls.push(descRes.data.url);
    }

    // 3. إرسال بيانات الفعالية مع روابط الصور
    await axios.post('https://eventra-rhna.onrender.com/api/events/with-images', {
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      date: newEvent.date,
      image: coverImageUrl,
      descriptionImages: descriptionImageUrls,
    });

    toast({ title: t('event_created'), status: 'success', duration: 3000, isClosable: true });

    setNewEvent({
      title: '',
      description: '',
      location: '',
      date: '',
      imageFile: null,
      descriptionImages: [],
    });

    onAddClose();
    fetchEvents();
  } catch (err) {
    toast({ title: t('event_create_failed'), status: 'error', duration: 3000, isClosable: true });
  }
};



















// const handleCreateEvent = async () => {



//   const formData = new FormData();
//   formData.append('title', newEvent.title);
//   formData.append('description', newEvent.description);
//   formData.append('location', newEvent.location);
//   formData.append('date', newEvent.date);

//   if (newEvent.imageFile) {
//     formData.append('image', newEvent.imageFile);
//   }

//   // إضافة الصور الوصفية المتعددة
//   newEvent.descriptionImages.forEach((file, index) => {
//     formData.append('descriptionImages', file); // ملاحظة: نفس الاسم ليقرأها multer كـ array
//   });

//   try {
//     const res = await axios.post('https://eventra-rhna.onrender.com/api/events/with-images', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     toast({
//       title: t('event_created'),
//       status: 'success',
//       duration: 3000,
//       isClosable: true,
//     });

//     setNewEvent({
//       title: '',
//       description: '',
//       location: '',
//       date: '',
//       imageFile: null,
//       descriptionImages: [],
//     });

//     onAddClose();
//     fetchEvents();
//   } catch (err) {
//     toast({
//       title: t('event_create_failed'),
//       status: 'error',
//       duration: 3000,
//       isClosable: true,
//     });
//   }
// };

// const uploadToCloudinary = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', 'eventra_unsigned'); // استبدل بقيمتك من Cloudinary

//   try {
//     const res = await axios.post('https://api.cloudinary.com/v1_1/daqgjgomk/image/upload', formData);
//     return res.data;
//   } catch (err) {
//     console.error('Upload failed', err);
//     return null;
//   }
// };













const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'eventra_unsigned');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/daqgjgomk/image/upload',
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      },
    }
  );

  setUploadProgress(null);
  return response.data.secure_url;
};




  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color={textColor}>{t('manage_events')}</Heading>
        <Button colorScheme="orange" onClick={onAddOpen}>
          {t('add_event')}
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {events.map((event) => (
          <Box key={event._id} bg={cardBg} borderRadius="md" p={4} boxShadow="md">
{event.image && (
  <Box position="relative" mb={2}>
    <Image
      src={event.image}
      alt={event.title}
      borderRadius="md"
      width="100%"
      height="200px"
      objectFit="cover"
    />
    <Button
      size="xs"
      colorScheme="red"
      position="absolute"
      top="5px"
      right="5px"
      onClick={() => handleDeleteCoverImage(event._id)}
    >
      X
    </Button>
  </Box>
)}

<SimpleGrid columns={{ base: 1, md: 5 }} spacing={3} mt={3}>
  {event.descriptionImages?.map((imgUrl, idx) => (
    <Box key={idx} position="relative">
      <Image
        src={imgUrl}
        alt={`desc-${idx}`}
        borderRadius="md"
        width="100%"
        height="150px"
        objectFit="cover"
      />
      <Button
        size="xs"
        colorScheme="red"
        position="absolute"
        top="5px"
        right="5px"
        onClick={() => handleDeleteDescriptionImage(event._id, imgUrl)}
      >
        X
      </Button>
    </Box>
  ))}
</SimpleGrid>

            <Text fontWeight="bold" fontSize="xl" color={textColor}>
              {event.title}
            </Text>
            <Text color="gray.400" fontSize="sm">
              {new Date(event.date).toLocaleString()}
            </Text>
            <Text mt={2} color={textColor}>
              {event.description}
            </Text>

            <Button mt={4} colorScheme="blue" onClick={() => handleEditClick(event)}>
              {t('edit')}
            </Button>
              <Button
  mt={4}
  colorScheme="red"
  onClick={() => handleDeleteEvent(event._id)}
>
  {t('delete')}
</Button>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('edit_event')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input name="title" value={formData.title} onChange={handleChange} mb={3} placeholder={t('title')} />
            <Textarea name="description" value={formData.description} onChange={handleChange} mb={3} placeholder={t('description')} />
            <Input name="location" value={formData.location} onChange={handleChange} mb={3} placeholder={t('location')} />
            <Input type="datetime-local" name="date" value={formData.date} onChange={handleChange} />

<Input
  type="file"
  accept="image/*"
  mb={3}
  onChange={(e) =>
    setFormData((prev: any) => ({
      ...prev,
      newImageFile: e.target.files?.[0] || null,
    }))
  }
/>








<Input
  type="file"
  accept="image/*"
  multiple
  mb={3}
  onChange={(e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 10) {
      toast({
        title: t('max_10_images'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      newDescriptionImages: selectedFiles,
    }));
  }}
/>











          </ModalBody>
          <ModalFooter flexDirection="column" alignItems="flex-start">
            {uploadProgress !== null && (
  <Box mb={3} w="100%">
    <Text fontSize="sm" mb={1}>Uploading: {uploadProgress}%</Text>
    <Box w="100%" bg="gray.200" borderRadius="md" overflow="hidden">
      <Box h="8px" bg="green.400" width={`${uploadProgress}%`} transition="width 0.3s" />
    </Box>
  </Box>
)}
            <Button colorScheme="orange" onClick={handleSaveEdit}>{t('save')}</Button>
            <Button onClick={onEditClose} ml={3}>{t('cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('add_event')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input name="title" value={newEvent.title} onChange={handleNewChange} mb={3} placeholder={t('title')} />
            <Textarea name="description" value={newEvent.description} onChange={handleNewChange} mb={3} placeholder={t('description')} />
            <Input name="location" value={newEvent.location} onChange={handleNewChange} mb={3} placeholder={t('location')} />
            <Input type="datetime-local" name="date" value={newEvent.date} onChange={handleNewChange} mb={3} />
            <Input
              type="file"
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  imageFile: e.target.files?.[0] || null,
                }))
              }
            />
<Input
  type="file"
  accept="image/*"
  multiple
  mb={3}
  onChange={(e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 10) {
      toast({
        title: t('max_10_images'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setNewEvent((prev) => ({
      ...prev,
      descriptionImages: selectedFiles,
    }));
  }}
/>

<Text fontSize="sm" color="gray.500">
  {t('you_can_upload_multiple_description_images')}
</Text>


          </ModalBody>
          <ModalFooter flexDirection="column" alignItems="flex-start">
  {uploadProgress !== null && (
    <Box mb={3} w="100%">
      <Text fontSize="sm" mb={1}>Uploading: {uploadProgress}%</Text>
      <Box w="100%" bg="gray.200" borderRadius="md" overflow="hidden">
        <Box h="8px" bg="green.400" width={`${uploadProgress}%`} transition="width 0.3s" />
      </Box>
    </Box>
  )}
  <Flex w="100%" justify="flex-end">
    <Button colorScheme="green" onClick={handleCreateEvent}>{t('create')}</Button>
    <Button onClick={onAddClose} ml={3}>{t('cancel')}</Button>
  </Flex>
</ModalFooter>

        </ModalContent>
      </Modal>
    </Box>
  );
}
