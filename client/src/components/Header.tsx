'use client'

import {
  Box,
  Button,
  Flex,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
  }

  loadUser()

  // ✅ عند تحديث المستخدم
  window.addEventListener('userUpdated', loadUser)

  // ✅ تنظيف الحدث عند إزالة المكون
  return () => {
    window.removeEventListener('userUpdated', loadUser)
  }
}, [])


const handleLogout = () => {
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('userUpdated'))
  window.location.href = '/' // ⬅️ هذا يعيد التوجيه ويعمل reload تلقائي
}



  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      bg="gray.100"
      wrap="wrap"
      direction={['column', 'row']}
    >
      {/* يسار - زر الدخول/الخروج */}
      <Box>
        {user ? (
          <Button size="sm" colorScheme="red" onClick={handleLogout}>
            {t('logout')}
          </Button>
        ) : (
          <Button size="sm" colorScheme="green" onClick={handleLogin}>
            {t('login')}
          </Button>
        )}
      </Box>

      {/* وسط - اسم المستخدم */}
      <Box textAlign="center">
        {user && (
          <Text fontWeight="bold" fontSize="lg" color="teal.700">
            👋 {t('welcomeUser')}, {user.name}
          </Text>
        )}
      </Box>

      {/* يمين - اللغة والثيم */}
      <Flex gap={2}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Flex>
    </Flex>
  )
}
