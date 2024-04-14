import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Button, Container, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup} from "@mui/material";
import {useEffect, useState} from "react";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";


export default function Add() {
    const paperStyle={padding:'50px 20px',width:700,margin:"20px auto"}
    const[name,setName]=useState('')
    const[potentialPrice,setPrice]=useState('')
    const[repairDescription,setRepair]=useState('')
    const[status,setStatus]=useState('')
    const[failureType,setFailure]=useState('')
    const[failures,setFailures]=useState([])
    const [date, setDate] = React.useState(dayjs());
    const [potentialDate, setPotential] = React.useState(dayjs());

    const handleClick=(e)=>{
        e.preventDefault()
        const add={name,potentialPrice,failureType,repairDescription,status,potentialDate, date}
        console.log(add)
        fetch("http://localhost:8080/api/v1/failures/new-failure",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(add)
        })

    }
    useEffect(() => {
        fetch("http://localhost:8080/api/v1/failures").then(res=>res.json()).then((result) => {
            setFailures(result);
        }
        )}, []);
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Container>
                <Paper elevation={3} style={paperStyle}>
                    <h1 style={{color:"blue"}}>Dodaj zgłoszenie</h1>
            <div>
                <FormControl>
                    <FormLabel id="failure_type">Rodzaj awarii</FormLabel>
                    <RadioGroup
                        aria-labelledby="failure_type"
                        value={failureType}
                        onChange={(e)=>setFailure(e.target.value)}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="LOW" control={<Radio />} label="Niewielka" />
                        <FormControlLabel value="MILD" control={<Radio />} label="Średnia" />
                        <FormControlLabel value="HIGH" control={<Radio />} label="Poważna" />
                        <FormControlLabel value="CRITICAL" control={<Radio />} label="Krytyczna" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    id="name"
                    label="Nazwa urządzenia"
                    defaultValue="Urządzenie"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Data zgłoszenia"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                    />
                </LocalizationProvider>
                <FormControl>
                    <FormLabel id="status">Status naprawy</FormLabel>
                    <RadioGroup
                        aria-labelledby="status"
                        name="radio-buttons-group"
                        value={status}
                        onChange={(e)=>setStatus(e.target.value)}
                    >
                        <FormControlLabel value="NEW" control={<Radio />} label="Nowe" />
                        <FormControlLabel value="IN_PROGRESS" control={<Radio />} label="W trakcie" />
                        <FormControlLabel value="FINISHED" control={<Radio />} label="Ukończone" />
                        <FormControlLabel value="UNREPAIRABLE" control={<Radio />} label="Nie do naprawy" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    id="price"
                    value={potentialPrice}
                    onChange={(e)=>setPrice(e.target.value)}
                    label="Szacowany koszt"
                    type="number"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Szac. ukończenie"
                        value={potentialDate}
                        onChange={(newValue) => setPotential(newValue)}
                    />
                </LocalizationProvider>
                <TextField
                    id="repair_description"
                    value={repairDescription}
                    label="Opis podjętych działań"
                    onChange={(e)=>setRepair(e.target.value)}
                    fullWidth={false}
                />
            </div>
            <div>
                <Button variant="contained" onClick={handleClick}>Zatwierdź</Button>
            </div>
                </Paper>
                <Paper elevation={3} style={paperStyle}>
                    {failures.map(failure=>(
                        <Paper elevation={6} style={{margin:"10px",padding:"15px",textAlign:"left"}}>
                        Name:{failure.name}
                        type:{failure.failureType}
                        price:{failure.potentialPrice}
                        status:{failure.status}
                        date:{failure.date}
                        potential:{failure.potentialDate}
                        repair:{failure.repairDescription}


                        </Paper>
                    ))}
                </Paper>
            </Container>
        </Box>
    );
}