import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AdminDash from "./AdminDash";
import ClientDash from "./ClientDash";

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getClaims = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_URL}/api/form/dashboard`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const jsonData = await response.json();

        if (jsonData.role === "Admin") {
          setIsAdmin(true);
          setIsLoading(false);
          setClaims(jsonData.claims);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
          setClaims(jsonData.claims);
        }
      } catch (err) {
        setIsLoading(false);
        setHasError(true);
        console.error(err.message);
      }
    };

    getClaims();
  }, [getAccessTokenSilently]);

  return (
    <>
      {isLoading && <p>Loading Claims...</p>}
      {hasError && <p>There was an error loading the Claims.</p>}
      {isAdmin ? <AdminDash list={claims} /> : <ClientDash list={claims} />}
    </>
  );
};

export default Dashboard;
