'use client'
import AuthForm from './auth-form'
import { useState } from "react";
import type { NextPage } from "next";
import { supabase } from '@/lib/client/supabase';

import {
  Flex,
  Box,
  Stack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <AuthForm />
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}