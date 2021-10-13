import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import HomeEventDetails from "../components/HomeEventDetails";

const useStyles = makeStyles(() => ({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
}));

export default function Home({ setTitle, user }){
  const updateTitle = () => setTitle("Home page");
  useEffect( updateTitle );

  const [isLoading, setIsLoading] = useState(true);
  const [eventsData, setEventsData] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:8080/users/${user.id}`
    })
    .then(response => {
      setEventsData(response.data.Events)
      setIsLoading(false)
    })
    .catch(error => console.error(error))
  }, [user.id]);

  const classes = useStyles();

  return(
    <Container maxWidth="xl">
    {
      isLoading ?
      <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
      :
      <Grid container direction="column" justifyContent="center" alignItems="center">
        {
          eventsData.map(event => <HomeEventDetails key={event.id} user={ user } eventData={ event }/>)
        }
      </Grid>
    }
    </Container>
  )
}