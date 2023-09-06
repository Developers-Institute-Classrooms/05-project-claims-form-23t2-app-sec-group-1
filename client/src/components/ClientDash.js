import ViewClaim from "./ViewClaim";
import { Link } from "react-router-dom";

const ClientDash = ({ list }) => {
  return (
    <div>
      <h2 className="client-dashboard">Claimant Dashboard</h2>
      {/* <h3>Customer ID:{list[0].customer_id}</h3> */}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Claim ID </th>
            <th>Claim Status</th>
            <th>
              <Link to="/claim">
                <button className="btn-claim btn" type="button">
                  Create new claim!
                </button>
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((claim) => (
            <tr key={claim.claim_id}>
              <td>{claim.claim_id}</td>
              <td>{claim.status}</td>
              <td>
                <ViewClaim claim={claim} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/profile">
        <button className="btn-profile btn" type="button">
          Go to Profile Page
        </button>
      </Link>
    </div>
  );
};

export default ClientDash;
