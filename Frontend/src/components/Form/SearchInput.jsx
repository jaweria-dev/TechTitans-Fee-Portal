import React from "react";
import { useSearch, SearchProvider } from "../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
    const [values, setValues] = useSearch(); // Ensure this is correct
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(
                `http://localhost:9000/api/fee/portal/students/search-student/${values.keyword}`
            );
            setValues({ ...values, results: data });
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="btn2 btn-outline-success" type="submit" style={{ width: "100px" }}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;
