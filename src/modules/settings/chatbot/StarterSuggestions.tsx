import { Button, IconButton, Stack, TextField } from '@mui/material';

import { PlusIcon, TrashIcon } from 'lucide-react';

export type InternalSuggestion = { value: string; id: number };

function StarterSuggestions({
  starterSuggestions = [],
  onChange,
}: Readonly<{
  starterSuggestions: InternalSuggestion[];
  onChange: (args: InternalSuggestion[]) => void;
}>) {
  const add = () => {
    // increase id based on last one
    // this works as long as we don't reorder
    const lastId = starterSuggestions.at(-1)?.id ?? 0;
    onChange([
      ...starterSuggestions,
      {
        value: '',
        id: lastId + 1,
      },
    ]);
  };

  const remove = (id: number) => {
    onChange(starterSuggestions.filter(({ id: thisId }) => id !== thisId));
  };

  const edit = (newValue: string, editedId: number) => {
    onChange(
      starterSuggestions.map(({ value, id }) =>
        id === editedId ? { value: newValue, id: editedId } : { value, id },
      ),
    );
  };

  return (
    <Stack gap={1} alignItems="left">
      {starterSuggestions.map(({ value, id }) => (
        <Stack direction="row" gap={1} key={id}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a suggestion here"
            defaultValue={value}
            onChange={(e) => edit(e.target.value, id)}
          />
          <IconButton color="error" onClick={() => remove(id)}>
            <TrashIcon />
          </IconButton>
        </Stack>
      ))}
      <span>
        <Button startIcon={<PlusIcon />} color="primary" onClick={add}>
          Add
        </Button>
      </span>
    </Stack>
  );
}

export default StarterSuggestions;
