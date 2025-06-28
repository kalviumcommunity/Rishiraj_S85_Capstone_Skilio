import React, { useState } from 'react';
import { Button, TextField, Link, Grid, Box, Typography, Container, Alert } from '@mui/material';
import logo from '../assets/skilio_final.png';
import handshakeBg from '../assets/handshake-background.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const glassFieldSx = {
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    input: { color: '#181C2F', fontWeight: 500 },
    '& .MuiInputBase-input': { color: '#181C2F', fontWeight: 500 },
    '& .MuiInputLabel-root': { color: '#26425A', fontWeight: 500 },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  };

  const glassCardSx = {
    boxShadow: '0 8px 40px 0 rgba(40,40,80,0.18)',
    borderRadius: 5,
    bgcolor: 'rgba(255,255,255,0.25)',
    border: '1.5px solid rgba(255,255,255,0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    py: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #181C2F 0%, #26425A 10%, #86A8CF 35%, #E1CBD7 60%, #C38EB4 85%, #181C2F 100%)',
        overflow: 'hidden',
      }}
    >
      <img
        src={handshakeBg}
        alt="Handshake"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: 0.13,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Container
        maxWidth="xs"
        sx={{ ...glassCardSx, zIndex: 1 }}
      >
        <img src={logo} alt="Skilio Logo" style={{ width: 110, height: 110, marginBottom: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 2, fontWeight: 600, color: '#fff' }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={glassFieldSx}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={glassFieldSx}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
} 