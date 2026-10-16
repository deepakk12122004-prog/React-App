
import { createRoot } from 'react-dom/client' 
import './index.css' 
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap-icons/font/bootstrap-icons.css' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
 
import App from './App.jsx' 
import Profilepage from './Profilepage.jsx' 
import Login from './Login.jsx' 
import ProtectedRoute from './ProtectedRoute.jsx' 
import { AuthProvider } from './AuthContext.jsx' 
import Register from './Register.jsx'
import CreatePost from './CreatePost.jsx'
import CommentsPage from './CommentsPage.jsx'
import EditProfile from './EditProfile.jsx' 
import Following from './Following.jsx'
 
const router = createBrowserRouter([ 
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

   { 
    path: '/create', 
    element: ( 
      <ProtectedRoute> 
        <CreatePost /> 
      </ProtectedRoute> 
    ), 
  }, 

  { 
    path: '/post/:id/comments', 
    element: ( 
      <ProtectedRoute> 
        <CommentsPage /> 
      </ProtectedRoute> 
    ), 
  }, 

  { 
    path: '/', 
    element: ( 
      <ProtectedRoute> 
        <App /> 
      </ProtectedRoute> 
    ), 
  }, 
  
  { 
    path: '/profilepage', 
    element: ( 
      <ProtectedRoute> 
        <Profilepage /> 
      </ProtectedRoute> 
    ), 
  }, 
 
  { 
     path: '/profilepage/edit', 
     element: ( 
      <ProtectedRoute> 
       <EditProfile /> 
      </ProtectedRoute> 
    ), 
  },

  { 
    path: '/profilepage/following', 
    element: ( 
     <ProtectedRoute> 
      <Following /> 
     </ProtectedRoute> 
    ), 
  },
]) 
 
createRoot(document.getElementById('root')).render( 
  <AuthProvider> 
    <RouterProvider router={router} /> 
  </AuthProvider> 
)