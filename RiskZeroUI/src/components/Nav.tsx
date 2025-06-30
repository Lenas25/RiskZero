import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/RiskZero.png";
import { Popover } from "@mui/material";
import { useState } from "react";

const Nav = () => {
  const { getUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const user = getUser();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <nav className="container mx-auto flex justify-center sm:justify-between items-center flex-wrap sm:flex-row gap-3">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="RiskZero Logo" width={50} />
        <div className="text-lg font-semibold">RiskZero</div>
      </div>
      <div className="flex items-center space-x-2">
        <AccountCircleIcon fontSize="large" />
        <button
          className="flex items-center space-x-2 text-gray-700"
          onClick={handleClick}
          aria-describedby={id}>
          <p>{user?.email}</p>
          <KeyboardArrowDownIcon />
        </button>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }} className="mt-2">
        <p className="px-4 py-2 text-sm" onClick={logout}>Cerrar Sesión</p>
      </Popover>
    </nav>
  );
};

export default Nav;
