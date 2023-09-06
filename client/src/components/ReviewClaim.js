import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const EditClaim = ({ claim }) => {
  const [status, setStatus] = useState(claim.status);
  const { getAccessTokenSilently } = useAuth0();
  const statusOptions = ["submitted", "in progress", "approved", "denied"];
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const updateStatus = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently();
      const body = { status };
      await fetch(
        `${process.env.REACT_APP_API_SERVER_URL}/api/form/${claim.claim_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      closeModal();
      window.location = "/dashboard";
    } catch (err) {
      console.error(err.message);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setStatus(claim.status);
  };

  return (
    <>
      <button type="button" className="btn btn-warning" onClick={openModal}>
        Review
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Review Claim"
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
          <select
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-warning"
            onClick={updateStatus}
          >
            Save Change
          </button>
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

export default EditClaim;
