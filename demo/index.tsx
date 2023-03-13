import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, ChakraProvider, HStack, Textarea } from '@chakra-ui/react';
import { faBold, faItalic, faCode, faHeading, faFile } from '@fortawesome/free-solid-svg-icons';
import { attachment, bold, code, headingLevel1, italic, useTextAreaMarkdownEditor } from '../src';
import { ToolbarButton } from './toolbar-button';
import ReactMarkdown from 'react-markdown';

const uploadMock = async () =>
  await new Promise<string>(resolve => {
    setTimeout(() => {
      resolve('https://example.com');
    }, 1000);
  });

export const Demo = () => {
  const { ref } = useTextAreaMarkdownEditor();
  const [isPreview, setIsPreview] = useState(false);
  const [value, setValue] = useState('');

  return (
    <ChakraProvider>
      <Box p={3}>
        <HStack py={2}>
          <ToolbarButton onClick={bold} icon={faBold} />
          <ToolbarButton onClick={italic} icon={faItalic} />
          <ToolbarButton onClick={code} icon={faCode} />
          <ToolbarButton onClick={headingLevel1} icon={faHeading} />
          <ToolbarButton
            onClick={() => {
              attachment({ fileName: 'file-name.txt', fileUrlPromise: uploadMock() });
            }}
            icon={faFile}
          />

          <ToolbarButton
            onClick={() => {
              setIsPreview(val => !val);
            }}
          >
            Preview
          </ToolbarButton>
        </HStack>

        {isPreview ? (
          <ReactMarkdown>{ref.current?.value ?? ''}</ReactMarkdown>
        ) : (
          <Textarea
            ref={ref}
            value={value}
            onChange={e => {
              setValue(e.target.value);
            }}
            placeholder="I'm a markdown editor"
            fontFamily={'monospace'}
          />
        )}
      </Box>
    </ChakraProvider>
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));

export default Demo;
