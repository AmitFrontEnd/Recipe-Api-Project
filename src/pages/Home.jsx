import RecipeList from "../components/RecipeList";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const [query] = useOutletContext();
  return <RecipeList query={query} />;
};

export default Home;
