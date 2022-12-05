import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react'
import style from '../styles/welcome.module.scss'
import socket from "../socket/socket"

export default function Home() {

  const router = useRouter()

  const [userName, setUserName] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.auth = { userName }
    localStorage.setItem('userName', userName)
    socket.connect();
    // socket.emit('newUser', { username: userName, socketID: socket.id })
  }

  useEffect(() => {
    socket.on('connect_error', (err) => {
      if (err.message === "invalid username") {
        // router.push("/chat/chat")
        console.log(err.message)
      }
    })

    socket.on("users", (users) => {
      for (let user of users) {
        if (user.userID === socket.id) {
          router.push("/chat/chat")
        }
      }
      // console.log(users)
    })
  }, [socket])

  useEffect(() => {
    if (localStorage.getItem("userName")) {
        router.push('chat/chat')
    }
}, [])

  return (
    <>
      <div className={style.box}>
        <form className={style.formSignUp} onSubmit={(e) => handleSubmit(e)}>
          <h2>{"Sign in to Join Airwavy's Chat"}</h2>
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" 
          minLength={6} 
          name="username" 
          id="username" 
          className={style.usernameInput} 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} />
          <br />
          <button className={style.submitSignUp}>Sign up by {userName}</button>
        </form>
      </div>
    </>
  )
}
