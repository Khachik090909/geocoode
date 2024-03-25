import { useState, useEffect } from "react";
import ModyfyUser from "./ModyfyUser";
import flachBase from "../../../assets/flachBase.svg";
import flachHaute from "../../../assets/flachHaute.svg";
import line from "../../../assets/Line.svg";
import profileImage from "../../../assets/images/profilImag.png";
import stylo from "../../../assets/stylo.svg";

function CardProfile() {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [age, setAge] = useState(null);
  const [genderFr, setGenderFr] = useState({});
  const [cordoneClick, setCordoneClick] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { VITE_BACKEND_URL } = import.meta.env;
      const { id } = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!data) {
          return null;
        }
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
      return null;
    };
    fetchUser();
  }, [modal]);
  useEffect(() => {
    if (userData.gender === "male") {
      setGenderFr("Homme");
    } else if (userData.gender === "female") {
      setGenderFr("Femme");
    } else {
      setGenderFr("Autre");
    }
  }, [userData]);
  useEffect(() => {
    // Function to calculate age based on birthdate
    const calculateAge = () => {
      const birthdateDate = new Date(userData.date_of_birth);
      const currentDate = new Date();

      let calculatedAge =
        currentDate.getFullYear() - birthdateDate.getFullYear();

      // Adjust age if birthday hasn't occurred yet this year
      if (
        currentDate.getMonth() < birthdateDate.getMonth() ||
        (currentDate.getMonth() === birthdateDate.getMonth() &&
          currentDate.getDate() < birthdateDate.getDate())
      ) {
        calculatedAge -= 1;
      }

      setAge(calculatedAge.toString()); // Convert age to string before setting state
    };

    calculateAge();
  }, [userData.date_of_birth]);
  const handlerClick = (e) => {
    setShow(!show);
    setCordoneClick(e.pageY);
  };
  useEffect(() => {
    if (cordoneClick) {
      window.scrollTo({
        top: cordoneClick,
        behavior: "smooth",
      });
    }
  }, [cordoneClick]);
  return (
    <div className={show ? "card-profile-show card-profile" : "card-profile"}>
      <div className="card-profile-header">
        <div className="card-profile-button-title">
          <button
            type="button"
            className="card-profile-header-button"
            onClick={(e) => handlerClick(e)}
          >
            {show ? (
              <img src={flachHaute} alt="flach" />
            ) : (
              <img src={flachBase} alt="flach" />
            )}
          </button>

          <h1>Profil</h1>
        </div>

        <button
          type="button"
          className="card-profile-header-icons"
          onClick={() => setModal(true)}
        >
          <img src={stylo} alt="stylo" />
        </button>
      </div>
      <img className="card-profile-line" src={line} alt="line" />
      <div className="cart-content">
        <div className="cart-content-up">
          <img src={profileImage} alt="profile" />
          <ul className="cart-content-text">
            <li>{`${userData.name} ${userData.firstname}`}</li>
            <li>{age} ans</li>
            <li>{`${userData.postal_code} ${userData.city}`}</li>
          </ul>
        </div>
        {show && (
          <div className="cart-content-down">
            <ul className="cart-content-text">
              <li>{userData.email}</li>
              {genderFr && <li>{genderFr}</li>}
              <li>Nombre de véhicules : {userData.number_vehicles}</li>
            </ul>
          </div>
        )}
      </div>
      {modal && <ModyfyUser setModal={setModal} userData={userData} />}
    </div>
  );
}

export default CardProfile;
