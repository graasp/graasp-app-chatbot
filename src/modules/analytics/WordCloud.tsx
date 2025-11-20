import { Dialog } from '@mui/material';

import { scaleLog } from '@visx/scale';
import { Wordcloud as VWordCloud } from '@visx/wordcloud';

import { ANALYTICS_WORDS_CLOUD_MODAL_ID } from '@/config/selectors';

type WordData = {
  text: string;
  value: number;
};

const colors = ['#143059', '#2F6B9A', '#82a6c2'];
const fixedValueGenerator = () => 0.5;

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

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [20, 50],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <Dialog open={open} onClose={onClose} id={ANALYTICS_WORDS_CLOUD_MODAL_ID}>
      <VWordCloud
        words={words}
        width={600}
        height={400}
        fontSize={fontSizeSetter}
        font="Nunito"
        padding={2}
        spiral="archimedean"
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <text
              key={w.text}
              color={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </text>
          ))
        }
      </VWordCloud>
    </Dialog>
  );
}

export default WordCloud;
