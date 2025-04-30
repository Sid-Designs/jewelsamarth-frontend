import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { AuthTabs } from "./AuthTabs"; // your existing component

const Modal = ({ open, onClose, formData, setFormData, signUp, logIn, defaultActiveTab, isLoading, errorMessage }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/40 z-40" />
      <DialogContent className="z-50 p-0 bg-white max-w-[900px] rounded-xl shadow-xl overflow-hidden">
        <AuthTabs
          formData={formData}
          setFormData={setFormData}
          signUp={signUp}
          logIn={logIn}
          defaultActiveTab={defaultActiveTab}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
