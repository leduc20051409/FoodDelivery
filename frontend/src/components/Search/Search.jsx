import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { topMeels } from "../../assets/TopMeel"
import { PopularCuisines } from "./PopularCuisines‎";
import SearchDishCard from "./SearchDishCard";
import { useDispatch, useSelector } from "react-redux";
import { searchMenuItem } from "../../State/Customer/Menu/Action";

const dish = [1, 1, 1, 1];
const Search = () => {
    const dispatch = useDispatch();
    const { menu, auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        // Add debouncing to avoid too many API calls
        const timeoutId = setTimeout(() => {
            if (keyword.trim()) {
                dispatch(searchMenuItem({
                    keyword: keyword,
                    restaurantId: null  
                }));
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [keyword, dispatch]);

    return (
        <div className="px-5 lg:px-[18vw]">
            <div className="relative py-5">
                <SearchIcon className="absolute top-[2rem] left-2" />
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="p-2 py-3 pl-12 w-full bg-[#242B2E] rounded-sm outline-none"
                    type="text"
                    placeholder="search food..."
                />
            </div>
            <div>
                <h1 className="py-5 text-2xl font-semibold">Popular Cuisines</h1>
                <div className="flex flex-wrap ">
                    {topMeels.slice(0, 9).map((item) => (
                        <PopularCuisines image={item.image} title={item.title} />
                    ))}
                </div>
            </div>
            <div className=" mt-7">
                {menu.search.map((item) => (
                    <SearchDishCard item={item} />
                ))}
            </div>
        </div>
    );
};

export default Search;