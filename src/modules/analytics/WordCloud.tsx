import React from 'react';
import ReactWordcloud, { MinMaxPair } from 'react-wordcloud';

import { Dialog } from '@mui/material';

type Props = {
  wordCounts: { [key: string]: number };
  open: boolean;
  onClose: () => void;
};
const WordCloud = ({ wordCounts, open, onClose }: Props): JSX.Element => {
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
    <Dialog open={open} onClose={onClose}>
      <ReactWordcloud words={words} options={options} size={[600, 400]} />
    </Dialog>
  );
};

export default WordCloud;
