import { useAuth } from "../hooks/useAuth";
import Analyzer from "./analyzer/Analyzer";
import GuestPage from "./GuestPage";

const HomePage:React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (isAuthenticated? (<Analyzer></Analyzer>) : (<GuestPage></GuestPage> )
    
  );
}

export default HomePage;