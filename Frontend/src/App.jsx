import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

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
        path: "join",
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
