import { Recognition } from "@/lib/types/recognition";
import { Card, CardContent, Box, Typography, Chip, Avatar } from "@mui/material";
import { ThumbUp, PushPin } from "@mui/icons-material";
import { Emoji } from 'emoji-picker-react';
import { useTheme } from '@mui/material/styles';

interface RecognitionCardProps {
  recognition: Recognition;
}

export function RecognitionCard({ recognition }: RecognitionCardProps) {
  console.log("recognitioasdan", recognition);
  const theme = useTheme();

  const renderMessage = (message: string) => {
    return message.split(/(\p{Emoji}+)/gu).map((part, index) => {
      if (part.match(/\p{Emoji}+/gu)) {
        const unified = Array.from(part)
          .map(char => char.codePointAt(0)?.toString(16))
          .join('-');
        return (
          <Emoji 
            key={index}
            unified={unified}
            size={22}
          />
        );
      }
      return part;
    });
  };

  return (
    <Card
      sx={{
        mb: 2,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 12px 24px ${theme.palette.primary.light}20`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={`http://localhost:5000/uploads/profiles/${recognition.sender.profileImage}`}
              alt={recognition.sender.name}
              sx={{
                width: 48,
                height: 48,
                border: (theme) => `2px solid ${theme.palette.primary.light}30`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                From: {recognition.sender.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                To: {recognition.recipient.name}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ ml: "auto", display: "flex", gap: 2, alignItems: "center" }}
          >
            {recognition.pinnedUntil && (
              <PushPin sx={{ color: "primary.main", opacity: 0.8 }} />
            )}
            <Chip
              label={recognition.category.toLowerCase()}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                borderColor: (theme) => `${theme.palette.primary.main}30`,
                fontWeight: 500,
                "& .MuiChip-label": {
                  px: 2,
                },
              }}
            />
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: "text.primary",
            lineHeight: 1.6,
            letterSpacing: 0.2,
          }}
        >
          {renderMessage(recognition.message)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            mt: 2,
            opacity: 0.8,
          }}
        >
          {new Date(recognition.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
