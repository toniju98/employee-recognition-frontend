import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Chip, Stack } from '@mui/material';
import { EmojiEvents, Person, CardGiftcard, Settings, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';
import { usePoints } from '@/hooks/usePoints';

export function Navbar() {
  const { authenticated, logout, hasRole } = useAuth();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null);
  const isAdmin = hasRole('admin');
  const { points, allocationPoints, loading } = usePoints();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'white',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600
          }}
        >
          <EmojiEvents sx={{ color: '#FFD700' }} /> Recognition
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {authenticated && (
            <>
              <NotificationsMenu />
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={loading ? 'Loading...' : `${points} Points`}
                  color="secondary"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    '& .MuiChip-label': {
                      fontWeight: 600
                    },
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Chip 
                  label={loading ? 'Loading...' : `${allocationPoints} to Give`}
                  color="secondary"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    '& .MuiChip-label': {
                      fontWeight: 600
                    },
                    backdropFilter: 'blur(8px)'
                  }}
                />
              </Stack>
              <Button
                component={Link}
                to="/dashboard"
                startIcon={<EmojiEvents sx={{ color: '#FFD700' }} />}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Feed
              </Button>
              <Button
                component={Link}
                to="/profile"
                startIcon={<Person />}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Profile
              </Button>
              <Button
                component={Link}
                to="/rewards"
                startIcon={<CardGiftcard />}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Rewards
              </Button>
              {isAdmin && (
                <Button
                  color="inherit"
                  startIcon={<Settings />}
                  onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Admin
                </Button>
              )}
              <Button
                startIcon={<Logout />}
                onClick={logout}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
        
        {/* Admin Menu */}
        <Menu
          anchorEl={adminMenuAnchor}
          open={Boolean(adminMenuAnchor)}
          onClose={() => setAdminMenuAnchor(null)}
        >
          <MenuItem 
            component={Link} 
            to="/admin/recognition-types"
            onClick={() => setAdminMenuAnchor(null)}
          >
            Recognition Types
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/admin/rewards"
            onClick={() => setAdminMenuAnchor(null)}
          >
            Rewards Management
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/admin/points"
            onClick={() => setAdminMenuAnchor(null)}
          >
            Points Distribution
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/admin/analytics"
            onClick={() => setAdminMenuAnchor(null)}
          >
            Analytics
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
