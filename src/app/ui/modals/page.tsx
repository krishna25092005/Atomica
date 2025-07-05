"use client";
import React from "react";
import Modal from "@/components/ui/Modal";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// This is a page component that demonstrates modal usage
const ModalsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modal Examples</h1>
      
      <div className="space-y-4">
        <button 
          className="btn btn-primary"
          onClick={() => (document.getElementById('demo-modal') as HTMLDialogElement)?.showModal()}
        >
          Open Demo Modal
        </button>
        
        <Modal
          id="demo-modal"
          title="Demo Modal"
          content={
            <div>
              <p>This is a demo modal component.</p>
              <p>You can use this for various UI interactions.</p>
            </div>
          }
          onCloseText="Got it!"
        />
      </div>
    </div>
  );
};

export default ModalsPage;
