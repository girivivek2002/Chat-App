

import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import './Register.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null); // this is for clear all form fields
  const navigate = useNavigate();


  function showhandler(e) {
    // <-- This stops the form from submitting
    setShow(!show);
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevents form reload

    if (!name || !email || !password || !phoneNumber) {
      toast.error("Please fill all fields and upload a profile picture");
      return;
    }
    //console.log({ name, email, password, phoneNumber, image });
    if (loading) return;
    // for connect to backend
    try {
      const config = {  // it will help to know the data is in json form
        headers: {
          "Content-type": "application/json"
        }
      }
      const { data } = await axios.post('/api/user', { name, email, phoneNumber, password, image }, config)  // send all data 
      console.log(data)
      toast.success("register successful")
      formRef.current.reset();  // for reset every field except image
      setImage('')
      console.log(data.success) // it will success message in data coming
      localStorage.setItem("userInfo", JSON.stringify(data))
      navigate('/')

    } catch (error) {
      toast.error(`Data not posted yet. Try again.`)
      console.log(error)

    }


  }

  // it will convert image into url
  async function postImage(image) {
    setLoading(true)
    if (image === undefined) {
      toast.error("File not found");
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "My-image")
      data.append("cloud_name", "dktu1slbc")

      await fetch("https://api.cloudinary.com/v1_1/dktu1slbc/image/upload", {
        method: "POST",
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          setLoading(false)
          console.log(data)
          toast.success("Image uploaded successfully!");
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } else {
      toast.error("File not found");
    }





  }
  return (

    <div className='container'>
      <div className="form">

        <form className='newform' onSubmit={handleSubmit} ref={formRef}>
          <div className="name ">
            <label htmlFor="">Full Name</label>
            <input type="text"
              required
              className='input'
              placeholder='Enter Name'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="Email ">
            <label htmlFor="">Email</label>
            <input type="email"
              required
              className='input'
              placeholder='Enter Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="Phone ">
            <label htmlFor="">Phone Number</label>
            <input type="number"
              required
              className='input'
              placeholder='Enter Phone Number'
              onChange={(e) => setPhoneNumber(e.target.value)}
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
          <div className="Profile ">
            <label htmlFor="">Profile Pic</label>
            <div className='input-pass flex flex-row '>
              <input type="file"
                accept='image/*'
                className='input'
                placeholder='Choose your file'
                onChange={(e) => postImage(e.target.files[0])}
              />
              <button type='button' className='in-btn' >{loading ? "Uploading..." : image ? "Uploaded" : "Upload"}</button>
            </div>

          </div>
          <div className="submit ">
            <input type="submit" value={loading ? "loading..." : "Submit"} />
          </div>
        </form>




      </div>
    </div>

  )
}

export default Register



// for claer all the fields

// first
// const formRef = useRef(null);
//second
// ref = { formRef } // in form beside handlesubmit
//third
// formRef.current.reset(); // inside handlesubmit function after post method when post is succeful
