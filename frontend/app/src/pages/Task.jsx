import { useEffect, useState } from "react";
import { useParams } from "react-router"
import axios from "axios";
import isObjectEmpty from "../utils"
import { Container, Grid, CircularProgress, Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core";
import TaskDetails from "../components/TaskDetails";
import TaskComments from "../components/TaskComments";

const useStyles = makeStyles(() => ({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
  card: {
    backgroundColor: '#292929'
  },
  cardTitle:{
    color: '#fff',
    marginBottom: '10px'
  },
  gridTop: {
    marginBottom: "20px"
  },
}));

export default function Task({ setTitle, user }){
  const classes = useStyles();
  const {id} = useParams();

  const [taskData, setTaskData] = useState({});
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:8080/tasks/${id}`
    })
    .then(response => {
      setTaskData(response.data)
      setTitle(response.data.name)
    })
    .catch(error => console.error(error))
  }, [id, setTitle])

  return(
    <Container className={classes.container} maxWidth="xl">
      {
        isObjectEmpty(taskData) ?
        <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
        :
        <Grid container spacing={1}>
          <Grid item xl={6}>
            <Card className={classes.card}>
              <div>
                <CardContent>
                  <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography className={classes.cardTitle} component="h2" variant="h5">
                      Details
                    </Typography>
                  </Grid>
                  <TaskDetails taskData={ taskData } setTaskData={ setTaskData }/>
                </CardContent>
              </div>
            </Card>
          </Grid>
          <Grid item xl={6}>
            <Card className={classes.card}>
              <div>
                <CardContent>
                  <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography className={classes.cardTitle} component="h2" variant="h5">
                      Comments
                    </Typography>
                  </Grid>
                  <TaskComments user={ user } taskData={ taskData } />
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      }
    </Container>
  )
}