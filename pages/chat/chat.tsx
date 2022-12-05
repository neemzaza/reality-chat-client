import style from '../../styles/chat.module.scss'
import Image from "next/image"
import CSSModules from 'react-css-modules'
import { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import socket from "../../socket/socket"

function Chat() {
    const [userName, setUserName] = useState<any>("Loading...")

    const [message, setMessage] = useState("");

    const [users, setUsers] = useState<Array<any>>([])

    const [chatMessage, setChatMessage] = useState<Array<any>>([]);

    const [typingStatus, setTypingStatus] = useState();

    const handleSendMessage = () => {
        if (message.trim() && localStorage.getItem("userName")) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem("userName"),
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id
            })
            console.log("OK")
        } else {
            console.log("No")
        }
        setMessage("")
    }

    const handleTyping = () => {
        socket.emit('typing', `${localStorage.getItem("userName")} is Typing...`)
    }

    const handleNotTyping = () => {
        socket.emit('typing', "")
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });

        socket.on("disconnect", () => {
            console.log(socket.id); // undefined
        });
        if (localStorage.getItem("userName")) {
            setUserName(localStorage.getItem("userName"))
        } else {
            setTimeout(() => {
                setUserName("Undefined")
            }, 3000)
        }
    }, [])

    // When refresh or go to this page first (Already signed up)
    useEffect(() => {
        // socket.connect();
        socket.on("users", (allUsers: Array<any>) => {
            setUsers(allUsers)
            console.log(allUsers)
        })
        socket.on("session", ({ sessionID, userID }) => {
            console.log(sessionID)
        })
        if (localStorage.getItem("userName")) {
            socket.emit('newUser', { userName, socketID: socket.id })
        }
    }, [])


    // On Message recieved
    useEffect(() => {
        socket.on('messageRes', (data) => {
            setChatMessage([...chatMessage, data])
        })
    }, [socket, chatMessage])

    // On some user typing...
    useEffect(() => {
        // socket.on('typingRes', (data) => setTypingStatus(data))
        // When server send active user
    }, [socket])

    return (
        <>
            <div className={`${style.grid} ${style.page}`}>
                <div className="left-side">
                    <header className={style.header}>
                        <h1>{userName}</h1>
                        <span>{users.length} peoples in chat</span>
                    </header>
                    <div className={style.contact}>

                        {/* Chat Box */}
                        {/* <div className={`${style.people} ${style.active}`}>
                            <div className={`${style.chatBox}`}>
                                <div className={style.name}>
                                    <Image width="50" height="50" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                                    <b className={style.peopleName}>Min min</b>
                                </div>
                            </div>

                            <div className={style.alert}><span className="alert-number">{10}</span></div>
                        </div> */}
                        {/* Chat Box */}

                        {/* .filter((user) => user.username !== localStorage.getItem("userName")) */}

                        {users.map((user) => (
                            <div key={user.userID} className={style.people}>
                                <div className={`${style.chatBox}`}>
                                    <div className={style.name}>
                                        <Image width="50" height="50" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                                        <b className={style.peopleName}>{user.userName}</b>
                                    </div>
                                    <span className={`${style.lastMsg} ${style.you}`}>
                                        <span className={style.msg}>แต่เราพอเข้าใจอยู่</span>

                                        <span> 	• </span>

                                        <span className={style.time}>
                                            {"19:55"}
                                        </span>
                                    </span>
                                </div>

                                <div className={style.alert}><span className="alert-number">{10}</span></div>
                            </div>
                        ))}

                        {/* <div className={style.people}>
                            <div className={`${style.chatBox}`}>
                                <div className={style.name}>
                                    <Image width="50" height="50" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                                    <b className={style.peopleName}>Min min</b>
                                </div>
                                <span className={`${style.lastMsg} ${style.me}`}>
                                    <span className={style.msg}>แต่เราพอเข้าใจอยู่</span>

                                    <span> 	• </span>

                                    <span className={style.time}>
                                        {"19:55"}
                                    </span>
                                </span>
                            </div>

                            <div className={style.alert}><span className="alert-number">{10}</span></div>
                        </div> */}

                    </div>
                </div>
                <div className={`${style.contentSide}`}>
                    <div className={`${style.inChat}`}>

                        {chatMessage.map((val: any, key) =>
                            val.name === localStorage.getItem("userName") ? (
                                <div key={key} className={style.chatParent}>
                                    <div className={`${style.chatmsg} ${style.me}`}>
                                        <span className={`${style.msg}`}>{val.text} </span>
                                    </div>
                                </div>
                            ) : (
                                <div key={key} className={style.chatParent}>
                                    <Image width="40" height="40" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                                    <div className={`${style.chatmsg} ${style.you}`}>
                                        <span className={`${style.msg}`}>{val.text} </span>
                                    </div>
                                </div>
                            )
                        )}

                        {typingStatus !== "" ? (
                            <div className={style.chatParent}>
                                <Image width="40" height="40" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                                <div className={`${style.chatmsg} ${style.you}`}>
                                    <span className={`${style.msg}`}>{typingStatus} </span>
                                </div>
                            </div>

                        ) : (<></>)}

                        {/* <div className={style.chatParent}>
                            <Image width="40" height="40" src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile picture"></Image>
                            <div className={`${style.chatmsg} ${style.you}`}>
                                <span className={`${style.msg}`}>อ่ออออ </span>
                            </div>
                        </div>

                        <div className={style.chatParent}>
                            <div className={`${style.chatmsg} ${style.me}`}>
                                <span className={`${style.msg}`}>อ่ออออ </span>
                            </div>
                        </div> */}


                    </div>
                    <div className={`${style.msgZone}`}>
                        <span className={style.btnSubmit} onClick={() => { handleSendMessage() }}>
                            <i className="bi bi-send-fill"></i>
                        </span>
                        <input className={style.chatInput} placeholder="Say something to Min min" type="text" value={message} onChange={(e) => setMessage(e.target.value)} onFocus={handleTyping} onBlur={handleNotTyping} />
                    </div>
                </div>
                <div className="right-side">
                    Link
                </div>
            </div>
        </>
    )
}

export default Chat