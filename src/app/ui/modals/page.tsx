import React from "react";

interface ModalProps {
  id: string;
  title: string;
  content: React.ReactNode;
  onCloseText?: string;
}

const Modal: React.FC<ModalProps> = ({ id, title, content, onCloseText }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box bg-[#ffffff] text-black dark:bg-[#181818] dark:text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="py-4">{content}</div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">{onCloseText || "Close"}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

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
