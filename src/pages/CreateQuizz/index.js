import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Input } from 'reactstrap';

const CreateQuizz = () => {
  const toast = useToast();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([
    {
      question: null,
      answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
      answer_correct: 0,
    },
  ]);

  const handleChangeName = event => {
    setLabel(event.target.value);
  };

  const handleSelectedCategory = event => {
    setCategory(event.target.value);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: questions.length,
        answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
        answer_correct: 0,
      },
    ]);
  };

  const handleChangeQuestion = (key, value, index, indexChildren) => {
    console.log({ key, value, index, indexChildren });
    // deep copy
    let questionsTemp = JSON.stringify(questions);
    questionsTemp = JSON.parse(questionsTemp);

    if (indexChildren !== undefined) {
      questionsTemp[index][key][indexChildren] = value;
    } else {
      questionsTemp[index][key] = value;
    }

    console.log('questionsTemp: ', questionsTemp);
    setQuestions([...questionsTemp]);
  };

  const handleSaveQuizzTest = async () => {
    const quizzTest = {
      label: label,
      category: category,
      questions,
    };

    const response = await fetch('http://localhost:8080/quizz-test', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizzTest),
    });

    toast({
      title: 'Tạo đề thi thành công',
      status: 'success',
      isClosable: true,
    });
    console.log('response: ', response);
  };

  console.log('questions: ', questions);

  return (
    <>
      <FormControl isRequired>
        <Stack spacing="4">
          <div>
            <FormLabel>Name quizz test</FormLabel>
            <Input
              placeholder="Enter name quizz test..."
              onChange={handleChangeName}
            />
          </div>

          <div>
            <FormLabel>Select category</FormLabel>
            <Select
              placeholder="Select category..."
              onChange={handleSelectedCategory}
            >
              <option value="reactjs">ReactJS</option>
              <option value="javascript">Javascript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </Select>
          </div>

          {questions.map((question, index) => {
            return (
              <div key={`question-${index + 1}`}>
                <div>
                  <FormLabel>Question {index + 1}</FormLabel>
                  <Textarea
                    placeholder="Enter your question"
                    onChange={event => {
                      handleChangeQuestion(
                        'question',
                        event.target.value,
                        index
                      );
                    }}
                  />
                </div>

                <RadioGroup
                  onChange={value =>
                    handleChangeQuestion('answer_correct', Number(value), index)
                  }
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Radio value="0"></Radio>
                      <div style={{ marginLeft: '12px' }}>
                        <Editable defaultValue="Answer A">
                          <EditablePreview />
                          <EditableInput
                            onChange={event => {
                              handleChangeQuestion(
                                'answers',
                                event.target.value,
                                index,
                                0
                              );
                            }}
                          />
                        </Editable>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Radio value="1"></Radio>
                      <div style={{ marginLeft: '12px' }}>
                        <Editable defaultValue="Answer B">
                          <EditablePreview />
                          <EditableInput
                            onChange={event => {
                              handleChangeQuestion(
                                'answers',
                                event.target.value,
                                index,
                                1
                              );
                            }}
                          />
                        </Editable>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Radio value="2"></Radio>
                      <div style={{ marginLeft: '12px' }}>
                        <Editable defaultValue="Answer C">
                          <EditablePreview />
                          <EditableInput
                            onChange={event => {
                              handleChangeQuestion(
                                'answers',
                                event.target.value,
                                index,
                                2
                              );
                            }}
                          />
                        </Editable>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Radio value="3"></Radio>
                      <div style={{ marginLeft: '12px' }}>
                        <Editable defaultValue="Answer D">
                          <EditablePreview />
                          <EditableInput
                            onChange={event => {
                              handleChangeQuestion(
                                'answers',
                                event.target.value,
                                index,
                                3
                              );
                            }}
                          />
                        </Editable>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            );
          })}

          <Button
            colorScheme="teal"
            variant="outline"
            onClick={handleAddQuestion}
          >
            Add question
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={handleSaveQuizzTest}
          >
            Save Quizz Test
          </Button>
        </Stack>
      </FormControl>
    </>
  );
};

export default CreateQuizz;