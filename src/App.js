import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const App = () => {
  const [words, setWords] = useState("");
  const [meaning, setMeaning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setWords(e.target.value);
  };

  const displayMeanings = () => {
    if (loading) {
      return <p>Loading...</p>;
    } else if (meaning) {
      return meaning;
    } else if (error) {
      return <Error>{error}</Error>;
    }
    return null;
  };

  const dictionaryApi = async (categorry, input) => {
    try {
      if (!input.trim()) {
        setError("Input empty. Please enter something.");
        return;
      }
      if (!input.match(/^[A-Z a-z]+$/)) {
        setError("Please enter a valid input.");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/${categorry}/${input}`
      );
      console.log(response);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const inputData = response.data[0];
        const definitions = inputData.meanings[0].definitions;
        const partOfSpeech = inputData.meanings[0].partOfSpeech;
        setMeaning(
          <>
            <h2>{input}</h2>
            <p>
              <strong>Part of Speech:</strong> {partOfSpeech}
            </p>
            <p>
              <strong>Definition:</strong>
            </p>
            <Ul>
              {definitions.map((definition, index) => (
                <Li key={index}>
                  {index + 1}.{} {definition.definition}
                </Li>
              ))}
            </Ul>
          </>
        );

        setError("");
      } else {
        setError(`Definition not found for ${words}`);
      }
    } catch (error) {
      setError("Invalid entry. Please try again.");
    } finally {
      setLoading(false);
      setWords("");
    }
  };

  return (
    <Container>
      <Title>Universal Dictionary</Title>
      <div>
        <Input
          type="text"
          id="wordInput"
          placeholder="Enter Your words"
          value={words}
          onChange={handleInputChange}
        />
        <Button onClick={() => dictionaryApi("en", words)}>Search</Button>
      </div>
      <DisplayResult>{displayMeanings()}</DisplayResult>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  background-color: #fff;
  padding: 1.25rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 50px auto;
  width: 700px;

  @media (max-width: 650px) {
    width: 100%;
    margin: 0;
  }
`;

const Title = styled.h1`
  color: rgb(37, 145, 145);

  font-size: 1.7rem;
  margin-top: -0.1rem;

  @media (max-width: 600px) {
    margin-top: 1.7rem;
    font-size: 3rem;
  }
`;

const Input = styled.input`
  width: 70%;
  padding: 0.75rem;
  margin: 10px 0;
  border: none;
  box-sizing: border-box;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    width: 65%;
    padding: 1rem;
    font-size: 2rem;
  }
`;

const Button = styled.button`
  margin-left: 0.75rem;
  padding: 11px 20px;
  background-color: rgb(37, 145, 145);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: rgb(39, 88, 88);
  }

  @media (max-width: 600px) {
    width: 15%;
    margin-top: 10px;
    font-size: 1.5rem;
    margin-left: 1rem;
    padding: 1.3rem 0rem;
  }
`;

const Error = styled.p`
  color: #ff0000;
  margin: 10px 0;
  text-align: center;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  
  
`;

const Li = styled.li`
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04);
   cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DisplayResult = styled.div`
  margin-left: 1.7rem;
  text-align: left;

  @media (max-width: 600px) {
    margin-left: 0rem;
    padding: 1rem 6rem;
  }
`;

export default App;
