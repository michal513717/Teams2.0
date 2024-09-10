import { useAuthStore } from "@/stores/authStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { useCallback } from "react";

interface UserCardProps {
  isActive: boolean;
  userCardName: string;
}

function UserCard({ isActive, userCardName }: UserCardProps) {
  const { setSelectedUserChat, selectedUserChat } = useChatStorage();
  const { userName } = useAuthStore();

  const selectChat = useCallback(() => {
    setSelectedUserChat(userCardName);
  }, [])

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
      </div>
      {/* <div className={`${hasNewMessages} ? "new-messages" : ""`}>!</div> */}
    </div>
  )
}

export default UserCard;