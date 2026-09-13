import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, ChakraProvider, HStack, Textarea } from '@chakra-ui/react';
import { faBold, faItalic, faCode, faHeading, faImage, faLink, faUpload } from '@fortawesome/free-solid-svg-icons';
import {
  // hook
  useTextAreaMarkdownEditor,
  // commands
  BoldCommand,
  CodeCommand,
  CodeBlockCommand,
  HeadingLevel1Command,
  ItalicCommand,
  StrikethroughCommand,
  QuoteCommand,
  CheckedListCommand,
  OrderedListCommand,
  UnorderedListCommand,
  ImageCommand,
  LinkCommand,
} from '../src';
import { ToolbarButton } from './toolbar-button';
import { AttachmentCommand } from './attachment-command';
import { WrapTextCommand } from './wrap-text-command';
import ReactMarkdown from 'react-markdown';
import { chakraMarkdownRenderer } from './markdown-renderer';

export const Demo = () => {
  const { ref, commands } = useTextAreaMarkdownEditor({
    commandMap: {
      // word logic
      bold: BoldCommand,
      code: CodeCommand,
      codeBlock: CodeBlockCommand,
      italic: ItalicCommand,
      strikethrough: StrikethroughCommand,

      // word complex
      image: ImageCommand,
      link: LinkCommand,

      // line logic
      headingLevel1: HeadingLevel1Command,
      quote: QuoteCommand,

      // list
      orderedList: OrderedListCommand,
      unorderedList: UnorderedListCommand,
      checkedList: CheckedListCommand,

      // command with a context (see demo/attachment-command.ts)
      attachment: AttachmentCommand,
      wrapText: WrapTextCommand,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [value, setValue] = useState('');

  return (
    <ChakraProvider>
      <Box p={3}>
        <HStack py={2}>
          <ToolbarButton
            onClick={() => {
              commands.bold();
            }}
            icon={faBold}
          />
          <ToolbarButton
            onClick={() => {
              commands.italic();
            }}
            icon={faItalic}
          />
          <ToolbarButton
            onClick={() => {
              commands.code();
            }}
            icon={faCode}
          />
          <ToolbarButton
            onClick={() => {
              commands.codeBlock();
            }}
            icon={faCode}
          />

          <ToolbarButton
            onClick={() => {
              commands.image();
            }}
            icon={faImage}
          />
          <ToolbarButton
            onClick={() => {
              commands.link();
            }}
            icon={faLink}
          />

          <ToolbarButton
            onClick={() => {
              fileInputRef.current?.click();
            }}
            icon={faUpload}
          />
          <input
            type='file'
            hidden
            ref={fileInputRef}
            onChange={e => {
              const file = e.target.files?.[0];

              if (file) {
                // Fake upload: resolves with a random image URL after a short delay,
                // so the `![Uploading...]()` placeholder is visible in the editor
                // and the image actually shows up in the Preview tab.
                // Calling `commands.attachment()` without the argument
                // is a compile-time error (see issue #22).
                const fakeUpload = new Promise<string>(resolve => {
                  setTimeout(() => {
                    // a random image URL, unique on every upload
                    resolve(`https://picsum.photos/600/400?random=${Date.now()}`);
                  }, 800);
                });

                commands.attachment(fakeUpload);
              }

              // allow picking the same file again
              e.target.value = '';
            }}
          />

          <ToolbarButton
            onClick={() => {
              commands.headingLevel1();
            }}
            icon={faHeading}
          />
          <ToolbarButton
            onClick={() => {
              commands.quote();
            }}
          >
            {'>'}
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commands.orderedList();
            }}
          >
            ol
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commands.unorderedList();
            }}
          >
            ul
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              commands.checkedList();
            }}
          >
            xi
          </ToolbarButton>

          {/* A command with a simple context: wraps the word at the caret with the
              given string on both sides. `commands.wrapText()` without the argument
              is a compile-time error. */}
          <ToolbarButton
            onClick={() => {
              commands.wrapText('!!!');
            }}
          >
            !!!
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
          <ReactMarkdown components={chakraMarkdownRenderer()}>{ref.current?.value ?? ''}</ReactMarkdown>
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

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<Demo />);
}

export default Demo;
