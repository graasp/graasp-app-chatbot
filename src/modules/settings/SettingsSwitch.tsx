import { FormControlLabel, Switch } from '@mui/material';

type Props = {
  settingKey: string;
  value: boolean;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  disabled?: boolean;
  dataCy?: string;
  changeSetting: (settingKey: string, switchState: boolean) => void;
};

function SettingsSwitch({
  settingKey,
  value,
  label,
  labelPlacement = 'end',
  disabled = false,
  dataCy,
  changeSetting,
}: Readonly<Props>) {
  const switchControl = (
    <Switch
      color="primary"
      checked={value}
      onChange={({ target }) => changeSetting(settingKey, target.checked)}
      disabled={disabled}
      data-cy={dataCy}
    />
  );
  return (
    <FormControlLabel
      control={switchControl}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
}

export default SettingsSwitch;
