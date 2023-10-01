import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

// import routes
import Root from "./routes/Root";
import JoinRoomPage from "./routes/JoinRoomPage";
import MeetingRoomPage from "./routes/MeetingRoomPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <JoinRoomPage />,
      },
      {
        path: "meeting",
        element: <MeetingRoomPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  );
}

export default App;
