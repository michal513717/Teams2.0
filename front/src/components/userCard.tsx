import { useAuthStore } from "@/stores/authStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { useCallback } from "react";

interface UserCardProps {
  isActive: boolean;
  userCardName: string;
  lastMessage: string;
}

function UserCard({ isActive, userCardName, lastMessage }: UserCardProps) {
  const { setSelectedUserChat, selectedUserChat } = useChatStorage();
  const { userName } = useAuthStore();

  const selectChat = useCallback(() => {
    setSelectedUserChat(userCardName);
  }, [])

  const formattedMessage = lastMessage.length > 20 ? `${lastMessage.slice(0, 20)}...` : lastMessage;

  return (
    <div className={`user ${isActive ? "selected" : ''} user-card-hover ${selectedUserChat === userCardName ? "user-selected" : ""}`} onClick={selectChat}>
      <div className="description">
        <div className="name">
          { userCardName }
          { userName === userCardName ? " (You)" : '' }
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