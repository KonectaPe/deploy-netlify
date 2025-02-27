import Swal from "sweetalert2";
import axiosInstance from "../../lib/axios/axiosGlobal";

const API_URL = "http://zk8ggcckckwk0sksgs84w4ck.82.25.66.141.sslip.io";

export const loginRequest = async ({ user }) => {
  try {
    const { data } = await axiosInstance.post(`${API_URL}/user/login`, user);
    localStorage.setItem("token", data.token);
    return data.token;
  } catch {
    Swal.fire({
      title: "Error de autenticación",
      text: "Usuario o contraseña incorrectos. Inténtalo de nuevo.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
    localStorage.removeItem("token");
    return null;
  }
};

export const logoutRequest = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    const id = JSON.parse(atob(token.split(".")[1])).id;
    if (!token) return null;
    const { data } = await axiosInstance.get(`${API_URL}/user/${id}`);
    return data;
  } catch {
    return false;
  }
};

export const getParticipants = async (status) => {
  try {
    const { data } = await axiosInstance.get(
      `${API_URL}/participant/list/${status}`
    );
    return data;
  } catch {
    return null;
  }
};

export const addParticipant = async (participant) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_URL}/participant/register`,
      participant
    );
    return data;
  } catch {
    return null;
  }
};

export const updateParticipant = async (username, status, role) => {
  const participant = {
    status: status,
    role: role,
  };
  try {
    const { data } = await axiosInstance.put(
      `${API_URL}/participant/status/${username}`,
      participant
    );
    return data;
  } catch {
    return null;
  }
};

export const getWinners = async (rol, status) => {
  const textStatus = status ? "ACEPTADO" : "RECHAZADO";
  try {
    const { data } = await axiosInstance.get(
      `${API_URL}/participant/rol/${rol}/status/${textStatus}`
    );
    return data;
  } catch {
    return null;
  }
};

export const updatePassword = async (data) => {
  const token = localStorage.getItem("token");
  const id = JSON.parse(atob(token.split(".")[1])).id;

  const setPassword = {
    password: data.password,
  };

  try {
    const response = await axiosInstance.put(
      `${API_URL}/user/${id}`,
      setPassword
    );
    return response;
  } catch {
    return null;
  }
};

export const deleteData = async () => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/delete/confirm`);
    return response;
  } catch {
    return null;
  }
};

export const updateParticipantData = async (data) => {
  const id = data.id;
  const participant = {
    username: data.username,
    fullName: data.fullName,
    speciality: data.speciality,
    area: data.area,
  };
  try {
    const response = await axiosInstance.put(
      `${API_URL}/participant/user/${id}`,
      participant
    );
    return response;
  } catch {
    return null;
  }
};
