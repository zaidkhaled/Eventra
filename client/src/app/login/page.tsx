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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const bgMain = useColorModeValue('brand.lightBg', 'brand.darkBg');
  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const inputBg = useColorModeValue('white', 'gray.600');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      window.dispatchEvent(new Event('userUpdated')) 

      toast({
        title: t('login_success'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      router.push(res.data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast({
        title: t('login_failed'),
        description: t('invalid_credentials'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgMain} display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box position="absolute" top={4} right={4} display="flex" gap="1rem">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Box>

      <Box bg={cardBg} p={8} rounded="xl" boxShadow="md" w="full" maxW="md">
        <Heading mb={6} textAlign="center" color={textColor}>
          {t('login')}
        </Heading>

        <FormControl mb={4}>
          <FormLabel color={textColor}>{t('email')}</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} bg={inputBg} color={textColor} />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel color={textColor}>{t('password')}</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg={inputBg} color={textColor} />
        </FormControl>

        <Button bg="brand.accent" color="white" _hover={{ bg: '#e78f2c' }} w="full" onClick={handleLogin}>
          {t('login')}
        </Button>

        <Box mt={4} textAlign="center">
          <Button variant="link" colorScheme="blue" onClick={() => router.push('/register')}>
            {t('no_account_register')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
