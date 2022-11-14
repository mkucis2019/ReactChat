import React from "react";
import ChatWindow from "../components/ChatWindow";
import Loader from "../components/Loader";
import { CHAT_CHANNEL_ID, CHAT_CHANNEL_NAME } from "../config";
import { getColor, getName } from "../utils/RandomGenerator";

export class SeminarChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drone: null,
            isReady: false,
            userName: "",
            userColor: "",
            roomUsers: 0
        }
    }

    initApi = false

    sendMessageHandler = (event) => {
        event.preventDefault();

        const input = event.target?.elements?.message;
        const text = input?.value || "";

        if (text.trim()) {
            if (this.state.drone) {
                this.state.drone.publish({
                    room: CHAT_CHANNEL_NAME,
                    message: text,
                });
                this.showReceivedMessage(text, {
                    id: this.state.drone.clientId, 
                    clientData: {color: this.state.userColor, name: this.state.userName}
                });
                input.value = "";
            }
        }
    }

    showReceivedMessage = (text, member) => {
        const container = document.querySelector(".chat_messages");
        if (container) {
            const newDiv = document.createElement("div");
            const newH6 = document.createElement("h6");
            newH6.classList.add("block_title");
            newH6.innerHTML = member?.clientData.name;

            const newSpan = document.createElement("span");
            newSpan.classList.add("user_block");
            newSpan.style.backgroundColor = member?.clientData.color;
            newDiv.style.marginBottom = "10px";

            if (member.id === this.state.drone.clientId) {
                newDiv.style.marginLeft = "auto";
                newDiv.style.textAlign = "right";
            } else {
                newDiv.style.textAlign = "left";
            }

            newSpan.innerHTML = text;
            newDiv.append(newH6);
            newDiv.append(newSpan);

            container.append(newDiv);
            container.scrollTop = container.scrollHeight;
        }
    }

    componentDidMount() {
        if (!this.initApi) {
            const name = getName();
            const color = getColor();

            const ScaleDrone = require('scaledrone-react-native');
            const drone = new ScaleDrone(CHAT_CHANNEL_ID, {
                data: {
                    name: name,
                    color: color,
                },
            });
            this.setState({ drone: drone, userName: name, userColor: color });

            drone.on('open', error => {
                if (error) {
                    return console.error(error);
                }
                console.log('Successfully connected to Scaledrone');

                const room = drone.subscribe(CHAT_CHANNEL_NAME);
                room.on('open', error => {
                    if (error) {
                        return console.error(error);
                    }
                    console.log('Successfully joined room');
                    this.setState({ isReady: true });
                });
                room.on('members', m => {
                    this.setState({ roomUsers: m.length });
                    console.log('User list received.');
                });
                room.on('member_join', member => {
                    this.setState({ roomUsers: this.state.roomUsers + 1 });
                    console.log('User list updated.');
                });
                room.on('member_leave', ({ id }) => {
                    this.setState({ roomUsers: this.state.roomUsers - 1 });
                    console.log('User list updated.');
                });
                room.on('data', (text, member) => {
                    if (member) {
                        if(member.id !== this.state.drone.clientId) {
                            this.showReceivedMessage(text, member);
                        }
                    }
                });

            });

            this.initApi = true;
        }
    }

    render() {
        const { userName, userColor, roomUsers, isReady } = this.state;

        return (
            <div className="full_screen">
                {!isReady && 
                    <Loader />}
                {isReady &&
                    <ChatWindow userName={userName} userColor={userColor} count={roomUsers} sendMessageHandler={this.sendMessageHandler} />}
            </div>
        );
    }
}