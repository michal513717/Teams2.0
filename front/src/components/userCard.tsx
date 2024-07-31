

interface UserCardProps {
  isActive: boolean;
  userName: string;
}

function UserCard({ isActive, userName }: UserCardProps) {

  return (

    <div className={`user ${isActive ? "selected" : ''}`}>
      <div className="description">
        <div className="name">
          {userName}
        </div>
        <div className="status">
          <i className={`icon ${isActive ? 'icon-connected user.connected' : ''}`} /> { isActive ? "online" : "offline" }
        </div>
      </div>
      {/* <div className={`${hasNewMessages} ? "new-messages" : ""`}>!</div> */}
    </div>
  )
}

export default UserCard;