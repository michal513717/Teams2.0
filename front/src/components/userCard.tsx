import { Box, Typography } from '@mui/material';

interface UserCardProps {
  isActive: boolean;
  userName: string;
}

function UserCard({ isActive, userName }: UserCardProps) {

  const hasNewMessages = Math.random() > 0.5 ;

  return (

    <div className={`user ${hasNewMessages ? "selected" : ''}`}>
      <div className="description">
        <div className="name">
          {userName}
        </div>
        <div className="status">
          <i className={`icon ${hasNewMessages ? 'icon-connected user.connected' : ''}`} /> { hasNewMessages ? "online" : "offline" }
        </div>
      </div>
      {/* <div className={`${hasNewMessages} ? "new-messages" : ""`}>!</div> */}
    </div>
  )
}

export default UserCard;