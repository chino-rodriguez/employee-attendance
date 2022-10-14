import { useState } from 'react';
import axios from 'axios';

export default function useForm({ initialValues, slug }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [success, setSuccess] = useState(null);

    //track form values
    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
    };

    //submit form when enter key is pressed
    const handleKeyDown = event => {
        const enter = 13;
        if (event.keyCode === enter) {
            handleSubmit(event);
        }
    }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { date, timeIn, timeOut, position } = dataObject;
        if (date === '' || timeIn === '' || timeOut === '' || position === '') {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError('Please fill out empty fields.');
        } else {
            try {
                await axios({
                    method: 'POST',
                    url: `${baseUrl}/api/entries/add`,
                    data: {
                        date,
                        timeIn,
                        timeOut,
                        position
                    },
                    headers:
                        new Headers({
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }),
                    withCredentials: true

                }).then(res => {
                    setSuccess(res.data.success);
                    setError(null);
                    if (res.data.redirect === '/') {
                        window.location = '/';
                    } else if (res.data.redirect === '/login') {
                        window.location = '/login';
                    }
                })
            } catch (err) {
                console.log(err);
                if (!prevError || (error !== prevError)) {
                    setPrevError(error);
                } else {
                    setPrevError(null);
                }
                setError(err.response.data.message);
            }
        }

    };

    return {
        handleChange,
        handleKeyDown,
        values,
        setValues,
        handleSubmit,
        error,
        prevError
    }
}