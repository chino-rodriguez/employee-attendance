import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, Box, Container, TextField } from "@mui/material";

// Returns a <select> element to be used in a form as a dropdown
// Used in AddExercise, MuscleGroupFilter to show muscleGroups
// Used in AddSet to show Exercises
function Dropdown(props) {
    const [options, setOptions] = useState(props.options);

    let optionsArr = [
        <MenuItem value="" key="0" selected>
            Select a position
        </MenuItem>
    ];

    // Add options from props to array
    for (let option of options) {
        optionsArr.push(
            <MenuItem value={option} key={option}>
                {option}
            </MenuItem>
        );
    }

    useEffect(() => {
        setOptions(props.options);
    }, [props]);

    return (
        <>
            {/* <InputLabel id="dropdown-label">{dropdownLabel}</InputLabel> */}
            <TextField select
                rules={{ required: true }}
                name={props.name}
                id={props.id}
                value={props.value}
                label={props.label}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                // sx={{ display: "block" }}
                required
            >
                {optionsArr}
            </TextField>
        </>
    );
}

export default Dropdown;
