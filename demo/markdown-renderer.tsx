import React from 'react';
import { Box, Code, Heading, Image, Link, ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/react';
import { type Components } from 'react-markdown';

// Minimal replacement for the deprecated chakra-ui-markdown-renderer
// (which is hard-wired to Chakra UI v1 internals)
export function chakraMarkdownRenderer(): Components {
  return {
    h1: ({ children }) => (
      <Heading as='h1' size='2xl' my={4}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as='h2' size='xl' my={4}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as='h3' size='lg' my={3}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as='h4' size='md' my={3}>
        {children}
      </Heading>
    ),
    h5: ({ children }) => (
      <Heading as='h5' size='sm' my={2}>
        {children}
      </Heading>
    ),
    h6: ({ children }) => (
      <Heading as='h6' size='xs' my={2}>
        {children}
      </Heading>
    ),
    p: ({ children }) => <Text my={2}>{children}</Text>,
    a: ({ href, children }) => (
      <Link href={href} isExternal color='teal.500'>
        {children}
      </Link>
    ),
    img: ({ src, alt }) => <Image src={src} alt={alt ?? ''} my={2} />,
    ul: ({ children }) => <UnorderedList my={2}>{children}</UnorderedList>,
    ol: ({ children }) => <OrderedList my={2}>{children}</OrderedList>,
    li: ({ children }) => <ListItem>{children}</ListItem>,
    blockquote: ({ children }) => (
      <Box as='blockquote' borderLeft='4px' borderColor='gray.300' pl={4} my={4}>
        {children}
      </Box>
    ),
    code: ({ children }) => <Code>{children}</Code>,
    pre: ({ children }) => (
      <Box as='pre' p={4} my={4} bg='gray.100' borderRadius='md' overflowX='auto' fontSize='sm'>
        {children}
      </Box>
    ),
  };
}
