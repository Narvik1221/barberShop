import React, { useState, useCallback } from "react";
import Modal from "./Modal";
import axios from "axios";
import styles from "./Modal.module.scss";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage"; // Убедись, что путь корректный
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const AddSalonModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      alert("Пожалуйста, выберите изображение и выполните обрезку.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("address", formData.address);
      form.append("description", formData.description);
      form.append("image", croppedBlob, "cropped.jpeg");

      await axios.post(`${API_BASE_URL}/api/salons`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Салон успешно добавлен!");
      onCreated();
      onClose();
    } catch (err) {
      console.error("Ошибка при создании салона:", err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Добавить салон</h3>
      <input
        className={styles.input}
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Название"
      />
      <input
        className={styles.input}
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Адрес"
      />
      <textarea
        className={styles.input}
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div className={styles.cropContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <div className={styles.modalActions}>
        <Button onClick={handleSubmit}>Создать</Button>
      </div>
    </Modal>
  );
};
