import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, ChakraProvider, HStack, Textarea } from '@chakra-ui/react';
import { faBold, faItalic, faCode, faHeading, faImage, faLink } from '@fortawesome/free-solid-svg-icons';
import {
  boldCommand,
  codeCommand,
  codeBlockCommand,
  headingLevel1Command,
  italicCommand,
  strikethroughCommand,
  useTextAreaMarkdownEditor,
  quoteCommand,
  checkedListCommand,
  orderedListCommand,
  unorderedListCommand,
  imageCommand,
  linkCommand,
} from '../src';
import { ToolbarButton } from './toolbar-button';
import ReactMarkdown from 'react-markdown';

export const Demo = () => {
  const { ref, commandController } = useTextAreaMarkdownEditor({
    commandMap: {
      // word logic
      bold: boldCommand,
      code: codeCommand,
      codeBlock: codeBlockCommand,
      italic: italicCommand,
      strikethrough: strikethroughCommand,

      // word complex
      image: imageCommand,
      link: linkCommand,

      // line logic
      headingLevel1: headingLevel1Command,
      quote: quoteCommand,

      // list
      orderedList: orderedListCommand,
      unorderedList: unorderedListCommand,
      checkedList: checkedListCommand,
    },
  });
  const [isPreview, setIsPreview] = useState(false);
  const [value, setValue] = useState('');

  return (
    <ChakraProvider>
      <Box p={3}>
        <HStack py={2}>
          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('bold');
            }}
            icon={faBold}
          />
          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('italic');
            }}
            icon={faItalic}
          />
          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('code');
            }}
            icon={faCode}
          />

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('image');
            }}
            icon={faImage}
          />
          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('link');
            }}
            icon={faLink}
          />

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('headingLevel1');
            }}
            icon={faHeading}
          />
          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('quote');
            }}
          >
            {'>'}
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('codeBlock');
            }}
            icon={faCode}
          />

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('orderedList');
            }}
          >
            ol
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('unorderedList');
            }}
          >
            ul
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commandController.executeCommand('checkedList');
            }}
          >
            xi
          </ToolbarButton>

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
