import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Input,
  Button,
  ModalFooter,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const ModalAuth = ({
  initialRef,
  finalRef,
  isOpen,
  onClose,
  statusAuth,
  onRegister,
  onLogin,
}) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string()
        .min(2, 'Username too short')
        .max(15, 'Username too long'),
      password: Yup.string()
        .min(6, 'Password too short')
        .max(16, 'Password too long'),
    }),
    onSubmit: values => {
      if (statusAuth === 'login') {
        onLogin(values);
      } else {
        onRegister(values);
      }
    },
  });

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Enter your email..."
              value={formik.values.email}
              name="email"
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: 'red' }}>{formik.errors.email}</div>
            ) : null}
          </FormControl>

          {statusAuth === 'register' && (
            <FormControl mt={4}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter your username..."
                value={formik.values.username}
                name="username"
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username ? (
                <div style={{ color: 'red' }}>{formik.errors.username}</div>
              ) : null}
            </FormControl>
          )}

          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Enter your password..."
              type="password"
              value={formik.values.password}
              name="password"
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: 'red' }}>{formik.errors.password}</div>
            ) : null}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            type="submit"
            onClick={formik.handleSubmit}
          >
            {statusAuth === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalAuth;
