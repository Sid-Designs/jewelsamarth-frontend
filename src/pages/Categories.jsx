import { Link } from "react-router-dom";

const Categories = () => {
    const categories = ["silver", "pearl", "gemstone"]; // Example categories

    return (
        <div>
            <h2>Choose a Category:</h2>
            {categories.map((category) => (
                <Link key={category} to={`/category/${category}`}>
                    <button>{category}</button>
                </Link>
            ))}
        </div>
    );
};

export default Categories;
