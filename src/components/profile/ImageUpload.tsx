import { useState } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (file: File) => Promise<boolean | void>;
}

export function ImageUpload({
  onUploadSuccess,
  currentImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file', { variant: 'error' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('Image size must be less than 5MB', { variant: 'error' });
      return;
    }

    setUploading(true);
    try {
      const success = await onUploadSuccess(file);
      if (success) {
        enqueueSnackbar('Avatar updated successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to update avatar', { variant: 'error' });
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      enqueueSnackbar('Failed to update avatar', { variant: 'error' });
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
