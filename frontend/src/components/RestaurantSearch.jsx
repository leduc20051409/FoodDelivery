import { TextField, InputAdornment, IconButton } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const RestaurantSearch = ({ searchQuery, setSearchQuery }) => {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search Spaghetti, Tiramisu..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: searchQuery && (
          <InputAdornment position="end">
            <IconButton onClick={handleClearSearch} edge="end">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        mb: 4,
        maxWidth: { lg: '50%' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#d1d1d1',
          },
          '&:hover fieldset': {
            borderColor: '#b0b0b0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#F06292',
          },
        },
        '& .MuiInputBase-input': {
          fontSize: '1rem',
        },
      }}
    />
  );
};

export default RestaurantSearch;