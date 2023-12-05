import {
  Badge,
  Button,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const QuizzTest = () => {
  const params = useParams();

  const [detailQuizzTest, setDetailQuizzTest] = useState({});
  const [answerSelected, setAnwserSelected] = useState([]);

  const [isSubmited, setIsSubmited] = useState(false);

  const handleGetQuizzTest = async id => {
    const API_QUIZZ_TEST = `http://localhost:8080/quizz-test?id=${id}`;

    try {
      const response = await fetch(API_QUIZZ_TEST);
      const data = await response.json();
      console.log(data);
      setDetailQuizzTest(data[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckAnswer = (indexQuestion, answer) => {
    console.log({ indexQuestion, answer });
    const answerSelectedTemp = [...answerSelected];
    answerSelectedTemp[indexQuestion] = answer;

    setAnwserSelected([...answerSelectedTemp]);
  };

  const handleSubmitQuizzTest = () => {
    let point = 0;
    console.log('submit quizz test');
    console.log('detailQuizzTest: ', detailQuizzTest);

    for (let i = 0; i < detailQuizzTest.questions.length; i++) {
      if (detailQuizzTest.questions[i].answer_correct == answerSelected[i]) {
        point += 10;
      }
    }

    console.log('point: ', point);
    setIsSubmited(true);
  };

  useEffect(() => {
    const words = params.slug.split('-');
    const id = words.pop().split('.')[0];

    handleGetQuizzTest(id);
  }, [params]);

  return (
    <Stack spacing="4">
      <Text fontSize="2xl" style={{ textAlign: 'center' }}>
        {detailQuizzTest.label}
      </Text>
      <div>
        {detailQuizzTest.questions?.map((question, index) => (
          <div style={{ marginTop: '12px', marginBottom: '12px' }}>
            <FormLabel>
              Question {index + 1}: {question.question}{' '}
            </FormLabel>
            <RadioGroup
              onChange={value => {
                handleCheckAnswer(index, Number(value));
              }}
              value={answerSelected[index]}
              isDisabled={isSubmited}
            >
              <Stack direction="column">
                {question.answers.map((answer, i) => (
                  <Radio value={i}>{answer}</Radio>
                ))}
              </Stack>
            </RadioGroup>
            {isSubmited &&
              (question.answer_correct == answerSelected[index] ? (
                <Badge colorScheme="green">Correct</Badge>
              ) : (
                <Badge colorScheme="red">Incorrect</Badge>
              ))}
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmitQuizzTest}
        isDisabled={
          detailQuizzTest?.questions?.length != answerSelected.length ||
          isSubmited
            ? true
            : false
        }
      >
        Nộp bài
      </Button>
    </Stack>
  );
};

export default QuizzTest;