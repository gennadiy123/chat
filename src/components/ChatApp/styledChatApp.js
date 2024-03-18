import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export const Button = styled.button`
  background-color: lightgreen;
  border: none;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

export const MessagesArea = styled.div`
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 20px;
`;

export const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserMessage = styled.p`
  border-radius: 20px;
  padding: 20px;
  margin: 0;
  margin-bottom: 10px;
`;

export const CurrentUserMessage = styled(UserMessage)`
  background-color: blue;
  color: white;
  margin-left: auto;
`;

export const OtherUserMessage = styled(UserMessage)`
  background-color: white;
  margin-right: auto;
`;

export const Input = styled.input`
    border: none;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    font-size: 20px;
    padding-left: 14px;
    margin-top: 30px;
`;
