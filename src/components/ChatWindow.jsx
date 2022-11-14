import { Form, InputGroup, Button } from "react-bootstrap";

const ChatWindow = ({userName, userColor, count, sendMessageHandler}) => {
    return (
        <div className="chat_container">
            <div className="chat_header">
                <p>Connected as: <span style={{backgroundColor: userColor}} className="user_block">{userName}</span></p>
                <p><b>{count} users in room</b></p>
            </div>
            <div className="chat_messages"></div>
            <div className="chat_controls">
                <Form autoComplete="off" onSubmit={sendMessageHandler}>
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Enter text to send in the chat" maxLength={128} name="message" />
                        <Button variant="outline-secondary" type="submit">
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
}

export default ChatWindow;