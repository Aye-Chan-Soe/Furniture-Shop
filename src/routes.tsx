import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ErrorPage from "@/pages/Error";
import BlogRootLayout from "./pages/blogs/BlogRootLayout";
import BlogPage from "./pages/blogs/Blog";
import BlogDetail from "./pages/blogs/BlogDetail";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />, //element & errorElement accept <element/>
    children: [
      { index: true, Component: HomePage },
      { path: "contact", Component: AboutPage },
      { path: "blogs", Component: BlogRootLayout, 
        children: [
          {index: true, Component: BlogPage},
          { path: ":postId", Component: BlogDetail },
        ]
       },
      
      
    ],
  },
]);
