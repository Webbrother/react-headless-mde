import * as React from 'react';
import ReactDOM from 'react-dom';
import { Box, ChakraProvider, HStack, Textarea } from '@chakra-ui/react';
import { faBold, faItalic, faCode, faHeading } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { attachment, bold, code, headingLevel1, italic, useTextAreaMarkdownEditor } from '../src';
import { ToolbarButton } from './toolbar-button';

const uploadMock = async () =>
  await new Promise<string>(resolve => {
    setTimeout(() => {
      resolve('https://google.com');
    }, 5000);
  });

export const Demo = () => {
  const { ref } = useTextAreaMarkdownEditor();

  return (
    <ChakraProvider>
      <Box p={3}>
        <HStack py={2}>
          <ToolbarButton onClick={bold}>
            <FontAwesomeIcon icon={faBold} />
          </ToolbarButton>
          <ToolbarButton onClick={italic}>
            <FontAwesomeIcon icon={faItalic} />
          </ToolbarButton>
          <ToolbarButton onClick={code}>
            <FontAwesomeIcon icon={faCode} />
          </ToolbarButton>
          <ToolbarButton onClick={headingLevel1}>
            <FontAwesomeIcon icon={faHeading} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              attachment({ fileName: 'file-name', fileUrlPromise: uploadMock() });
            }}
          >
            +
          </ToolbarButton>
        </HStack>
        <Textarea ref={ref} placeholder="I'm a markdown editor" fontFamily={'monospace'} />
      </Box>
    </ChakraProvider>
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));

export default Demo;
