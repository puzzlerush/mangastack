import { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectGroup: {
    minWidth: 250,
  },
  list: {
    width: '100%',
  },
}));

const ChapterList = ({ chapters, selectedChapter }) => {
  const classes = useStyles();

  const [sortBy, setSortBy] = useState('ascending');
  const [groupFilter, setGroupFilter] = useState('');
  const [chapterSkip, setChapterSkip] = useState('');

  const chapterGroups = {};
  chapters.forEach((chapter) => {
    Object.keys(chapter.groups).forEach((groupID) => {
      chapterGroups[chapter.groups[groupID]] = groupID;
    });
  });

  const groupsDropdownOptions = Object.keys(chapterGroups).map((groupName) => (
    <option key={groupName} value={groupName}>
      {groupName}
    </option>
  ));

  const filteredChapters = chapters
    .filter(
      (chapter) =>
        !groupFilter ||
        Object.keys(chapter.groups).includes(chapterGroups[groupFilter])
    )
    .sort((a, b) => parseInt(b.chapter) - parseInt(a.chapter));

  const sortedChapters = [...filteredChapters];
  if (sortBy === 'ascending') {
    sortedChapters.reverse();
  }

  const noSkippedChapters = sortedChapters.slice(
    isNaN(chapterSkip) ? 0 : chapterSkip,
    sortedChapters.length
  );

  const chaptersToDisplay = noSkippedChapters.map((chapter) => (
    <ListItem
      key={chapter.hash}
      button
      component={Link}
      to={`/manga/${chapter.mangaId}/chapter/${chapter.id}`}
      selected={selectedChapter === chapter.id}
    >
      <ListItemText
        primary={`Chapter ${chapter.chapter} ${
          chapter.title && ` - ${chapter.title}`
        }`}
        secondary={moment(chapter.publishAt).format('LL')}
      />
      {Object.values(chapter.groups).join(', ')}
    </ListItem>
  ));
  return (
    <Card elevation={10}>
      <CardContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="all-chapters"
            id="all-chapters"
          >
            <Typography variant="subtitle1">See all chapters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.list}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="sort-by-select">Sort by</InputLabel>
                <Select
                  native
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  inputProps={{ name: 'sort', id: 'sort-by-select' }}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="group-filter-select">
                  Filter by scanlation group
                </InputLabel>
                <Select
                  className={classes.selectGroup}
                  native
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  inputProps={{ name: 'group', id: 'group-filter-select' }}
                >
                  <option aria-label="None" value="" />
                  {groupsDropdownOptions}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id="chapters-to-skip-input"
                  label="Chapters to skip"
                  type="number"
                  value={chapterSkip}
                  onChange={(e) =>
                    setChapterSkip(parseInt(e.target.value) || '')
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              {chaptersToDisplay}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ChapterList;
