import { Button, Col, Row } from 'antd';

type VirtualKeyboardProps = {
  word: string;
  inputValue: string;
};

function VirtualKeyboard({
  word,
  inputValue,
}: VirtualKeyboardProps): React.ReactElement | null {
  const englishLetters = 'abcdefghijklmnopqrstuvwxyz';
  const russianLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const alphabet = /[а-яё]/i.test(word) ? russianLetters : englishLetters;
  const nextLetter = word[inputValue.length];
  // todo refactor
  if (!nextLetter) return null;

  let randomLetters = '';
  while (randomLetters.length < 3) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (
      randomLetters.indexOf(randomLetter) === -1 &&
      randomLetter !== nextLetter
    ) {
      randomLetters += randomLetter;
    }
  }
  const buttons = [nextLetter, ...randomLetters]
    .sort(() => 0.5 - Math.random())
    .map((letter) => letter.toUpperCase());

  const handleButtonClick = (letter: string) => {
    const event = new KeyboardEvent('keydown', {
      key: letter,
    });

    document.dispatchEvent(event);
  };

  return (
    <Row gutter={[7, 7]} justify="center" align="middle">
      {buttons.map((letter) => (
        <Col span={6} key={letter}>
          <Button
            onClick={() => handleButtonClick(letter)}
            size="large"
            block
            type="default">
            {letter}
          </Button>
        </Col>
      ))}
    </Row>
  );
}

export default VirtualKeyboard;
