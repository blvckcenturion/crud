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
      <DialogContent className="w-full sm:w-1/2 sm:max-w-[425px]">
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