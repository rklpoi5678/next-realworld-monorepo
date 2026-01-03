import { Meta } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown';

const meta: Meta = {
  component: DropdownMenu,
};

export default meta;

export const Default = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item One</DropdownMenuItem>
        <DropdownMenuItem>Item Two</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Item Three</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const WithCheckboxItems = () => {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
          Option One
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={checked2} onCheckedChange={setChecked2}>
          Option Two
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const WithRadioItems = () => {
  const [value, setValue] = useState('one');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select an option</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          <DropdownMenuRadioItem value="one">Option One</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two">Option Two</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="three">Option Three</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const WIthSubmenus = () => {
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Item One</DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Sub Item One</DropdownMenuItem>
          <DropdownMenuItem>Sub Item Two</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem>Item Three</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
};
