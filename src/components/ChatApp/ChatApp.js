import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  Wrapper,
  Button,
  MessagesArea,
  MessagesWrapper,
  CurrentUserMessage,
  OtherUserMessage,
  Input,
} from "./styledChatApp";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("general");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

    return unsubscribe;
  }, [roomId]);

  const signIn = async () => {
    try {
      await auth.signInAnonymously();
      const snapshot = await firestore
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp")
        .get();
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await firestore
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
          text: newMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
        });
      setNewMessage("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Wrapper>
      {user && <Button onClick={signOut}>Sign Out</Button>}
      {user ? (
        <MessagesArea>
          <div>
            {messages?.map((message) => (
              <MessagesWrapper key={message.id}>
                {message.userId === user?.uid ? (
                  <CurrentUserMessage>{message.text}</CurrentUserMessage>
                ) : (
                  <OtherUserMessage>{message.text}</OtherUserMessage>
                )}
              </MessagesWrapper>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        </MessagesArea>
      ) : (
        <Button onClick={signIn}>Sign In</Button>
      )}
    </Wrapper>
  );
};
