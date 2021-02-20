import { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    '& .MuiButton-root': {
      margin: theme.spacing(1)
    }
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('login_username', username);
    data.append('login_password', password);
    const response = await axios.post('https://api.mangadex.org/v2/ajax/actions.ajax.php?function=login', data);
    console.log(response.body);
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <form 
          className={classes.root} 
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <TextField
              id="username-input"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="password-input"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button
              id="login-submit"
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
}

export default LoginPage;