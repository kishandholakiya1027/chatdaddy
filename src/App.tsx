import * as React from 'react'
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SideBar from './Components/sidebar';
import { getToken } from './Utils/API/index'

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

const App = () => {
  React.useEffect(() => {
    getData()
  }, [])
  
  const getData =  async () => {
    const data = '{\n  "refreshToken": "059c420e-7424-431f-b23b-af0ecabfe7b8",\n  "teamId": "a001994b-918b-4939-8518-3377732e4e88"\n}\n';
    const result = await getToken(data)
    localStorage.setItem('token',result?.data?.access_token)
    // console.info("result++ ",result)
  }


  return (
    <ThemeProvider theme={theme}>
      <SideBar />
    </ThemeProvider>
  )
}

export default App