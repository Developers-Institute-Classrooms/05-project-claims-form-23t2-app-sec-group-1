import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const InputForm = () => {
  const [profileData, setProfileData] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editItemValue, setEditItemValue] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_SERVER_URL}/api/form/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const jsonData = await response.json();
      setProfileData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditClick = (key, value) => {
    setEditItemId(key);
    setEditItemValue(value);
  };

  const handleEditInputChange = (event) => {
    setEditItemValue(event.target.value);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const updatedProfileData = {
      [editItemId]: editItemValue,
    };

    try {
      const accessToken = await getAccessTokenSilently();
      await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/form/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedProfileData),
      });
      fetchData();
    } catch (err) {
      console.error(err.message);
    }

    setEditItemId(null);
    setEditItemValue("");
  };

  return (
    <>
      <div className="profile-page">
        <h1>Claimant Profile</h1>
        {Object.keys(profileData).map((key, index) => (
          <div key={key} className="profile-item">
            {key}:&nbsp;
            {index < 5 ? (
              // Display the value without Edit button for the first three indexes
              profileData[key]
            ) : (
              <>
                {editItemId === key ? (
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      value={editItemValue}
                      onChange={handleEditInputChange}
                      className="profileEditInput"
                    />
                    <button type="submit" className="btn-profile-save">
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    {profileData[key]}
                    <button
                      onClick={() => handleEditClick(key, profileData[key])}
                      className="btn-profile-edit"
                    >
                      Edit
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default InputForm;
