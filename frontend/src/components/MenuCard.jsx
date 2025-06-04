import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React, { use, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { categorizeIngredient } from './Util/CategorizeIngredient';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../State/Customer/Cart/Action';


const MenuCard = ({ item }) => {
    const {auth} = useSelector(store => store);
    const ingredients = [
        {
            category: "Nuts & seeds",
            ingredient: "Cashews"
        },
        {
            category: "Protein",
            ingredients: "Protein"
        },
        {
            category: "Protein",
            ingredients: "Bacon strips"
        }
    ];
    const demo = [
        {
            category: "Nuts & seeds",
            ingredients: ["Cashews"]
        },
        {
            category: "Protein",
            ingredients: ["Ground beef", "Bacon strips"]
        }
    ];

    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const dispatch = useDispatch();
    const handleAddToCart = (e) => {
        e.preventDefault();

        if (!auth.jwt) {
            alert("Please login to add items to cart");
            return;
        }

        const reqData = {
            token: localStorage.getItem("token"),
            cartItem: {
                foodId: item.id,
                quantity: 1,
                ingredients: selectedIngredients,
            }
        };
        dispatch(addItemToCart(reqData));
        console.log("reqData", reqData);
    }
    const handleCheckboxChange = (itemName) => {
        if (selectedIngredients.includes(itemName)) {
            setSelectedIngredients(
                selectedIngredients.filter((item) => item !== itemName)
            );
        } else {
            setSelectedIngredients([...selectedIngredients, itemName]);
        }
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div className="lg:flex items-center justify-between">
                    <div className="lg:flex items-center lg:gap-5">
                        <img
                            className="w-[7rem] h-[7rem] object-cover"
                            src={item.images[0]}
                        />
                        <div className="space-y-1 lg:space-y-5 lg:max-w-2xl">
                            <p className="font-semibold text-xl">{item.name}</p>
                            <p>₹{item.price}</p>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleAddToCart} >
                    <div className="flex gap-5 flex-wrap">
                        {Object.keys(categorizeIngredient(item.ingredientItems)).map((category, index) => (
                            <div key={index}>
                                <p className="font-semibold mb-2">{category}</p>
                                <FormGroup>
                                    {categorizeIngredient(item?.ingredientItems)[category].map((ingredient, idx) => (
                                        <FormControlLabel
                                            key={ingredient.id}
                                            control=
                                            {<Checkbox
                                                checked={selectedIngredients.includes(ingredient.name)}
                                                onChange={() => handleCheckboxChange(ingredient.name)} />
                                            }
                                            label={ingredient.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                        ))}
                    </div>
                    <div className="pt-5">
                        <Button variant="contained" disabled={false} type="submit">
                            {true ? "Add to Cart" : "Out Of Stock"}
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    )
}

export default MenuCard
