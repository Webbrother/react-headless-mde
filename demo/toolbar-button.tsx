import React, { type FC } from 'react';
import { Button } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface ToolbarButtonProps {
  onClick: () => void;
  icon?: IconDefinition;
  children?: React.ReactNode;
}

export const ToolbarButton: FC<ToolbarButtonProps> = ({ onClick, icon, children }) => {
  return (
    <Button variant={'outline'} size={'sm'} color={'gray.600'} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </Button>
  );
};
