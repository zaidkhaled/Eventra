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
  TableContainer,
  Alert,
  AlertIcon,
  IconButton,
  useColorModeValue,
  useToast,
  Switch,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

export default function UsersPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://eventra-rhna.onrender.com/api/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(t('failed_to_load_users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [t]);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`https://eventra-rhna.onrender.com/api/users/${id}`);
      toast({
        title: t('user_deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (err) {
      toast({
        title: t('failed_to_delete_user'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.patch(`https://eventra-rhna.onrender.com/api/users/${id}/role`, {
        role: newRole,
      });
      toast({
        title: t('role_updated'),
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (err) {
      toast({
        title: t('failed_to_update_role'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center" color={textColor}>
        {t('manage_users')}
      </Heading>

      {loading ? (
        <Spinner size="xl" color="orange.400" />
      ) : error ? (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      ) : users.length === 0 ? (
        <Text color={textColor}>{t('no_users_found')}</Text>
      ) : (
        <TableContainer bg={cardBg} borderRadius="md" boxShadow="md" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t('name')}</Th>
                <Th>{t('email')}</Th>
                <Th>{t('role')}</Th>
                <Th>{t('created')}</Th>
                <Th>{t('actions')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user: any) => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Switch
                      isChecked={user.role === 'admin'}
                      onChange={() => toggleRole(user._id, user.role)}
                      colorScheme="orange"
                    />
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <IconButton
                      aria-label={t('delete')}
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteUser(user._id)}
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
