import { useLoaderData, redirect, Link } from "react-router-dom";
import CardProfile from "./user/CardProfile";
import CardCar from "./car/CardCar";
import CardPlug from "./CardPlug";
import Home from "../../assets/images/clarity_home-solid.png";
import { fetchDataUsers } from "../../services/authVerify";
import "./profile.scss";

export const fetchCarUser = async () => {
  if (!localStorage.getItem("user")) {
    return redirect("/logout");
  }
  const { VITE_BACKEND_URL } = import.meta.env;
  const { id } = JSON.parse(localStorage.getItem("user"));
  const isadmin = await fetchDataUsers(id);
  const response = await fetch(`${VITE_BACKEND_URL}/api/cars-user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 500) {
    localStorage.clear();
    return redirect("/logout");
  }
  const data = await response.json();
  data.user = isadmin;
  if (!data) {
    return null;
  }
  return data;
};
function Profile() {
  const dataCars = useLoaderData();
  const dataUser = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="profile">
      <section className="profile-garage">
        <div className="profile-garage-text">
          <div className="picture-car" />
          <div className="profile-garage-contain-title">
            {dataUser && (
              <h1>
                {`${dataUser.name} 
                ${dataUser.firstname}  `}
              </h1>
            )}
            {dataCars.length > 0 && <p>{`${dataCars[0].model}`}</p>}
          </div>
        </div>
      </section>
      {dataCars.user.is_admin === 1 && (
        <div className="row">
          <img className="icon-link" src={Home} alt="icon-link" />
          <Link to="/admin">Tableau de Bord</Link>
        </div>
      )}

      <div className="df-row">
        <CardProfile />
        <CardPlug />
        <CardCar />
      </div>
    </div>
  );
}

export default Profile;
