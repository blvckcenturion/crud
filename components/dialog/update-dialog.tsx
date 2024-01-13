import React, { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface UpdateFormDialogComponentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  formComponent: ReactNode; // ReactNode type for JSX elements
}

const UpdateFormDialogComponent: React.FC<UpdateFormDialogComponentProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  formComponent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: '40%' }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {formComponent}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFormDialogComponent;