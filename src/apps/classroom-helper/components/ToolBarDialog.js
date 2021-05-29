import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

// Context

import { ClassroomHelperContext } from "../context/helperContext";

// Firebase

import firebase from "../../../firebase";

// UUID

import { v4 as uuidv4 } from "uuid";

// FontAwesome icons

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

// Material icons
import TimerIcon from "@material-ui/icons/Timer";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import CloseIcon from "@material-ui/icons/Close";

// Material UI core
import {
  Paper,
  Grid,
  Box,
  Button,
  FormControl,
  Dialog,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogContent";

import { StyledButton } from "./StyledComponents";
import { LineBreak } from "../../word-stress/components/StyledComponents";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "2rem",
    minWidth: "50rem",
    minHeight: "40rem",
  },

  addstudents: {
    fontSize: "1.5rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },

  //  Add class dialog

  addClassText: {
    fontSize: "1.6rem",
    fontFamily: "Montserrat",
    color: "#43b3f8",
    fontWeight: "600",
    paddingBottom: "0.5rem",
  },

  addClassSection: {
    padding: "1rem 0rem 0rem 0rem",
  },

  addClassForm: {
    width: "100%",
  },
  addClassInput: {
    fontSize: "2rem",
    color: "darkgrey",
    fontWeight: "400",
  },

  header: {
    padding: "2rem 2rem 2rem 2rem",
  },
  headerText: {
    fontSize: "2.5rem",
    color: "white",
    fontWeight: "800",
    fontFamily: "Inter",
  },
  backButton: {
    position: "absolute",
    left: "1rem",
    top: "1rem",
    color: theme.palette.grey[500],
  },
  body: {},
  mainText: {
    fontSize: "1.8rem",
    color: "black",
    fontWeight: "600",
    fontFamily: "Inter",
  },
  paperitem: {
    borderRadius: "1rem",
    padding: "0.5rem",
    border: "1px solid lightgrey",
    color: "#575b7d",
    fontSize: "3rem",
    fontFamily: "Inter",
    fontWeight: "900",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  listitem: {
    borderRadius: "0.5rem",
    padding: "1.5rem",
    border: "1px solid lightgrey",
    fontSize: "1.3rem",
  },
}));

export default function StyledDialog(props) {
  const {
    // Firebase
    allClasses,
    addStudents,
    addClassroom,
    // States
    selectedClass,
    setSelectedClass,
    dialogOpen,
    // Functionalities
    setCountDownValue,
    closeDialog,
    groupStudents,
    openScreen,
  } = useContext(ClassroomHelperContext);

  const placeholder = `Copy/Paste your students' names here. Put each name on a new line.\n\n\nExamples:\n\nBob Odenkirk\nAaron Paul\nBryan Cranston`;

  // States

  // New classroom

  const initialState = {
    id: uuidv4(),
    name: "",
    grade: 0,
    notes: [],
    students: [],
    year: new Date().getFullYear(),
    teacher: "",
    tasks: [],
    announcements: [],
  };
  const [formData, setFormData] = useState(initialState);
  const { name, grade } = formData;

  const onChangeNewClass = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmitNewClass = (e) => {
    e.preventDefault();
    addClassroom({ ...formData });
    setFormData(initialState);
    closeDialog();
  };

  const { students } = selectedClass || {};
  // ClassSelect, which also makes use of this dialog component, is
  // responsible for setting the state of selectedClass. Prior to
  // the teacher choosing which class they want to work with,
  // selectedClass is undefined > therefore this object cannot be
  // destructured > therefore we need to give 'students' another value.

  // New Students

  const [newStudents, setNewStudents] = useState();

  const onChangeNewStudents = (event) => {
    setNewStudents(event.target.value);
  };

  const onSubmitNewStudents = (e) => {
    e.preventDefault();

    let list = newStudents.split("\n").map((student) => ({
      id: uuidv4(),
      name: student,
    }));

    addStudents(selectedClass, [...list]);
    closeDialog();
  };

  const classes = useStyles();

  function renderDialog() {
    // Destructuring the state object 'dialogOpen'
    const { content } = dialogOpen;
    switch (content) {
      case "add-class":
        return addClass;
      case "timer":
        return timer;
      case "task":
        return task;
      case "grouping":
        return groups;
      case "add-note":
        return addNote;
      case "add-students":
        return addStudentsToClass;
      default:
        break;
    }
  }

  const groups = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "green" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <GroupIcon style={{ fontSize: "5rem" }} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Group students
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography
          style={{ padding: "1rem" }}
          align="center"
          className={classes.mainText}
        >
          How many students per group?
        </Typography>

        <Typography style={{ padding: "1rem" }}>
          <Grid container spacing={2} justify="center">
            {[2, 3, 4, 5, 6].map((studentsPerGroup) => (
              <Grid item xs={2}>
                <Paper
                  elevation={1}
                  className={classes.paperitem}
                  onClick={function (e) {
                    console.log(students);
                    groupStudents(students, studentsPerGroup);
                    closeDialog();
                    openScreen("groups");
                  }}
                >
                  {studentsPerGroup}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Typography>
      </MuiDialogContent>
    </>
  );

  const addClass = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "#43b3f8" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <SupervisedUserCircleIcon style={{ fontSize: "7rem" }} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Create a new classroom
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography className={classes.addClassSection}>
          <Box className={classes.addClassText}>Class name</Box>
          <Box>
            <TextField
              name="name"
              value={name}
              variant="outlined"
              onChange={onChangeNewClass}
              InputProps={{
                classes: {
                  input: classes.addClassInput,
                },
              }}
              size="large"
              fullWidth
            />
          </Box>
        </Typography>

        <Typography className={classes.addClassSection}>
          <Box className={classes.addClassText}>Grade</Box>
          <Box>
            <FormControl size="large" className={classes.addClassForm}>
              <Select
                name="grade"
                value={grade}
                onChange={onChangeNewClass}
                variant="outlined"
                style={{ fontSize: "2rem", color: "" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={0}>Kindergarten</MenuItem>
                <MenuItem value={1}>Grade 1</MenuItem>
                <MenuItem value={2}>Grade 2</MenuItem>
                <MenuItem value={3}>Grade 3</MenuItem>
                <MenuItem value={4}>Grade 4</MenuItem>
                <MenuItem value={5}>Grade 5</MenuItem>
                <MenuItem value={6}>Grade 6</MenuItem>
                <MenuItem value={7}>Grade 7</MenuItem>
                <MenuItem value={8}>Grade 8</MenuItem>
                <MenuItem value={9}>Grade 9</MenuItem>
                <MenuItem value={10}>Grade 10</MenuItem>
                <MenuItem value={11}>Grade 11</MenuItem>
                <MenuItem value={12}>Grade 12</MenuItem>
                <MenuItem value={13}>College / University</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Typography>
      </MuiDialogContent>
      <MuiDialogActions>
        <Typography align="center">
          <StyledButton onClick={(e) => onSubmitNewClass(e)}>
            Create class
          </StyledButton>
        </Typography>
      </MuiDialogActions>
    </>
  );

  const timer = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "orange" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <TimerIcon style={{ fontSize: "5rem" }} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Timer
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography
          style={{ padding: "1rem" }}
          align="center"
          className={classes.mainText}
        >
          Set countdown time
        </Typography>

        <Typography style={{ padding: "1rem" }}>
          <Grid container spacing={1}>
            {[
              "0:30",
              "1:00",
              "2:00",
              "3:00",
              "4:00",
              "5:00",
              "10:00",
              "20:00",
              "30:00",
            ].map((item) => (
              <Grid item xs={4}>
                <Paper
                  variant="outlined"
                  className={classes.paperitem}
                  onClick={function (e) {
                    closeDialog();
                    setCountDownValue(item);
                    openScreen("timer");
                  }}
                >
                  {item}
                </Paper>
              </Grid>
            ))}
            <Grid item xs={4}>
              <Paper elevation={1} className={classes.paperitem}>
                +
              </Paper>
            </Grid>
          </Grid>
        </Typography>
      </MuiDialogContent>
    </>
  );

  const task = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "cornflowerblue" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <AssignmentIcon style={{ fontSize: "5rem" }} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Tasks
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography
          style={{ padding: "1rem" }}
          align="center"
          className={classes.mainText}
        >
          Set a task for your students
        </Typography>

        <Typography style={{ padding: "1rem" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper
                style={{
                  textAlign: "center",
                  backgroundColor: "cornflowerblue",
                  color: "white",
                  border: "1px solid blue",
                }}
                variant="outlined"
                className={classes.listitem}
              >
                New
              </Paper>
            </Grid>
            {[
              "Recall a time you struggled lately. How did you handle it?",
              "Recall a time you struggled lately. How did you handle it?",
              "Recall a time you struggled lately. How did you handle it?",
            ].map((item) => (
              <Grid item xs={12}>
                <Paper variant="outlined" className={classes.listitem}>
                  {item}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Typography>
      </MuiDialogContent>
    </>
  );

  const addNote = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "steelblue" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <AssignmentIcon style={{ fontSize: "5rem" }} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Add note
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography
          style={{ padding: "1rem" }}
          align="center"
          className={classes.mainText}
        >
          Set a task for your students
        </Typography>

        <Typography style={{ padding: "1rem" }}>
          <Grid container spacing={1}></Grid>
        </Typography>
      </MuiDialogContent>
    </>
  );

  const addStudentsToClass = (
    <>
      <MuiDialogTitle
        style={{ backgroundColor: "indigo" }}
        className={classes.header}
        onClose={closeDialog}
      >
        <IconButton
          aria-label="close"
          className={classes.backButton}
          onClick={closeDialog}
        >
          <CloseIcon style={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography align="center" className={classes.headerText}>
          <FontAwesomeIcon style={{ fontSize: "5rem" }} icon={faUserGraduate} />
        </Typography>
        <Typography align="center" className={classes.headerText}>
          Add students
        </Typography>
      </MuiDialogTitle>

      <MuiDialogContent className={classes.body}>
        <Typography style={{ padding: "1rem", align: "center" }}>
          <TextField
            InputProps={{
              classes: {
                root: classes.addstudents,
              },
            }}
            required
            fullWidth
            name="new-students"
            value={newStudents}
            onChange={onChangeNewStudents}
            placeholder={placeholder}
            multiline
            rows={10}
            variant="outlined"
          />
        </Typography>
        <Typography align="center">
          <StyledButton onClick={(e) => onSubmitNewStudents(e)}>
            Submit students
          </StyledButton>
        </Typography>
      </MuiDialogContent>
    </>
  );

  return (
    <div>
      <Dialog
        classes={{
          paper: classes.root,
        }}
        onClose={closeDialog}
        open={dialogOpen.isOpen}
      >
        {renderDialog()}
      </Dialog>
    </div>
  );
}