import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

function App() {
    const socket = useMemo(
        () =>
            io("http://localhost:4000/", {
                withCredentials: true,
            }),
        []
    );
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState("");
    const [roomName, setRoomName] = useState("");
    const [socketId, setSocketId] = useState("");
    const handlerSumbit = (e) => {
        e.preventDefault();
        socket.emit("message", { message, room });
        setMessage("");
    };

    const joinRoomHandler = (e) => {
        e.preventDefault();
        socket.emit("join-room", roomName);
        setRoomName("");
    };

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log("Connected", socket.id);
            socket.on("welcome", (s) => {
                console.log(s);
            });
        });

        socket.on("receive-message", (data) => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <Container maxWidth="sm">
            <Typography variant="h6" component="div" gutterBottom>
                {socketId}
            </Typography>
            <form onSubmit={joinRoomHandler}>
                <h5>Join Room</h5>
                <TextField
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    id="outlined-basic"
                    label="Message"
                    variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                    Join Room
                </Button>
            </form>
            <form onSubmit={handlerSumbit}>
                <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Message"
                    variant="outlined"
                />
                <TextField
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    id="outlined-basic"
                    label="Room"
                    variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                    Send
                </Button>
            </form>
            <Stack>
                {messages.map((m, i) => (
                    <Typography
                        key={i}
                        variant="h6"
                        component="div"
                        gutterBottom
                    >
                        {m}
                    </Typography>
                ))}
            </Stack>
        </Container>
    );
}

export default App;
