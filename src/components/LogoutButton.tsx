import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";
import Button from "./atoms/Button";
const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center gap-2">
        <Button startIcon={<LogoutIcon />} onClick={logout}>
          Logout
        </Button>
    </div>
  );
};

export default LogoutButton;
