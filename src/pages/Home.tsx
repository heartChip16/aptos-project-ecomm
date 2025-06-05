import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Container,
    Grid,
    Button,
    IconButton,
    Collapse,
    Rating
} from '@mui/material';
import { ExpandMore, ExpandMore as ExpandMoreIcon, ShoppingCartSharp, Star as StarIcon } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToCart } from '../feature/cart-slice';
import { fetchAllProducts } from '../feature/products-slice';
import type { RootState } from '../store'; // adjust based on your store file location
// import type { Product } from '../types'; // adjust based on where your Product type is defined
import type { Product } from '../feature/products-slice';
import type { AppDispatch } from '../store'; // Adjust path as needed

interface ProductWithId extends Product {
    id: number | string;
}

export default function Home() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || 'all';
    const searchTerm = searchParams.get("searchterm");
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();

    const { value: products = [], loading } = useSelector((state: RootState) => state.products);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchAllProducts());
        }
    }, [dispatch, products.length]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function addProductToCart(product: ProductWithId) {
        dispatch(addToCart({ product, quantity: 1 }));
    }

    let filteredProducts = products;

    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter((prod) => prod.category === category);
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter((prod) =>
            prod.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2} sx={{ alignContent: "space-evenly", justifyContent: "center" }}>
                {filteredProducts.map(({ title, id, image, price, rating, description }: ProductWithId) => (
                    <Grid item key={id} xs={12} sm={6} md={3} sx={{ margin: "10px" }}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", padding: "10px" }}>
                            <CardMedia
                                component="img"
                                height="270"
                                width="100"
                                image={image}
                                alt={title}
                                sx={{ objectFit: "contain", backgroundColor: "white" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" sx={{ color: "darkgreen", fontSize: "16px" }}>
                                    {title}
                                </Typography>
                                <CardContent sx={{ display: "flex", justifyContent: "flex-start", paddingBottom: "5px", paddingLeft: "0", paddingTop: "3px" }}>
                                    <Rating
                                        value={rating?.rate}
                                        size="small"
                                        readOnly
                                        precision={0.5}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    <Typography sx={{ fontSize: "10px", transform: "translateY(3px)" }}>
                                        {rating?.count} Reviews
                                    </Typography>
                                </CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ color: "black", fontSize: "12px" }}>
                                    USD {price}
                                </Typography>
                                <CardContent sx={{ display: "flex", flexDirection: "row", flexGrow: 1, padding: 0, justifyContent: "flex-start", alignItems: "center" }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ color: "black", fontSize: "12px" }}>
                                        Product ID: {id}
                                    </Typography>
                                    <CardActions disableSpacing>
                                        <IconButton
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more"
                                            sx={{ color: "black" }}
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                        <IconButton
                                            color="success"
                                            sx={{ fontSize: "12px", borderRadius: "4px", color: "white", backgroundColor: "green" }}
                                            onClick={() => addProductToCart({ title, id, image, price, rating, description, category })}
                                        >
                                            <ShoppingCartSharp sx={{ color: "white" }} />
                                            <Typography sx={{ fontSize: "12px" }} color="success" variant="body2">
                                                Add to cart
                                            </Typography>
                                        </IconButton>
                                    </CardActions>
                                </CardContent>
                                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ padding: 0 }}>
                                    <CardContent sx={{ padding: 0 }}>
                                        <Typography variant="h6" color="text.secondary" sx={{ color: "black", fontSize: "12px" }} paragraph>
                                            Description:
                                        </Typography>
                                        <Typography sx={{ color: "black", fontSize: "12px" }} paragraph>
                                            {description}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
