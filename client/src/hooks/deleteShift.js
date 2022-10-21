import { useState } from 'react';
import axios from 'axios';

export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [prevSuccess, setPrevSuccess] = useState(null);
    const [count, setCount] = useState(null);

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { id, userId } = dataObject;
        try {
            await axios({
                method: 'DELETE',
                url: '/api/shifts/',
                data: {
                    id,
                    userId
                },
                headers:
                    new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }),
                withCredentials: true

            }).then(res => {
                if (!prevSuccess || (success !== prevSuccess)) {
                    setPrevSuccess(success);
                } else {
                    setPrevSuccess(null);
                }
                setSuccess(res.data.success);
                setCount(res.data.count);
                setError(null);

                if (res.data.redirect === '/') {
                    window.location = '/';
                } else if (res.data.redirect === '/login') {
                    window.location = '/login';
                }
            })
        } catch (err) {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError(err.response.data.message);
        }

    };

    return {
        values,
        handleSubmit,
        error,
        setError,
        success,
        count
    }
}