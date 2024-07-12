import Container from '@mui/material/Container'
import './Screen.css'
import { useContext } from 'react'
import { ChatContext, ChatContextType, ChatUser } from '@/context/ChatContext'
import { useNavigate } from 'react-router-dom'

type Props = {chat_user: string | undefined}

const SideProfilesMenu: React.FC<Props> = ({chat_user}) => {
    const {chatUsers} = useContext(ChatContext) as ChatContextType
    const navigate = useNavigate()

    return (
        
        <Container className='players'>
        <>
            {chatUsers.map((user: ChatUser) => (
                <div className={user.name == chat_user ? "player clicked" : "player"} onClick={user.name == chat_user ? () => {} : () => {navigate(`/chat/${user.name}`)}}>
                    <span className={user.status == 'online' ? "status online" : "status offline"}></span> {user.name}
                </div>
            ))}
        </>
        </Container>
    )
}

export default SideProfilesMenu