import React from "react";
import { createRoot } from "react-dom/client";
import Chat from "./components/chatAi";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://deepseek-test-workers.1324282944.workers.dev/graphql",
  cache: new InMemoryCache()
})
const App:React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  )
};

const container = document.getElementById('root');
if(container) {
  const root = createRoot(container);
  root.render(<App />)
}

export default App;