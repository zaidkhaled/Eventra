'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Select,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgMain = useColorModeValue('brand.lightBg', 'brand.darkBg');
  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const inputBg = useColorModeValue('white', 'gray.600');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
        role,
      });

      if (res.data?.user && res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('userUpdated')) 

        toast({
          title: t('register_success'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        router.push(res.data.user.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        throw new Error('Missing user or token');
      }
    } catch (err) {
      toast({
        title: t('register_failed'),
        description: t('email_exists_or_invalid'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgMain} display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box position="absolute" top={4} right={4} display="flex" gap="1rem">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Box>

      <Box as="form" onSubmit={handleRegister} bg={cardBg} p={8} rounded="xl" boxShadow="md" w="full" maxW="md">
        <Heading mb={6} textAlign="center" color={textColor}>
          {t('register')}
        </Heading>

        <FormControl mb={4} isRequired>
          <FormLabel color={textColor}>{t('name')}</FormLabel>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} bg={inputBg} color={textColor} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel color={textColor}>{t('email')}</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} bg={inputBg} color={textColor} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel color={textColor}>{t('password')}</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg={inputBg} color={textColor} />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel color={textColor}>{t('role')}</FormLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)} bg={inputBg} color={textColor}>
            <option value="user">{t('user')}</option>
            <option value="admin">{t('admin')}</option>
          </Select>
        </FormControl>

        <Button bg="brand.accent" color="white" _hover={{ bg: '#e78f2c' }} w="full" type="submit" isLoading={isSubmitting}>
          {t('register')}
        </Button>

        <Box mt={4} textAlign="center">
          <Button variant="link" colorScheme="blue" onClick={() => router.push('/login')}>
            {t('have_account_login')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
