import React, { useState, useCallback } from "react";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage"; // см. ниже
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  salon: {
    id: number;
    name: string;
    address: string;
    description: string;
    imagesrc: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export const EditSalonModal: React.FC<Props> = ({
  salon,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: salon.name,
    address: salon.address,
    description: salon.description,
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("description", formData.description);

      if (imageSrc && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        data.append("image", croppedBlob, "cropped.jpeg");
      }

      await axios.put(`${API_BASE_URL}/api/salons/${salon.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Ошибка при обновлении салона:", err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Редактировать салон</h3>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Название"
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Адрес"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <input type="file" onChange={handleFileChange} />

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
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </Modal>
  );
};
