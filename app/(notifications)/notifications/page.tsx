'use client';
import { useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Chip,
  Box,
  Skeleton,
  Divider,
  Checkbox,
  Button
} from '@mui/material';
import {
  EmojiEvents,
  CardGiftcard,
  Stars,
  MonetizationOn,
  CheckCircle,
  RadioButtonUnchecked,
  Delete
} from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';
import { useSnackbar } from 'notistack';

export default function NotificationsPage() {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    deleteNotifications,
    selectedNotifications,
    toggleNotificationSelection 
  } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (selectedNotifications.length === 0) return;
    
    const success = await deleteNotifications(selectedNotifications);
    if (success) {
      enqueueSnackbar('Notifications deleted successfully', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to delete notifications', { variant: 'error' });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'RECOGNITION':
        return <EmojiEvents color="primary" />;
      case 'REWARD':
        return <CardGiftcard color="secondary" />;
      case 'ACHIEVEMENT':
        return <Stars sx={{ color: 'gold' }} />;
      case 'POINTS':
        return <MonetizationOn color="success" />;
      default:
        return <RadioButtonUnchecked />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {[1, 2, 3].map((n) => (
          <Paper key={n} sx={{ mb: 2, p: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Paper>
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading notifications: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
        {selectedNotifications.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete Selected ({selectedNotifications.length})
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          {notifications.map((notification, index) => (
            <>
              <ListItem
                key={notification._id}
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  transition: 'background-color 0.2s'
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!notification.read && (
                      <IconButton
                        edge="end"
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                      >
                        <CheckCircle color="action" />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <Checkbox
                  checked={selectedNotifications.includes(notification._id)}
                  onChange={() => toggleNotificationSelection(notification._id)}
                  sx={{ mr: 1 }}
                />
                <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {notification.title}
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="primary"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      {notification.message}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </>
          ))}
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography align="center" color="textSecondary">
                    No notifications yet
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}
