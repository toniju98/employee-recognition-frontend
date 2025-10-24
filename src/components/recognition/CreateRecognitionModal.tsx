import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  IconButton,
  Popover,
  CircularProgress
} from '@mui/material';
import { EmojiEmotions } from '@mui/icons-material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRecognitionForm } from '@/hooks/useRecognitionForm';
import { User } from '@/lib/types/admin';

interface CreateRecognitionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRecognitionModal({ open, onClose, onSuccess }: CreateRecognitionModalProps) {
  const { formData, setFormData, handleSubmit, users, usersLoading } = useRecognitionForm(() => {
    onSuccess();
    onClose();
  });

  // Debug logging removed for security
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const cursor = messageRef.current?.selectionStart || formData.message.length;
    const newMessage = 
      formData.message.slice(0, cursor) + 
      emojiData.emoji +
      formData.message.slice(cursor);
    
    setFormData({ ...formData, message: newMessage });
    setEmojiAnchor(null);
  };

  const handleRecipientChange = (_: React.SyntheticEvent, newValue: User | null) => {
    setFormData({ ...formData, recipient: newValue?.keycloakId || '' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'primary.main'
        }
      }}>
        Create Recognition
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Autocomplete
              options={(users || []).filter(user => 
                user && 
                user.firstName && 
                user.lastName && 
                user.keycloakId
              )}
              getOptionLabel={(user: User) => {
                if (!user || !user.firstName || !user.lastName) {
                  return 'Invalid User';
                }
                return `${user.firstName} ${user.lastName} (${user.department})`;
              }}
              loading={usersLoading}
              onChange={handleRecipientChange}
              noOptionsText={
                usersLoading 
                  ? "Loading users..." 
                  : (users && users.length === 0) 
                    ? "No users found. Please check if users are properly configured."
                    : "No valid users available"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recipient"
                  required
                  placeholder="Select a recipient"
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    endAdornment: (
                      <>
                        {usersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value as "TEAMWORK" | "INNOVATION" | "EXCELLENCE" | "CUSTOMER_SERVICE" })}
                required
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="TEAMWORK">Teamwork</MenuItem>
                <MenuItem value="INNOVATION">Innovation</MenuItem>
                <MenuItem value="EXCELLENCE">Excellence</MenuItem>
                <MenuItem value="CUSTOMER_SERVICE">Customer Service</MenuItem>
              </Select>
            </FormControl>
            <TextField
              multiline
              rows={4}
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              inputRef={messageRef}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={(e) => setEmojiAnchor(e.currentTarget)}
                    sx={{ position: 'absolute', bottom: 8, right: 8 }}
                  >
                    <EmojiEmotions />
                  </IconButton>
                ),
                sx: {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>

      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>
    </Dialog>
  );
}
