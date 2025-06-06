import React from 'react'
import { Box, Container, Toolbar, Paper, Stepper, Step, StepLabel, Button, Link, Typography, createTheme, ThemeProvider } from "@mui/material";
import { useState } from 'react';
import AddressForm from '../components/AddressForm';
import PaymentForm from '../components/PaymentForm';
import ReviewForm from '../components/ReviewForm';
import { useEffect } from 'react';
import { clearCart } from '../feature/cart-slice';
import { clearCheckoutInfo } from '../feature/checkout-slice';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust if your store type is elsewhere

import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


interface Payment {
    method?: string;
    name?: string;
    cardNumber?: string;
    expDate?: string;
    cvv?: string;
    insufficientBalance?: boolean;
    totalRequired?: number;

}

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
    const payment: Payment = useSelector((state: RootState) => state.checkout?.payment);

    const RECIPIENT_ADDRESS = "0x44d278a312851f7c8094e607e182581298ec868b77f7051713db8bb71c927163";

    //client setup 
    const config = new AptosConfig({ network: Network.TESTNET })
    const aptos = new Aptos(config);


    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        if (activeStep === steps.length) {
            dispatch(clearCart());
            dispatch(clearCheckoutInfo());
        }
    }, [activeStep]);

    const sendAptosPayment = async (totalRequired: number) => {
        if (!account || !signAndSubmitTransaction) {
            console.error("Wallet not connected or sign function not available");
            return;
        }

        try {
            // Convert APT to Octas (1 APT = 10^8 Octas)

            // export type InputTransactionData = {
            //     sender?: AccountAddressInput;
            //     data: InputGenerateTransactionPayloadData;
            //     options?: InputGenerateTransactionOptions & {
            //         expirationSecondsFromNow?: number;
            //         expirationTimestamp?: number;
            //     };
            //     withFeePayer?: boolean;
            // };

            // type InputEntryFunctionData = {
            //     function: MoveFunctionId;
            //     typeArguments?: Array<TypeArgument>;
            //     functionArguments: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>;
            //     abi?: EntryFunctionABI;
            // };
            console.log('account address CHECKOUT ', account.address);
            console.log('totalREquired CHECKOUT ', totalRequired);

            const totalRequiredSend = BigInt(String(Math.floor(totalRequired)));


            const transaction: InputTransactionData = {
                sender: account.address.toString(), // convert AccountAddress to string
                data: {
                    function: "0x1::aptos_account::transfer",
                    typeArguments: [],
                    functionArguments: [
                        "0x44d278a312851f7c8094e607e182581298ec868b77f7051713db8bb71c927163", // recipient
                        totalRequiredSend.toString(), // amount in octas (u64)
                    ],
                },
            };

            const response = await signAndSubmitTransaction(transaction);
            const result = await aptos.waitForTransaction({ transactionHash: response.hash });

            alert("Transaction success!\nHash: " + result.hash);
        } catch (error) {
            console.error("Aptos payment failed:", error);
            alert("Aptos payment failed: " + error);

            // Show error toast or feedback here
        }
    }

    function handleNext() {
        if (activeStep < steps.length) {
            setActiveStep(activeStep + 1);
        }
        if (activeStep === steps.length - 1) {
            // Place Order button is clicked
            if (!payment?.insufficientBalance && payment?.method === 'crypto' && payment?.totalRequired) {
                // here pay the totalRequired
                sendAptosPayment(payment?.totalRequired);
            }
        }

    }

    useEffect(() => { console.log('payment CHECKOUT USEEFFECT ', payment) }, [payment]);

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
                            <Button onClick={handleNext}
                                disabled={payment?.insufficientBalance}
                                color="success" variant='contained'>{activeStep === steps.length - 1 ? "Place Order" : "Next"}</Button>
                        </Box>
                    </>
                )
            }
        </Paper>
    </Container>
}
