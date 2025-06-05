import React from 'react'
import { Box, Container, Toolbar, Paper, Stepper, Step, StepLabel, Button, Link, Typography, createTheme, ThemeProvider } from "@mui/material";
import { useState } from 'react';
import AddressForm from '../components/AddressForm';
import PaymentForm from '../components/PaymentForm';
import ReviewForm from '../components/ReviewForm';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../feature/cart-slice';
import { clearCheckoutInfo } from '../feature/checkout-slice';

import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";


const steps = ["Shipping Address", "Payment Details", "Review Order"];

function getStepContent(activeStep: any) {
    switch (activeStep) {
        case 0:
            return <AddressForm />;
            break;
        case 1:
            return <PaymentForm />;
            break;
        case 2:
            return <ReviewForm />;
            break
        default:
            throw new Error("Unknown step");
    }
}


export default function Checkout() {

    // for Aptos Wallet Petra: 
    const { account, signAndSubmitTransaction } = useWallet();
    const [loading, setLoading] = useState(false);


    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        if (activeStep === steps.length) {
            dispatch(clearCart());
            dispatch(clearCheckoutInfo());
        }
    }, [activeStep])


    function handleNext() {
        if (activeStep < steps.length) {
            setActiveStep(activeStep + 1);
        }
    }

    function handleBack() {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    }

    return <Container component="section" maxWidth="lg" sx={{ mb: 4 }} color="success">
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} color="success">
            <Typography component="h1" variant="h4" align="center" color="success">
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, color: "green" }} color="success">
                {steps.map((label) => (
                    <Step key={label} color="success" sx={{
                        color: "green", ".css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": { color: "green" }, ".css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed": {
                            color: "green"
                        }
                    }}>
                        <StepLabel color="success" sx={{ color: "green" }}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ?
                (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order!
                        </Typography>
                        <Typography>
                            Your order number is #1234. We have emailed you the details regarding your order confirmation.
                        </Typography>
                        <Link href='/' sx={{ color: "green", textDecorationColor: "green" }}>Shop More</Link>
                    </>

                )
                : (
                    <>
                        {getStepContent(activeStep)}
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            {activeStep !== 0 && (<Button onClick={handleBack} color="success" variant="contained" sx={{ mr: 2 }}>Back</Button>)}
                            <Button onClick={handleNext} color="success" variant='contained'>{activeStep === steps.length - 1 ? "Place Order" : "Next"}</Button>
                        </Box>
                    </>
                )
            }
        </Paper>
    </Container>
}
