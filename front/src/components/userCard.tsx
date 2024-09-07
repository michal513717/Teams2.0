import { useChatStorage } from "@/stores/chatStorage";
import { useCallback } from "react";


interface UserCardProps {
  isActive: boolean;
  userName: string;
  lastMessage: string;
}

function UserCard({ isActive, userName, lastMessage }: UserCardProps) {
  const { setSelectedUserChat, selectedUserChat } = useChatStorage();

  const selectChat = useCallback(() => {
    setSelectedUserChat(userName);
  }, [])

  const formattedMessage = lastMessage.length > 20 ? `${lastMessage.slice(0, 20)}...` : lastMessage;

  return (
    <div className={`user ${isActive ? "selected" : ''} user-card-hover ${selectedUserChat === userName ? "user-selected" : ""}`} onClick={selectChat}>
      <div className="description">
        <div className="name">
          {userName}
        </div>
        <div className="status">
          <i className={`icon ${isActive ? 'icon-connected user.connected' : ''}`} /> {isActive ? "online" : "offline"}
        </div>
        <div className="last-message">
          {formattedMessage}
        </div>
      </div>
      {/* <div className={`${hasNewMessages} ? "new-messages" : ""`}>!</div> */}
    </div>
  )
}

export default UserCard;