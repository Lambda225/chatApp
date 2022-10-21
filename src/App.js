import { Routes, Route } from "react-router-dom"
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Sign from "./components/sign/Sign"
import RequiredAuth from "./helps/RequiredAuth";


function App() {
  return (
    <Routes>
      <Route path='/'>

        <Route path='sign' element={<Sign />} />
        <Route path="register" element={<Register />} />

        <Route element={<RequiredAuth />}>
          <Route path='' element={<Home />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
