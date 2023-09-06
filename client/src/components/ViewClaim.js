import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewClaim = ({ claim }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn btn-warning" onClick={openModal}>
        View Claim
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="View Claim"
      >
        <h4>Review Claim</h4>
        <button className="close" onClick={closeModal}>
          &times;
        </button>

        <div className="modal-body">
          <h2>Claim Details</h2>
          {Object.keys(claim).map((key) => (
            <p key={key}>{`${key}: ${claim[key]}`}</p>
          ))}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-close"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ViewClaim;
