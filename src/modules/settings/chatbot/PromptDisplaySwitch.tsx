import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { UnionOfConst } from '@graasp/sdk';

import { CodeIcon, SparklesIcon } from 'lucide-react';

export const PromptDisplay = {
  UI: 'ui',
  JSON: 'json',
} as const;
export type PromptDisplayType = UnionOfConst<typeof PromptDisplay>;

export function PromptDisplaySwitch({
  view,
  onChange,
}: Readonly<{
  view: PromptDisplayType;
  onChange: (value: PromptDisplayType) => void;
}>): JSX.Element {
  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      value={view}
      exclusive
      onChange={(_, newValue) => onChange(newValue)}
    >
      <ToggleButton value={PromptDisplay.UI}>
        <SparklesIcon />
      </ToggleButton>
      <ToggleButton value={PromptDisplay.JSON}>
        <CodeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
