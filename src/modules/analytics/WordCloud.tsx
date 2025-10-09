import type { MinMaxPair } from 'react-wordcloud';
import ReactWordcloud from 'react-wordcloud';

import { Dialog } from '@mui/material';

import { ANALYTICS_WORDS_CLOUD_MODAL_ID } from '@/config/selectors';

type Props = {
  wordCounts: { [key: string]: number };
  open: boolean;
  onClose: () => void;
};
function WordCloud({
  wordCounts,
  open,
  onClose,
}: Readonly<Props>): JSX.Element {
  const words = Object.entries(wordCounts).map(([text, value]) => ({
    text,
    value,
  }));

  const options = {
    fontSizes: [20, 50] as MinMaxPair,
    rotations: 2.5,
    rotationAngles: [0, 45] as [number, number],
  };

  return (
    <Dialog open={open} onClose={onClose} id={ANALYTICS_WORDS_CLOUD_MODAL_ID}>
      <ReactWordcloud words={words} options={options} size={[600, 400]} />
    </Dialog>
  );
}

export default WordCloud;
