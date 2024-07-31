import { Box } from "@mui/material"
import CallIcon from '@mui/icons-material/Call';

export const UserTopPanelActivity = () => {



  return (
    <Box height={'5%'} width={1} borderBottom={'1px solid grey'} display={"inline-block"} marginLeft={'260px'}>
      <Box> USERNAME </Box>
      <CallIcon sx={{ fontSize: 30 }}/>
    </Box>
  )
}