import { Box } from '@mui/material';

interface UserCardProps {
  isActive: boolean;
  userName: string;
}

function UserCard({isActive, userName}: UserCardProps) {
  return (
    <Box padding={10} >
    <Box display={'inline-block'}>
      <div>
        {userName}
      </div>
      <Box color={'#92959e'}>
        <p> {isActive} </p>
      </Box>
    </Box>
    <Box 
      color={'white'}
      bgcolor={'red'}
      width={20}
      borderRadius={5}
      textAlign={'center'}
      marginTop={10}
    >!</Box>
    </Box>
  )
}

export default UserCard;