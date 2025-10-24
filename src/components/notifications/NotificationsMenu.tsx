import { useState, useMemo, useCallback } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  ListItemIcon
} from '@mui/material';
import {
  Notifications,
  EmojiEvents,
  CardGiftcard,
  Stars,
  MonetizationOn
} from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const NotificationsMenu = memo(function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, loading, markAsRead } = useNotifications();

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const getIcon = useCallback((type: string) => {
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
        return <Notifications />;
    }
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        {loading ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={20} />
          </Box>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <MenuItem
                key={notification._id}
                component={Link}
                to="/notifications"
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification._id);
                  }
                  handleClose();
                }}
                sx={{
                  whiteSpace: 'normal',
                  py: 1
                }}
              >
                <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <MenuItem 
              component={Link} 
              to="/notifications" 
              onClick={handleClose}
              sx={{ justifyContent: 'center', color: 'primary.main' }}
            >
              <Typography>View All</Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
});

export { NotificationsMenu };
