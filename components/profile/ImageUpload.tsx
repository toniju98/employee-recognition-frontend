import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (file: File) => Promise<boolean | void>;
}

export function ImageUpload({
  onUploadSuccess,
  currentImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUploadSuccess(file);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <input
        accept="image/*"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload">
        <Button
          component="span"
          variant="contained"
          size="small"
          startIcon={<PhotoCamera />}
          disabled={uploading}
          sx={{
            minWidth: "unset",
            padding: "4px 8px",
            borderRadius: "50%",
            "& .MuiButton-startIcon": {
              margin: 0,
            },
          }}
        >
          {uploading ? <CircularProgress size={20} /> : <PhotoCamera />}
        </Button>
      </label>
    </Box>
  );
}
