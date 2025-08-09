import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";
import { CustomButton } from "./atoms/CustomButton";
const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center gap-2">
        {/* <Button
          className=""
          variant="outlined"
          onClick={logout}
          startIcon={<LogoutIcon />}
          color="inherit"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.23)", // Match theme toggle button style
            color: "white",
          }}
        > */}
        <CustomButton theme="secondary" startIcon={<LogoutIcon />} onClick={logout}>
          Logout
        </CustomButton>
    </div>
  );
};

export default LogoutButton;
