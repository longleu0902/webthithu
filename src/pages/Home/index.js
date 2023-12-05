import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState ,useRef} from 'react';
import { useSearchParams ,useNavigate,} from 'react-router-dom';
import { CardBody } from 'reactstrap';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listQuizzTest, setListQuizzTest] = useState([]);
  const [listCategories, setListCategories] = useState([]);

  const subjectCurrent = useRef('');

  const convertToSlug = text => {
    //Đổi chữ hoa thành chữ thường
    let slug = text.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    );
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, '-');
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  };

  const handleRedirectPage = (label, id) => {
    const path = convertToSlug(label) + '-' + id + '.html';
    console.log(path);
    navigate(`quizz-test/${path}`);
  };

  const handleGetListQuizzTest = async category => {
    let filterCategory = '';
    if (category !== undefined) {
      filterCategory = `category=${category}`;
    }

    const API_QUIZZ_TEST = `http://localhost:8080/quizz-test?${filterCategory}`;

    try {
      const response = await fetch(API_QUIZZ_TEST);
      const data = await response.json();

      getListCategory(data);

      setListQuizzTest([...data]);
    } catch (e) {
      console.log(e);
    }
  };

  const getListCategory = data => {
    console.log(data);
    const categories = [];

    for (let element of data) {
      if (!categories.includes(element.category)) {
        categories.push(element.category);
      }
    }

    setListCategories([...categories]);
  };

  useEffect(() => {
    const queryString = searchParams.get('subject');

    if (
      queryString === 'reactjs' ||
      queryString === 'javascript' ||
      queryString === 'html' ||
      queryString === 'css'
    ) {
      subjectCurrent.current = queryString;
      handleGetListQuizzTest(queryString);
    } else {
      handleGetListQuizzTest();
      setSearchParams({ subject: 'all' });
    }
  }, [searchParams]);

  useEffect(() => {
    handleGetListQuizzTest();
  }, []);

  const jsxQuizzTest = listCategories.map(category =>
    listQuizzTest
      .filter(quizzTest => quizzTest.category === category)
      .map(quizzTest => (
        <Card>
          <CardHeader>
            <Heading size="md">
              <span style={{ textTransform: 'uppercase' }}>{category}</span>
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text fontSize="lg" as="span">
                    {quizzTest.label}
                  </Text>
                  <div>
                    <Button
                      colorScheme="gray"
                      size="sm"
                      onClick={() =>
                        handleRedirectPage(quizzTest.label, quizzTest.id)
                      }
                    >
                      Thi thử
                    </Button>
                  </div>
                </div>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      ))
  );

  return (
    <div className="container-home">
      <Stack spacing={5}>
        {jsxQuizzTest.length === 0 ? (
          <Card>
            <CardHeader>
              <Heading size="md">
                <span style={{ textTransform: 'uppercase' }}>
                  {subjectCurrent.current}
                </span>
              </Heading>
            </CardHeader>

            <CardBody>
              <h2>No data</h2>
            </CardBody>
          </Card>
        ) : (
          jsxQuizzTest
        )}
      </Stack>
    </div>
  );
};

export default Home;