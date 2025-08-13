import React, { useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();




  function showhandler(e) {
    // <-- This stops the form from submitting
    setShow(!show);
  }

  async function handlesubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields and upload a profile picture");
      return;
    }

    try {
      const config = {  // it will help to know the data is in json form
        headers: {
          "Content-type": "application/json"
        }
      }
      const { data } = await axios.post('https://chat-app-backend-aqda.onrender.com/api/user/login', { email, password }, config)  // send all data 
      console.log(data)
      toast.success("register successful")
      localStorage.setItem("userInfo", JSON.stringify(data))
      navigate('/chats')

    } catch (error) {
      toast.error(`Error Occured ${error.response.data.message}`)
      console.log(error)
    }

  }


  return (
    <div className='container'>
      <div className="form">

        <form className='newform' onSubmit={handlesubmit}>

          <div className="Email ">
            <label htmlFor="">Email</label>
            <input type="email"
              required
              className='input'
              placeholder='Enter Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="Password ">
            <label htmlFor="">Password</label>
            <div className='input-pass flex flex-row '>
              <input type={show ? "text" : "password"}
                required
                className='input'
                placeholder='Enter Password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type='button' className='in-btn btntype' onClick={(e) => showhandler(e)}>{show ? "Hide" : "Show"}</button>
            </div>

          </div>
          <div className="submit ">
            <input type="submit" value="Login" />
          </div>
        </form>




      </div>
    </div>
  )
}

export default Login
