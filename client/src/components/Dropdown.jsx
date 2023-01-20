import { useState, useEffect } from "react";
import { MenuItem, TextField } from "@mui/material";

// Returns a <select> element to be used in a form as a dropdown
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
            <TextField select
                rules={{ required: true }}
                name={props.name}
                id={props.id}
                value={props.value}
                label={props.label}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                required
            >
                {optionsArr}
            </TextField>
        </>
    );
}

export default Dropdown;
