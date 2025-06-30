import { Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Supplier } from "../types/supplierType";

interface HeadProps {
  onOpenCreateModal: () => void;
  suppliers: Supplier[];
}

const Head: React.FC<HeadProps> = ({ onOpenCreateModal, suppliers }) => {

  return (
    <div className="container mx-auto flex justify-center sm:justify-between flex-wrap items-center my-5 gap-5">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <span className="bg-[#efb100] px-4 py-2 rounded-full size-8 flex justify-center items-center font-medium">
          {suppliers.length > 0 ? suppliers.length : "0"}
        </span>
      </div>

      <Chip
        icon={<AddIcon style={{ color: "black" }} />}
        label="Nuevo Proveedor"
        variant="filled"
        onClick={onOpenCreateModal}
        className="font-medium"
        style={{ backgroundColor: "#efb100", fontFamily: "Montserrat" }}
      />
    </div>
  );
};

export default Head;
