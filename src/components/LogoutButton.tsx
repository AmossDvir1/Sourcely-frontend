import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./atoms/CustomButton";
const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center gap-2">
        <CustomButton theme="secondary" startIcon={<LogoutIcon />} onClick={logout}>
          Logout
        </CustomButton>
    </div>
  );
};

export default LogoutButton;
