import { Button } from '@material-ui/core';

const PageNavigation = ({ 
  history, 
  topOfPage = true, 
  prevLink, 
  nextLink,
  disablePrev,
  disableNext 
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '3em',
      marginTop: '1em'
    }}>
    <Button
      variant="contained"
      color="primary"
      style={{ flexGrow: 1, marginLeft: 5 }}
      onClick={() => history.push(prevLink)}
      disabled={disablePrev}
    >
      Prev
    </Button>
    <span style={{ flexGrow: 1 }} />
    <Button
      variant="contained"
      color="primary"
      style={{ flexGrow: 1 }}
      onClick={() => window.scrollTo({
        top: topOfPage ? document.body.scrollHeight : 0,
        left: 0,
        behavior: 'smooth'
      })}
    >
      {topOfPage ? 'Scroll to Bottom' : 'Scroll to Top'}
    </Button>
    <span style={{ flexGrow: 1 }} />
    <Button
      variant="contained"
      color="primary"
      style={{ flexGrow: 1, marginRight: 5 }}
      onClick={() => history.push(nextLink)}
      disabled={disableNext}
    >
      Next
    </Button>
  </div>
);

export default PageNavigation;