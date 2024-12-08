import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [messagesData, setMessagesData] = useState([
    {
      senderId: "user1",
      recipientId: "user2",
      text: "Hello! Is this service available?",
      timestamp: new Date("2024-12-08T10:00:00"),
    },
    {
      senderId: "user2",
      recipientId: "user1",
      text: "Yes, it is available.",
      timestamp: new Date("2024-12-08T10:01:00"),
    },
  ]);

  return (
    <AppContext.Provider value={{ messagesData, setMessagesData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
