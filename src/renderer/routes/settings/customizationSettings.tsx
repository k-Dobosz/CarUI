import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CustomizationSettings() {
  return (
    <Link to="/settings" className="settings_row">
      Back
    </Link>
  );
}
